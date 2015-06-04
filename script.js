document.getElementById('sendQuack').addEventListener('click', postQuack);

function postQuack(){
    var quack = document.getElementById('quack');
    var request = new XMLHttpRequest();
    var quackText = quack.value.replace(/\./g, '%2E');
    var quackCookie = giveCookie();
    request.open('POST', '/main?quack=' + quackText + '&userID=' + quackCookie);
    request.send();
    quack.value = '';
}

function giveCookie(){
    var IDIndex = document.cookie.indexOf('userID'),
        quackCookie;
    if (IDIndex === -1){
        quackCookie = 'userID=' + Math.floor(Math.random() * 100000000);
        document.cookie = quackCookie;
    } else {
        quackCookie = document.cookie.slice(IDIndex + 7, IDIndex + 15);
    }
    return quackCookie;
}
