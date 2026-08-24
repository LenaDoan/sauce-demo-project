import { test, expect } from '@playwright/test';
import data from '../resources/data-test/api-data-input.json' with { type: 'json' };

let token;
test.beforeAll('Create token for user', async ({ request }) => {
    const response = await request.post(`${data.base_url}/auth`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: data.login.username,
            password: data.login.password,
        },
    });
    const responseBody = await response.json();
    token = responseBody.token;
    expect(token).toBeTruthy();
});

test('Create token for user', async ({ request }) => {
    const response = await request.post(`${data.base_url}/auth`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: data.login.username,
            password: data.login.password,
        },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody.token.length).toBeGreaterThan(0);
});

test('Get booking ids', async ({ request }) => {
    const response = await request.get(`${data.base_url}/booking`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);
});

test('Create booking', async ({ request }) => {
    let bookingid;
    try {
        const response = await request.post(`${data.base_url}/booking`, {
            headers: { Accept: 'application/json' },
            data: data.createBooking,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        bookingid = body.bookingid;
        expect(bookingid).toEqual(expect.any(Number));
        expect(body.booking).toEqual(data.createBooking);
    } finally {
        if (bookingid) {
            const cleanupResponse = await request.delete(`${data.base_url}/booking/${bookingid}`, {
                headers: { Cookie: `token=${token}` },
            });
            if (cleanupResponse.status() !== 201) {
                console.error(`Failed to cleanup booking ${bookingid}. status: ${cleanupResponse.status()}`);
            }
        }
    }
});

test.describe('Required token and bookingids', () => {
    let bookingid;

    test.beforeEach('Create token and bookingid', async ({ request }) => {
        const createResponse = await request.post(`${data.base_url}/booking`, {
            headers: { Accept: 'application/json' },
            data: data.createBooking,
        });
        const createBody = await createResponse.json();
        bookingid = createBody.bookingid;
        expect(bookingid).toBeTruthy();
    });

    test('Get booking', async ({ request }) => {
        const response = await request.get(`${data.base_url}/booking/${bookingid}`, {
            headers: { Accept: 'application/json' },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(data.createBooking);
    });

    test('Update booking', async ({ request }) => {
        const response = await request.put(`${data.base_url}/booking/${bookingid}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: `token=${token}`,
            },
            data: data.updateBooking,
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(data.updateBooking);
    });

    test('Partial update booking', async ({ request }) => {
        const response = await request.patch(`${data.base_url}/booking/${bookingid}`, {
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
    });

    test('Delete booking', async ({ request }) => {
        const response = await request.delete(`${data.base_url}/booking/${bookingid}`, {
            headers: { Cookie: `token=${token}` },
        });
        expect(response.status()).toBe(201);
        const getBookingIdResponse = await request.get(`${data.base_url}/booking/${bookingid}`, {
            headers: { Cookie: `token=${token}` },
        });
        expect(getBookingIdResponse.status()).toBe(404);
    });
});
