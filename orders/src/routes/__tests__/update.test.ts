import request from 'supertest';
import { app } from '../../app';


it('can fetch a list of tickets My Ver ', async () => {

    const response = await request(app)
        .put('/api/orders/test')
        .send()

    expect(response.text).toEqual("updated");
});