const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const qs = require('qs');
const axios = require('axios');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET_KEY = 'mysecretkey';

// OAuth 2.0 클라이언트 ID와 시크릿
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'http://localhost:3000/callback';

// OAuth 2.0 인증 서버 URL
const AUTH_SERVER = 'https://oauth.example.com';
const AUTH_URL = `${AUTH_SERVER}/authorize`;
const TOKEN_URL = `${AUTH_SERVER}/token`;

class AuthController {
    constructor() {
        if (!AuthController.instance) {
            AuthController.instance = this;
        }
        return AuthController.instance;
    }

    async signup(req, res) {
        const { username, password } = req.body;

        // 사용자 이름과 비밀번호 유효성 검사
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Check if user already exists
        const user = await userRepository.findUserByUsername(username);
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await userRepository.createUser(username, hashedPassword);

        res.status(201).json({ message: 'User created successfully' });
    }

    async login(req, res) {
        const { grant_type, username, password, scope, refresh_token, client_id, client_secret } = req.body;
        
        // Check client id and secret
        if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
            return res.status(401).json({ error: 'invalid_client' });
        }
        
        // Check grant type
        if (grant_type === 'password') {
            // Password grant type
            // Check if user exists
            const user = await userRepository.findUserByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'invalid_grant' });
            }
        
            // Check password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'invalid_grant' });
            }
        
            // Create and sign token
            const token = jwt.sign({ sub: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        
            res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600, scope: ['read', 'write'] });
        } else if (grant_type === 'refresh_token') {
            // Refresh token grant type
            // Verify refresh token
            jwt.verify(refresh_token, JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'invalid_grant' });
                }
        
                // Check if user exists
                const user = await userRepository.findUserById(decoded.sub);
                if (!user) {
                    return res.status(401).json({ error: 'invalid_grant' });
                }
        
                // Create and sign token
                const token = jwt.sign({ sub: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        
                res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600, scope: ['read', 'write'] });
            });
        } else {
            // Unsupported grant type
            return res.status(400).json({ error: 'unsupported_grant_type' });
        }
    }

    async auth(req, res) {
        // 클라이언트를 인증 페이지로 리다이렉트합니다.

        const params = {
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'read write',
          };
      
        const authUrl = `${AUTH_URL}?${qs.stringify(params)}`;
        res.redirect(authUrl);
    }

    // 콜백 라우팅
    async callback(req, res) {
        const code = req.query.code;
  
        const params = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        };
  
        // 액세스 토큰 요청
        try {
            const { data } = await axios.post(TOKEN_URL, qs.stringify(params));
            const accessToken = data.access_token;
    
            const decodedToken = jwt.verify(accessToken, JWT_SECRET_KEY);
      
            res.json({ access_token: accessToken, user_id: decodedToken.userId });
            // // 클라이언트가 API 를 호출한다면 아래처럼 됨
            // const { data: result } = await axios.get(API_URL, {
            //     headers: {
            //     Authorization: `Bearer ${accessToken}`,
            //     },
            // });
            // res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Something went wrong!');
        }
    };
}

// 싱글톤 인스턴스
const authController = new AuthController();

module.exports = authController;
