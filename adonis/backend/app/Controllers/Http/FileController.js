'use strict'
const Helpers = use('Helpers')

class FileController {
  async show({ response, params }){
    return response.download(Helpers.tmpPath(`uploads/${params.file}`))
  }
}

module.exports = FileController
