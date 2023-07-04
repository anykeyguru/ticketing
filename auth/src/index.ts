import {app} from './app';
// DB Mongo
import mongoose from 'mongoose';
// Vars
const PORT: number = 3000;
const start = async () => {
    console.log(`Starting on port ${PORT} ...`);
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    ;
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    ;
    const options = {
        // autoIndex: false, // Don't build indexes
        // maxPoolSize: 10, // Maintain up to 10 socket connections
        // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // family: 4, // Use IPv4, skip trying IPv6
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    };
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(process.env.MONGO_URI).catch((error) => {
            console.log(`Mconn ${error.messages}`);
        });
        console.log(`Connected to MongoDB: ${process.env.MONGO_URI}`);
    } catch (error) {
        console.log(`Error catch ${error}`);

    }
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

start();