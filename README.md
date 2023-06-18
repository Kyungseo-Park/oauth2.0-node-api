# OAuth 2.0 API 

Lerna를 사용하여 OAuth 2.0 서비스를 개발하는 모노레포 프로젝트입니다. 

이 프로젝트는 인증 서버(AuthServer)와 리소스 서버(ResourceServer)가 포함되어 있습니다. 
## OAuth 2.0 의 기본 개념


## 프로젝트 구조

- `packages/auth-server`: 인증 서버를 구현하는 패키지입니다.
- `packages/resource-server`: 리소스 서버를 구현하는 패키지입니다.

## 시작하기

```shell
git clone git@github.com:Kyungseo-Park/oauth2.0-node-api.git
cd oauth2.0-node-api
```

Lerna 개발환경 실행
```
npm install -g lerna
lerna bootstrap
lerna run dev
```

## Lerna 
 - 

## 배포하기

이 프로젝트는 Lerna를 사용하여 각 서버를 독립적으로 배포할 수 있습니다. 다음 명령어를 사용하여 각 서버를 배포할 수 있습니다.

```shell
lerna run build --scope @my-oauth-service/auth-server --stream
lerna run build --scope @my-oauth-service/resource-server --stream
```

