import {app} from './app';
// DB Mongo
import mongoose from 'mongoose';
// NATS Streaming
import {natsWrapper} from './nats-wrapper';
import {TicketCreatedListener} from "./events/listeners/ticket-created-listener";
import {TicketUpdatedListener} from "./events/listeners/ticket-updated-listener";
import {ExpirationCompleteListener} from "./events/listeners/expiration-complete-listener";
import {PaymentCreatedListener} from "./events/listeners/payment-created-listener";


// Vars
const PORT: number = 3000;
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined");
    }

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

        //Create listenners instanses
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
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