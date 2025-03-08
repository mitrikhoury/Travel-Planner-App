const request = require('supertest');
const app = require('./server'); // Import the exported app

let server; // Store the server instance

beforeAll(() => {
  server = app.listen(8081, () => console.log('Test server running on port 8081'));
});

afterAll((done) => {
  server.close(done); // Close the server after tests
});

describe('Test the root path', () => {
  test('It should respond with 200 status', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
