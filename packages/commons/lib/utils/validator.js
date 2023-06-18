const { BadRequest } = require("commons/lib/middleware/errors");

function validatorRequestParams(request, requestParams) {
    const missingParams = requestParams.filter(params => !Object.keys(request).includes(params));
    
    if (missingParams.length !== 0) {
        const errorMessages = {};
        missingParams.forEach(param => {
            errorMessages[param] = `missing`;
        });
        throw new BadRequest(errorMessages);
    }
}

function validatorByEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new BadRequest({ email: 'invalid' });
    }
}

function validatorByPassword(password, password_confirmation) {
    if (password !== password_confirmation) {
        throw new BadRequest({ password_confirmation: "passwords_do_not_match" });
    }

    // 대소문자 혼합
    const regexUpperCaseLowerCase = /^(?=.*[a-z])(?=.*[A-Z])/;
    if (!regexUpperCaseLowerCase.test(password)) {
        throw new BadRequest({ password: 'missing_upper_lower' });
    }

    // 숫자 포함
    const regexNumber = /^(?=.*\d)/;
    if (!regexNumber.test(password)) {
        throw new BadRequest({ password: 'missing_digit' });
    }

    // 특수 문자 사용
    const regexSpecialCharacter = /^(?=.*[@!#$%^&*()+=\-[\]{};:'"<>?,./\\|_~`])/;
    if (!regexSpecialCharacter.test(password)) {
        throw new BadRequest({ password: 'missing_special_char' });
    }

    // 길이 제한
    const regexMinimumLength = /^.{8,}$/;
    if (!regexMinimumLength.test(password)) {
        throw new BadRequest({ password: 'min_length_8' });
    }

    // 중복 문자 제한
    const charCount = {};
    for (let char of password) {
        charCount[char] = (charCount[char] || 0) + 1;
        if (charCount[char] >= 3) {
            throw new BadRequest({ password: 'no_repeating_char' });
        }
    }
}

module.exports = {
    validatorRequestParams,
    validatorByEmail,
    validatorByPassword
}
