import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBook extends Document {
    title: string;
    author: string;
    year: number;
    pages: number;
    language: string;
    country: string;
    imageLink: string;
    link: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema: Schema<IBook> = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true },
    language: { type: String, required: true },
    country: { type: String, required: true },
    imageLink: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: Number, required: true },
});

BookSchema.index({ title: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ year: 1 });
BookSchema.index({ language: 1 });
BookSchema.index({ country: 1 });

const Book: Model<IBook> = mongoose.model<IBook>("Book", BookSchema);

export default Book;