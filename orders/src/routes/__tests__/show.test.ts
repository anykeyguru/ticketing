import request from 'supertest';
import { app } from '../../app';


it('can fetch a list of tickets My Ver ', async () => {

    const response = await request(app)
        .get('/api/orders/321')
        .send()

    expect(response.text).toEqual("321");
});