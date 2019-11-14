const {
  rule
} = use('Validator')
'use strict'
const Antl = use('Antl');

class Profile {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: 'required',
      password: 'confirmed',
      avatar: 'file|file_ext:png|file_size:2mb|file_types:image',
    }
  }
  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Profile
