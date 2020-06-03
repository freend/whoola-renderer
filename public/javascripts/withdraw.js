function stateLamp(lamp) {
    console.log('call', lamp);
}
function init(page) {
    console.log('call init');
    for (var i = 0; i < page.content.length; i++) {
        page.content[i].withdrawState
    }
}