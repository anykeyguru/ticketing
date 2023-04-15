import request from 'supertest';
import { app } from '../../app';


it('can fetch a list of tickets My Ver ', async () => {

    const response = await request(app)
        .delete('/api/orders/123')
        .send()

    expect(response.text).toEqual("123");
});