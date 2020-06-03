function initNonMember(flag) {
    if(flag) {
        $('#signup').show();
        $('#login').show();
        $('.btn_request').hide();
    } else {
        $('#signup').hide();
        $('#login').hide();
        $('#paypalBtn').show();
        $('.btn_request').show();
    }
}

function buySignUp() {
    location.href = '/signup';
}
function buyLogIn() {
    location.href = '/login';
}