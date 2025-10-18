import { OrderQuerySchemaType, CreateOrderSchemaType, OrderItemSchemaType } from "./order.schema";
import { IOrder, Order } from "./order.model";
import User from "../user/user.model";
import userService from "../user/user.service";
import mongoose, { FilterQuery, Types } from "mongoose";
import bookService from "../book/book.service";
import { Referral, ReferralStatus } from "../referral/referral.model";
import ENV from "../../ENV";

const createOrder = async (order: CreateOrderSchemaType) => {
    const { customerId, items } = order;

    const customer = await userService.findById(customerId);
    if (!customer) {
        throw new Error("Customer not found");
    }

    const bookIds = items.map((item: OrderItemSchemaType) => item.bookId);
    const validatedBooks = await bookService.validateBulkBookIds(bookIds);

    if (validatedBooks.length !== items.length) {
        const foundIds = validatedBooks.map(b => (b._id as Types.ObjectId).toString());
        const missingIds = bookIds.filter(id => !foundIds.includes(id));
        throw new Error(`Books not found: ${missingIds.join(', ')}`);
    }

    const orderItems = validatedBooks.map(book => {
        const item = items.find(i => new Types.ObjectId(i.bookId) === book._id);
        return {
            bookId: book._id as Types.ObjectId,
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

    const totalCreditsEarned = isFirstPurchase ? ENV.FIRST_PURCHASE_CREDITS : 0;

    const orderData: Partial<IOrder> = {
        customerId: new Types.ObjectId(customerId),
        items: orderItems,
        totalAmount,
        isFirstPurchase,
        totalCreditsEarned
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [newOrder] = await Order.create([orderData], { session });

        if (isFirstPurchase && customer.referredBy) {
            const referrer = await userService.findById(customer.referredBy.toString());

            if (referrer) {
                await Referral.updateOne(
                    {
                        referrerUserId: referrer._id,
                        referredUserId: customer._id
                    },
                    {
                        status: ReferralStatus.CONVERTED,
                        $inc: { creditsAwarded: ENV.FIRST_PURCHASE_CREDITS },
                        convertedAt: new Date()
                    },
                    { session }
                );

                await Promise.all([
                    User.updateOne(
                        { _id: referrer._id },
                        { $inc: { credits: ENV.FIRST_PURCHASE_CREDITS } },
                        { session }
                    ),
                    User.updateOne(
                        { _id: customer._id },
                        { $inc: { credits: ENV.FIRST_PURCHASE_CREDITS } },
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
        filter.customerId = new Types.ObjectId(customerId);
    }

    const orders = await Order.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .select("-__v")
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
    return await Order.findById(id).select("-__v").lean();
};



export default {
    createOrder,
    getOrders,
    getOrderById
};