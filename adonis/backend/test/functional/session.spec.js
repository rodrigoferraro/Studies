const { test, trait } = use('Test/Suite')('Session');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');


trait('Test/ApiClient')

test('it should return JWT token when session created', async ({ assert, client }) => {
    const user = await User.create({
        username: 'Rodrigo Ferraro',
        email: 'fkinvest@gmail.com',
        password: '123456'
    });

    const response = await client
      .post('/sessions')
      .send({
        email: 'fkinvest@gmail.com',
        password: '123456'
    }).end()

    response.assertStatus(200);

    assert.exists(response.body.token);
});