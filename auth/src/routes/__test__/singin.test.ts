import request from 'supertest';
import {app} from '../../app';


it('returns 400 fails when a email that does not exis is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test1@tests.com',
            password: 'password123'
        })
        .expect(400);
});

it('returns 201 good  signin ', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns 400 fails bad email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'tests@testcom',
            password: 'password'
        })
        .expect(400);

});

it('returns 400 fails bad password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'tests@tests.com',
            password: 'password123'
        })
        .expect(400);

});

it('returns 400 fails empty password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'tests@tests.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'tests@tests.com',
            password: ''
        })
        .expect(400);

});
