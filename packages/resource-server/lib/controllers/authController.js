const jwt = require('jsonwebtoken');
const qs = require('qs');
const axios = require('axios');
const AuthService = require('../services/authService');


class AuthController {
    constructor() {
        if (!AuthController.instance) {
            AuthController.instance = this;
        }
    
        return AuthController.instance;        
    }

    async signup(req, res) {
        const { username, password } = req.body;
        
        AuthService.validateUsernameAndPassword(username, password);

        AuthService.signup(username, password);

        res.status(201).json({ message: 'User created successfully' });
    }

    // OAuth 2.0 인증 서버로 리다이렉트합니다.
    async login(req, res) {
        try {
            const { grant_type, username, password, refresh_token} = req.body;
            if (grant_type === 'password') {
                await AuthService.validateLoginByGrantTypePassword(username, password);

                const accessToken = await AuthService.createAccessToken(username);
            
                res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600, scope: ['read', 'write'] });
            } else if (grant_type === 'refresh_token') {
                await AuthService.validateLoginByGrantTypeRefreshToken(refresh_token);

                const accessToken = await AuthService.createAccessTokenByRefreshToken(refresh_token);

                const data = { 
                    access_token: accessToken, 
                    token_type: 'Bearer', 
                    expires_in: 3600, 
                    scope: 'read, write'
                };
                res.json(data);
            } else {
                return res.status(400).json({ error: 'unsupported_grant_type' });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async auth(req, res) {
        const params = {
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            response_type: 'code',
            scope: 'read write',
          };
      
        const authUrl = `${process.env.AUTH_URL}?${qs.stringify(params)}`;
        res.redirect(authUrl);
    }

    // 콜백 라우팅
    async callback(req, res) {
        const code = req.query.code;
  
        const params = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        };
  
        // 액세스 토큰 요청
        try {
            const { data } = await axios.post(process.env.TOKEN_URL, qs.stringify(params));
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

module.exports = new AuthController();;
