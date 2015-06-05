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

window.onload = function(){
    (function getQuacks(){
        var request = new XMLHttpRequest();
        request.open('GET', '/main');
        request.send();
        console.log('sent');
        request.onreadystatechange = function(){
            if (request.readyState === 4){
                console.log('####' + 4);
                if (request.status === 200){
                    console.log('####' + 200);
                    console.log(request.responseText);
                }
            }
        };
    })();
};
