const { test, trait } = use('Test/Suite')('Forgot Password');

const Mail = use('Mail');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

// /** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
//const User = use('App/Models/User');


trait('DatabaseTransactions')
trait('Test/ApiClient')

test('it should send an email with reset password instructions', async ({ assert, client }) => {
    
    Mail.fake();

    const forgotPayload = {
        email: 'fkinvest@gmail.com',
    };

    const user = await Factory
      .model('App/Models/User')
      .create(forgotPayload);

      const response = await client
      .post('/forgot')
      .send(forgotPayload)
      .end()

    response.assertStatus(204);

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, forgotPayload.email);

  const token = await user.tokens().first();
  
  assert.include(token.toJSON(), {
      user_id: user.id,
      type: 'forgotpassword'
  });

  console.log(token);

  
  Mail.restore()
});