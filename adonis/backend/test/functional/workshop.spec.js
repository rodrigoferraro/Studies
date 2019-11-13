const { test, trait } = use('Test/Suite')('Workshop');

/** @type {typeof import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('DatabaseTransactions');
trait('Test/ApiClient');
trait('Auth/Client');

test('it should be able to create workshops', 
async ({ assert, client }) => {

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post('/workshops')
    .loginVia(user, 'jwt')
    .send({
        title: 'utilizando Node.js para construir API`s seguras e performáticas',
        description: 'Se você já procurou sobre as melhores linguagens então você já sabe',
        user_id: user.id,
        section: 1,
    })
    .end();

  response.assertStatus(201);

  assert.exists(response.body.id);
});

test('it should be able to list workshops', 
async({
  assert, 
  client
})=>{
  const user = await Factory.model('App/Models/User').create()
  const workshop = await Factory.model('App/Models/Workshop').make({
    section: 2,
  })

  await user.workshops().save(workshop)

  const response = await client
    .get('/workshops')
    .query({section: 2})
    .loginVia(user,'jwt')
    .end()

  response.assertStatus(200)

  assert.equal(response.body[0].title, workshop.title)
  assert.equal(response.body[0].user.id, user.id)

})

test('it should be able to show a single workshop', 
async({
  assert, 
  client
})=>{
  const user = await Factory.model('App/Models/User').create()
  const workshop = await Factory.model('App/Models/Workshop').create()

  await user.workshops().save(workshop)

  const response = await client
    .get(`/workshops/${workshop.id}`)
    .loginVia(user,'jwt')
    .end()
  

  const res = response.body[0] || response.body  

  response.assertStatus(200)

  assert.equal(res.title, workshop.title)
  assert.equal(res.user.id, user.id)

})