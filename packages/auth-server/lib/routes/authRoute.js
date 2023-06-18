const AuthService = require('../services/authService');
const {validatorRequestParams, validatorByEmail, validatorByPassword} = require("commons/lib/utils/validator");
const express = require('express');

const router = express.Router();

const authService = AuthService.getInstance();

const signup = async (req, res, next) => {
    try {
        const requireParams = ['email', 'password', 'password_confirmation', 'last_name', 'first_name'];
        
        validatorRequestParams(req.body, requireParams);

        const { email, password, password_confirmation } = req.body;

        validatorByEmail(email);

        validatorByPassword(password, password_confirmation);

        // 회원가입 로직
        const userInfo = await authService.signup(req.body);

        await authService.sendMailToQueue(userInfo.id, userInfo.email);

        res.json({ data: 'success' });
    } catch (error) {
        next(error);
    }
}


const login = async (req, res, next) => {
    try {
        const { grant_type, username, password } = req.body;

        res.status(201).json({ message: 'success' });
    } catch (error) {
        next(error);
    }
}

/**
 * response_type: 사용자 동의 시 인증 코드를 요청하기 위해 "code"로 설정
 * client_id: 클라이언트 애플리케이션의 고유 식별자
 * redirect_uri: 사용자 동의 후 리디렉션할 클라이언트의 URI
 * scope: 요청된 리소스에 대한 액세스 권한 범위
 */
const authorize = async (req, res, next) => {
    try {
        const { client_id, redirect_uri, response_type, scope } = req.query;

        // 사용자 인증 및 동의 페이지 렌더링
        res.json({ message: 'authorize' });
    } catch (error) {
        next(error);
    }
}

/**
 * grant_type: 인가 코드 교환 시 "authorization_code"로 설정
 * code: 인가 코드
 * client_id: 클라이언트 애플리케이션의 고유 식별자
 * client_secret: 클라이언트 애플리케이션의 비밀 키
 * redirect_uri: 사용자 동의 후 리디렉션된 클라이언트의 URI
 */
const token = async (req, res, next) => {
    try {
        const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;
        
        // 액세스 토큰, 토큰 유효 기간 등의 응답 데이터
        res.json({
            access_token: 'access_token',
            token_type: 'Bearer',
            expires_in: 3600,
        })
    } catch (error) {
        next(error);
    }
}

const userInfo = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        res.json({
            name: 'name',
            email: 'email',
            picture: 'picture',
        });
    } catch (error) {
        next(error);
    }
}

router.post('/signup', signup);
router.post('/login', login);
router.get('/authorize', authorize);
router.post('/token', token);
router.get('/test', userInfo);

module.exports = router;
