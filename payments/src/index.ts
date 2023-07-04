import {randomBytes} from 'crypto';
import {app} from './app';
// DB Mongo
import mongoose from 'mongoose';
// NATS Streaming
import {natsWrapper} from './nats-wrapper';
//Listeners
import {OrderCreatedListener} from "./events/listeners/order-created-listener";
import {OrderCancelledListener} from "./events/listeners/order-cancelled-listener";
import {PaymentCreatedListener} from "./events/listeners/payment-created-listener";

// Vars
const PORT: number = 3000;
const start = async () => {
    console.log('Starting...');
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    ;
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    ;
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined");
    }
    ;
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined");
    }
    ;
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined");
    }
    ;

    const options: mongoose.ConnectOptions = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    };

    mongoose.set('strictQuery', false);
    try {

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

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