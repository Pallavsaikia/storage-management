const supertest = require('supertest');
const app = require('../../app')

var isValidResonseBody = function (res) {
    expect(res.body).toEqual(
        expect.objectContaining({
            success: expect.any(Boolean),
            message: expect.any(String),
            data: expect.any(Object),
            __t: expect.any(Number)
        }))
};

const request = supertest(app);


jest.mock("../../middleware/jwt_check", () => ({
    jwtcheck: (req, res, next) => {
        res.locals.user = "63985ea7fdab1ccd86e237cf";
        next()
    }
}));


describe("Sets for page 1", () => {
    let res
    it("should be valid response", async () => {
        res = await request.get('/api/admin/sets?page=1')
        isValidResonseBody(res)

    });

    it("success should be true", async () => {
        expect(res.body.success).toBe(true)
    });
    it("should contain totalCount and sets(array)", async () => {
        expect(res.body.data).toEqual(
            expect.objectContaining({
                totalCount: expect.any(Number),
                sets: expect.any(Array)
            }))
    });

});

describe("Sets for page 100", () => {
    let res
    it("should be valid response", async () => {
        res = await request.get('/api/admin/sets?page=100')
        isValidResonseBody(res)

    });
    it("should contain totalCount and sets(array)", async () => {
        expect(res.body.data).toEqual(
            expect.objectContaining({
                totalCount: expect.any(Number),
                sets: expect.any(Array)
            }))
    });

});

describe("For a Particular  set get", () => {
    let res
    it("should be valid response", async () => {
        res = await request.get('/api/admin/sets/63f79f04fbe850e15c2b0ea0')
        isValidResonseBody(res)
    });

    it("data should have set details and activity array", async () => {
        expect(res.body.data).toEqual(
            expect.objectContaining({
                set: expect.any(Object),
                activity: expect.any(Array)
            }))
    });
});

describe("For wrong  set id", () => {
    let res, res1
    it("should be valid response and 500", async () => {
        res = await request.get('/api/admin/sets/63f79f04fdd0e15cee0ea0').expect(500)
        isValidResonseBody(res)
        res1 = await request.get('/api/admin/sets/da').expect(500)
        isValidResonseBody(res1)
    });

    it("data should have set details and activity array", async () => {
        expect(res.body.success).toBe(false)
        expect(res1.body.success).toBe(false)
    });


});

describe("list all rooms in set", () => {
    let res, res1
    it("should be valid response for both set id passed and not passed", async () => {
        res = await request.get('/api/admin/sets/list-all-rooms/63f79f04fbe850e15c2b0ea0').expect(200)
        res1 = await request.get('/api/admin/sets/list-all-rooms/').expect(500)
        isValidResonseBody(res1)
        isValidResonseBody(res)
    });

    it("data should have set details and activity array", async () => {
        expect(res.body.data).toEqual(
            expect.objectContaining({
                rooms: expect.any(Object)
            }))
    });


});
