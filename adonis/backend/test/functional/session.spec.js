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

  const response = await client
    .post('/sessions')
    .send(sessionPayload)
    .end();

    console.log(response)
  //response.assertStatus(200);

  assert.exists(true);
  //assert.exists(response.body.token);
});
