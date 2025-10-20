// mongo db
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {

        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is not defined in the environment variables"
            );
        }


        await mongoose.connect(process.env.MONGO_URI);

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    } catch (error) {
        throw new Error(`Failed to connect to mongoDB: ${error}`);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
    } catch (error) { }
};