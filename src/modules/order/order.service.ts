import { OrderQuerySchemaType, CreateOrderSchemaType, OrderItemSchemaType } from "./order.schema.js";
import { IOrder, Order } from "./order.model.js";
import User from "../user/user.model.js";
import userService from "../user/user.service.js";
import mongoose, { FilterQuery, Types } from "mongoose";
import bookService from "../book/book.service.js";
import { Referral, ReferralStatus } from "../referral/referral.model.js";
import referralService from "../referral/referral.service.js";

const FIRST_PURCHASE_CREDITS = 2;

const createOrder = async (order: CreateOrderSchemaType) => {
    const { customerId, items } = order;

    const customer = await userService.findById(customerId as string);
    if (!customer) {
        throw new Error("Customer not found");
    }

    const bookIds = items.map((item: OrderItemSchemaType) => item.bookId);
    const validatedBooks = await bookService.validateBulkBookIds(bookIds);

    const orderItems = validatedBooks.map(book => {
        const item = items.find(i => i.bookId === (book._id as Types.ObjectId).toString());
        return {
            book: book._id as Types.ObjectId,
            quantity: item!.quantity,
            price: book.price
        };
    });

    const totalAmount = orderItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    const existingOrderCount = await Order.countDocuments({
        customerId: new Types.ObjectId(customerId)
    });

    const isFirstPurchase = existingOrderCount === 0;


    const orderData: Partial<IOrder> = {
        customer: new Types.ObjectId(customerId),
        items: orderItems,
        totalAmount,
        isFirstPurchase,
        totalCreditsEarned: 0
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [newOrder] = await Order.create([orderData], { session });

        if (isFirstPurchase && customer.referredBy) {
            const referrer = await referralService.findOnePendingByReferredUser(customer._id.toString());


            if (referrer) {
                await Referral.updateOne(
                    {
                        referredUser: customer._id as Types.ObjectId
                    },
                    {
                        status: ReferralStatus.CONVERTED,
                        $inc: { creditsAwarded: FIRST_PURCHASE_CREDITS },
                        convertedAt: new Date()
                    },
                    { session }
                );


                await Promise.all([
                    User.updateOne(
                        { _id: referrer.referredUser },
                        { $inc: { credits: FIRST_PURCHASE_CREDITS } },
                        { session }
                    ),
                    User.updateOne(
                        { _id: referrer.referrerUser },
                        { $inc: { credits: FIRST_PURCHASE_CREDITS } },
                        { session }
                    ),
                    Order.updateOne(
                        { _id: newOrder._id },
                        { $set: { totalCreditsEarned: FIRST_PURCHASE_CREDITS } },
                        { session }
                    )
                ]);
            }
        }

        await session.commitTransaction();

        return newOrder;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getOrders = async (query: OrderQuerySchemaType) => {
    const { page, limit, sort, customerId } = query

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = sort === "asc" ? 1 : -1;

    const filter: FilterQuery<IOrder> = {};
    if (customerId) {
        filter.customer = new Types.ObjectId(customerId);
    }

    const orders = await Order.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .select("-__v")
        .populate("customer", "name email")
        .populate("items.book", "title author year language country price")
        .lean();

    const total = await Order.countDocuments(filter);

    return {
        data: orders,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit)
        }
    };
};

const getOrderById = async (id: string) => {
    return await Order.findById(id)
        .select("-__v")
        .populate("customer", "name email")
        .populate("items.book", "title author year language country price")
        .lean();
};



export default {
    createOrder,
    getOrders,
    getOrderById
};