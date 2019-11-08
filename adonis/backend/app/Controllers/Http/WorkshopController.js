'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Workshop = use('App/Models/Workshop')

class WorkshopController {
  async index(){
    const workshops = await Workshop
      .query()
      .with('user', builder => {
        builder.select(['id', 'username']);
      })
      .fetch();

    return workshops;
  }
  async show ({ params }) {

    const workshop = await Workshop.find(params.id)
    await workshop.load('user', builder => {
      builder.select(['id', 'username']);
    })

    return workshop
  }

  async store ({ request, response }) {

    const data = request.only(['title', 'description', 'user_id', 'section']);

    const workshop = await Workshop.create(data)

    return response.status(201).json(workshop)
  }
}

module.exports = WorkshopController
