const { test, describe, after, beforeEach } = require('node:test');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const assert = require('node:assert');

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('creation fails if username or password missing', async () => {
    const newUser = { name: 'Test User' };
    const res = await api.post('/api/users').send(newUser).expect(400);
    assert(res.body.error.includes('username and password required'));
  });

  test('creation fails if username or password too short', async () => {
    const newUser = { name: 'Test User', username: 'ab', password: '12' };
    const res = await api.post('/api/users').send(newUser).expect(400);
    assert(res.body.error.includes('at least 3 characters'));
  });

  test('creation fails if username is not unique', async () => {
    const user = { name: 'User1', username: 'uniqueuser', password: '12345' };
    await api.post('/api/users').send(user);
    const res = await api.post('/api/users').send(user).expect(400);
    assert(res.body.error.includes('username must be unique'));
  });

  after(async () => {
    await mongoose.connection.close();
  });
});