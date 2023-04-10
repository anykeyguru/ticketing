import { randomBytes } from 'crypto';
import { app } from './app';
// DB Mongo
import mongoose from 'mongoose';
// NATS Streaming
import { natsWrapper } from './nats-wrapper';

// Vars
const PORT: number = 3000;
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    };
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    };

    const options: mongoose.ConnectOptions = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    };

    mongoose.set('strictQuery', false);
    try {
        await natsWrapper.connect('ticketing', `tickets-srv`, 'http://nats-srv:4222')
        await mongoose.connect(process.env.MONGO_URI, options).catch((error) => {
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