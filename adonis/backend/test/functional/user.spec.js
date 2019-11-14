const {
  test,
  trait
} = use('Test/Suite')('User');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Helpers = use('Helpers');
const Hash = use('Hash');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('it should be able to update profile data',
  async ({
    assert,
    client
  }) => {

    const user = await Factory.model('App/Models/User').create({
      username:'Rodrigo', 
      password: '123456'
    })

    const response = await client
      .put('/profile')
      .loginVia(user, 'jwt')
      .field('username', 'João')
      .field('job_title', 'Analista')
      .field('password', '321321')
      .field('password_confirmation', '321321')
      .attach('avatar', Helpers.tmpPath('test/avatar.png'))
      .end();

    response.assertStatus(200);

    assert.equal(response.body.username, 'João');
    assert.equal(response.body.job_title, 'Analista');
    assert.exists(response.body.avatar);

    await user.reload()

    assert.isTrue(await Hash.verify('321321', user.password))

  });
