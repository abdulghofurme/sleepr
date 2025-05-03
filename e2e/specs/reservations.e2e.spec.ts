describe('Reservations', () => {
  let jwt: string;
  let reservationId: string;
  beforeAll(async () => {
    const user = {
      email: 'e2e@sleepr.com',
      password: 'StrongPassowrd123!@',
    };

    // Register;
    await fetch('http://auth:3001/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const loginResponse = await fetch('http://auth:3001/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const loginResponseJSON = await loginResponse.json();
    jwt = loginResponseJSON.access_token;
  });

  test('Create', async () => {
    const reservation = {
      startDate: '22-01-2025',
      endDate: '23-04-2025',
      charge: {
        amount: 5,
      },
    };
    const createResponse = await fetch(
      'http://reservations:3000/reservations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
        body: JSON.stringify(reservation),
      },
    );
    expect(createResponse.ok).toBeTruthy();
    const createResponseJSON = await createResponse.json();
    expect(createResponseJSON._id).toBeDefined();
    reservationId = createResponseJSON._id;
  });

  test('Get', async () => {
    const response = await fetch(
      `http://reservations:3000/reservations/${reservationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
      },
    );
    expect(response.ok).toBeTruthy();
    const responseJSON = await response.json();
    expect(responseJSON._id).toEqual(reservationId);
  });

  test('Delete', async () => {
    const response = await fetch(
      `http://reservations:3000/reservations/${reservationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
      },
    );
    expect(response.ok).toBeTruthy();
    const responseJSON = await response.json();
    expect(responseJSON._id).toEqual(reservationId);
  });

  afterAll(async () => {
    await fetch('http://auth:3001/users/me', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
    });
  });
});
