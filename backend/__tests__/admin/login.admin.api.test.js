const request = require('supertest');
const app = require('../../app')

var isValidResLogin = function (res) {
    expect(res.body.success).toBe(true)
    expect(res.body.data.accesstoken)
    expect(res.body.data.refreshtoken)
    expect(res.body.message)
};
var isValidResForFailLogin = function (res) {
    expect(res.body.success).toBe(false)
    expect(res.body.message)
};

describe("Login", () => {
    it("should get successful", async () => {
        const res = await request(app).post('/api/admin/login')
            .send({ email: 'pallav.saikia@styldod.com', password: '123456' })
            .set('Accept', 'application/json')
            .expect(200)
        isValidResLogin(res)
    });
    it("should get 401 error because inactive", async () => {
        const res = await request(app).post('/api/admin/login')
            .send({ email: 'kiranlal@gmail.com', password: 'test@!@@styldod1!.com' })
            .set('Accept', 'application/json')
            .expect(401)
        expect(res.body.message).toBe('Wrong Login Cred')
        isValidResForFailLogin(res)
    });
    it("should get 401 error", async () => {
        const res = await request(app).post('/api/admin/login')
            .send({ email: '', password: '12d3456' })
            .set('Accept', 'application/json')
            .expect(401)
        expect(res.body.message).toBe('Wrong Login Cred')
        isValidResForFailLogin(res)
    });
});