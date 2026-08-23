import { test, expect } from '@playwright/test';

test('Create token for user', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: 'admin',
            password: 'password123',
        },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody.token.length).toBeGreaterThan(0);
    console.log(responseBody.token);
});

test('Get booking ids', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking');
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);
    console.log(responseBody);
});

test.describe('Required token and bookingids', () => {
    let token;
    let bookingid;
    test.beforeEach('Create token and bookingid', async ({ request }) => {
        // 1) Create a fresh token — hardcoded / expired tokens return 403
        const authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
            data: {
                username: 'admin',
                password: 'password123',
            },
        });
        expect(authResponse.status()).toBe(200);
        const authResponseBody = await authResponse.json();
        token = authResponseBody.token;
        expect(token).toBeTruthy();

        // 2) Create a booking to update (avoid relying on shared booking/1)
        const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
            headers: { Accept: 'application/json' },
            data: {
                firstname: 'Jim',
                lastname: 'Brown',
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                    checkin: '2026-08-23',
                    checkout: '2026-08-24',
                },
                additionalneeds: 'Breakfast',
            },
        });
        expect(createResponse.status()).toBe(200);
        const createBody = await createResponse.json();
        bookingid = createBody.bookingid;
        expect(bookingid).toBeTruthy();
    });

    test('Get booking', async ({ request }) => {
        const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
            headers: { Accept: 'application/json' },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('firstname');
        expect(typeof responseBody.firstname).toBe('string');

        expect(responseBody).toHaveProperty('lastname');
        expect(typeof responseBody.lastname).toBe('string');

        expect(responseBody).toHaveProperty('totalprice');
        expect(typeof responseBody.totalprice).toBe('number');

        expect(responseBody).toHaveProperty('depositpaid');
        expect(typeof responseBody.depositpaid).toBe('boolean');

        expect(responseBody).toHaveProperty('bookingdates');
        expect(typeof responseBody.bookingdates).toBe('object');
        expect(responseBody).toHaveProperty('additionalneeds');
        console.log(responseBody);
    });

    test('Update booking', async ({ request }) => {
        // 3) Update with Cookie: token=<real token>
        const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: `token=${token}`,
            },
            data: {
                firstname: 'James',
                lastname: 'Brown',
                totalprice: 222,
                depositpaid: false,
                bookingdates: {
                    checkin: '2026-08-23',
                    checkout: '2026-08-25',
                },
                additionalneeds: 'Lunch',
            },
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe('James');
        expect(responseBody.totalprice).toBe(222);
        console.log(responseBody);
    });

    test('Partial update booking', async ({ request }) => {
        // 3) Partial update with Cookie: token=<real token>
        const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: `token=${token}`,
            },
            data: {
                firstname: 'James',
            },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe('James');
        console.log(responseBody);
    });

    test('Delete booking', async ({ request }) => {
        const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingid}`,{
            headers:{'cookie': `token=${token}`}
        });
        expect(response.status()).toBe(201);
    })
})