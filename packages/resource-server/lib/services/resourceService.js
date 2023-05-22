const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResourceRepository = require('../repositories/resourceRepository');

class ResourceService {
  constructor() {
    this.resourceRepository = ResourceRepository.getInstance();
  }

  async getInstance() {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }

    return ResourceService.instance;
  }

  validateUsernameAndPassword(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
  }

  async signup(username, password) {
    const user = await userRepository.findUserByUsername(username);
    if (user) {
      throw new Error('409, User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await userRepository.createUser(username, hashedPassword);

    return { userId };
  }

  async validateLoginByGrantTypePassword(username, password) {
    const user = await userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error(`401 error: 'invalid_grant'`)
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error(`401 error: 'invalid_grant'`)
    }
  }

  async validateLoginByGrantTypeRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      const user = await userRepository.findUserById(decoded.userId);
      if (!user) {
        throw new Error(`401 error: 'invalid_grant'`)
      }
    } catch (error) {
      throw new Error(`401 error: 'invalid_grant'`)
    }
  }

  async createAccessTokenByRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
      const user = await userRepository.findUserById(decoded.userId);
      if (!user) {
        throw new Error(`401 error: 'invalid_grant'`)
      }

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });
      return token;
    } catch (error) {
      console.log(error);
      throw new Error(`401 error: 'invalid_grant'`)
    }
  }

  async createAccessToken(username) {
    const user = await userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error(`401 error: 'invalid_grant'`)
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return accessToken;
  }

  async login(username, password) {
    // Check if user exists
    const user = await userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }

    // Create and sign token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return { token };
  }

  async verifyToken(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decodedToken.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new ResourceService();