import request from 'supertest';
import {app} from '../../app';

it('response with details of current user', async () => {
    const cookie = await global.signup(201);

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    // console.log(response.body);

    expect(response.body.currentUser.email).toEqual('tests@tests.com');
});

it('response with bull if not auth-ed', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    expect(response.body.currentUser).toEqual(null);
});