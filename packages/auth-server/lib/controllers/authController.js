const AuthService = require('../services/authService');


class AuthController {
    constructor() {
        this.authService = AuthService.getInstance();
    }

    getInstance() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }

        return AuthController.instance;
    }

    signup(req, res) {
        const { email, password } = req.body;

        res.json({ message: 'signup' });
    }

    login(req, res) {
        const { grant_type, username, password } = req.body;

        res.json({ message: 'login' });
    }

    /**
     * response_type: 사용자 동의 시 인증 코드를 요청하기 위해 "code"로 설정
     * client_id: 클라이언트 애플리케이션의 고유 식별자
     * redirect_uri: 사용자 동의 후 리디렉션할 클라이언트의 URI
     * scope: 요청된 리소스에 대한 액세스 권한 범위
     */
    authorize(req, res) {
        const { client_id, redirect_uri, response_type, scope } = req.query;

        // 사용자 인증 및 동의 페이지 렌더링
        res.json({ message: 'authorize' });
    }

    /**
     * grant_type: 인가 코드 교환 시 "authorization_code"로 설정
     * code: 인가 코드
     * client_id: 클라이언트 애플리케이션의 고유 식별자
     * client_secret: 클라이언트 애플리케이션의 비밀 키
     * redirect_uri: 사용자 동의 후 리디렉션된 클라이언트의 URI
     */
    token(req, res) {
        const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;
        
        // 액세스 토큰, 토큰 유효 기간 등의 응답 데이터
        res.json({
            access_token: 'access_token',
            token_type: 'Bearer',
            expires_in: 3600,
        })
    }

    userInfo(req, res) {
        // 요청 해더에서 토큰을 가져옴
        const { authorization } = req.headers;

        res.json({
            name: 'name',
            email: 'email',
            picture: 'picture',
        });
    }
}

module.exports = AuthController;
