const { test, trait } = use('Test/Suite')('Forgot Password');
const { format, subMinutes } = require('date-fns')

const Mail = use('Mail');
const Hash = use('Hash');
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');


trait('DatabaseTransactions')
trait('Test/ApiClient')

test('it should send an email with reset password instructions', 
  async ({ assert, client }) => {
    Mail.fake()
    const email = 'fkinvest@gmail.com';

    const user = await Factory
    .model('App/Models/User')
    .create({ email });

    await client
      .post('/forgot')
      .send({ email })
      .end()

    const token = await user.tokens().first();

    const recentEmail = Mail.pullRecent();
    assert.equal(recentEmail.message.to[0].address, email);
    assert.include(token.toJSON(), {
      type: 'forgotpassword'
    });
    Mail.restore()
});

// TEST CASE - Processo de Redefinição de Senha
test('it should be able to reset password', 
  async ({ assert, client }) => {
    const email = 'fkinvest@gmail.com'
    const type = 'forgotpassword';

    const user = await Factory.model('App/Models/User').create({ email })
    const userToken = await Factory.model('App/Models/Token').make({ type })

    await user.tokens().save(userToken)

    const response = await client
      .post('/reset')
      .send({
        token: userToken.token,
        password: '123123',
        password_confirmation: '123123'
      })
      .end()
    await user.reload();

    const verifyNewPassword = await Hash.verify('123123', user.password);
    assert.isTrue(verifyNewPassword);
});

test('it should be able to reset password within 2 hours after token generation', 
  async ({ assert, client }) => {
    const email = 'fkinvest@gmail.com'

    const user = await Factory.model('App/Models/User').create({ email })
    const userToken = await Factory.model('App/Models/Token').make()

    await user.tokens().save(userToken)
    
    await Database
      .table('tokens')
      .where('token', userToken.token)
      .update('created_at', format(subMinutes(new Date(), 119), 'yyyy-MM-dd HH:mm:ss'))

    await userToken.reload()

    const response = await client
      .post('/reset')
      .send({
        token: userToken.token,
        password: '123123',
        password_confirmation: '123123'
      })
      .end()
    
    await user.reload();

    const verifyNewPassword = await Hash.verify('123123', user.password);
    assert.isTrue(verifyNewPassword);
    
});


test('it should block reset password if token was generated more than 2 hours ago', 
async ({ assert, client }) => {
    const email = 'fkinvest@gmail.com'

    const user = await Factory.model('App/Models/User').create({ email })
    const userToken = await Factory.model('App/Models/Token').make()

    await user.tokens().save(userToken)
    
    await Database
      .table('tokens')
      .where('token', userToken.token)
      .update('created_at', format(subMinutes(new Date(), 120), 'yyyy-MM-dd HH:mm:ss'))

    await userToken.reload()

    const response = await client
      .post('/reset')
      .send({
        token: userToken.token,
        password: '123123',
        password_confirmation: '123123'
      })
      .end()
    
    await user.reload();

    const verifyNewPassword = await Hash.verify('123123', user.password);
    assert.isFalse(verifyNewPassword);
    
});
