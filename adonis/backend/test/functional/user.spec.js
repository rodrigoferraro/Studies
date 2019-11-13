const {
  test,
  trait
} = use('Test/Suite')('User');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Helpers = use('Helpers');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('it should be able to update profile data',
  async ({
    assert,
    client
  }) => {

    const user = await Factory.model('App/Models/User').create({
      username:'Rodrigo'
    })

    const response = await client
      .put('/profile')
      .loginVia(user, 'jwt')
      .field('username', 'João')
      .field('job_title', 'Analista')
      .attach('avatar', Helpers.tmpPath('test/avatar.png'))
      .end();

    response.assertStatus(200);

    assert.equal(response.body.username, 'João');
    assert.equal(response.body.job_title, 'Analista');
    assert.exists(response.body.avatar);
  });
