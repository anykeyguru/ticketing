import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';
import jwt from "jsonwebtoken";


declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51NGyVKCncKQkrqI3hNETzLz0CoWt8shrMfiynVhu19mRHXSSSnouAP6wp738TfAVTJ0EMBBM5ImC8CADOIbABC9100An4s1YPR';

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'qwerty';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "tests@tests.com"
    }

    // Create jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build a session object {jwt: MY_JWT} "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWQ1NjE0ZWUwZjcyY2ViNWY1ODRlOCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTY3OTY0NDE4MH0.ekQOmMQUZOQ8-N_4ePRLh20VhFKP3Zbzf2pPaEYlEKo"
    const session = {jwt: token}

    // /Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take and ecode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a strings
    return [`session=${base64}`];
}

