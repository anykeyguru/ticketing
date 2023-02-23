import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});


it('returns 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@testcom',
            password: 'password'
        })
        .expect(400);
});

it('retunrs 400 with an invalid password < 4 char', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400);
});

it('retunrs 400 with an invalid password > 20 char', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'qwertyuioplkjhgfdsazxcvbn'
        })
        .expect(400);
});

it('retunrs 400 with missing email or password field', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'qwertyuioplkjhgfdsazxcvbn'
        })
        .expect(400);
});

it('retunrs 400 with missing email and password fields', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('dissalows duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});


it('sets a cookie at successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();

});
