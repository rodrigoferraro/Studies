const { test, trait } = use('Test/Suite')('Session');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');

test('it should return JWT token when session created', 
async ({ assert, client }) => {
  const sessionPayload = {
    email: 'fkinvest@gmail.com',
    password: '123456',
  };
await Factory.model('App/Models/User').create(sessionPayload)
  const response = await client
    .post('/sessions')
    .send(sessionPayload)
    .end();

  response.assertStatus(200);

  assert.exists(response.body.token);
});
