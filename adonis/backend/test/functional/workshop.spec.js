const { test, trait } = use('Test/Suite')('Workshop');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');

test('it should be able to create workshop', 
async ({ assert, client }) => {

    const sessionPayload = {
    email: 'fkinvest@gmail.com',
    password: '123456',
  };

  const user = await Factory.model('App/Models/User').create(sessionPayload)


  console.log(user)
  const response = await client
    .post('/workshops')
    .send({
        title: 'utilizando Node.js para construir API`s seguras e performáticas',
        description: 'Se você já procurou sobre as melhores linguagens então você já sabe',
        user_id: user.id,
        section: 1
    })
    .end();

  response.assertStatus(201);

  assert.exists(response.body.id);
});
