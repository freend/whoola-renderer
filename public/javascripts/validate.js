function validateMail(text) {
    const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
    const result = emailRule.test(text);
    return result;
}

function validatePhone(phone) {
    return /^[1-9][0-9]{6,14}$/.test(phone);
}

function validateText(text, validateText) {
    if (text == validateText) {
        console.log('match');
        return true;
    } else {
        console.log('not match');
        return false;
    }
}