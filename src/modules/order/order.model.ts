import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IOrder extends Document {
    _id: Types.ObjectId;
    customer: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    totalCreditsEarned: number;
    isFirstPurchase: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    book: Types.ObjectId;
    quantity: number;
    price: number;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 1,
        },
    }
);

const OrderSchema = new Schema<IOrder>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        items: {
            type: [OrderItemSchema],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0.01,
        },
        totalCreditsEarned: {
            type: Number,
            required: true,
            min: 0,
        },
        isFirstPurchase: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

OrderSchema.index({ userId: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);