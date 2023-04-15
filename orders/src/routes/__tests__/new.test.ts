import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('can fetch a list of tickets My Ver ', async () => {

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            tickedId: new mongoose.Types.ObjectId().toHexString(),
            price: 321
        })

    expect(response.text).toEqual("posted");
});