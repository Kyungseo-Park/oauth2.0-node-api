class AuthRepository {
  constructor() {

  }

  getInstance() {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }

    return AuthRepository.instance;
  }
}

module.exports = new AuthRepository();
