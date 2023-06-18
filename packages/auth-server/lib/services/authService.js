const AuthRepository = require('../repositories/authRepository');


class AuthService {
    constructor() {
      this.authRepository = AuthRepository.getInstance();
    }

    getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }
}

module.exports = new AuthService();
