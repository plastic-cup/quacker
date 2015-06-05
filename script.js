document.getElementById('sendQuack').addEventListener('click', postQuack);
document.getElementById('sendQuack').addEventListener('mouseover', quaack);
document.getElementById('sendQuack').addEventListener('mouseout', unquaack);

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

function quaack(){

    var a = "a";
    var interval = setInterval(function(){
        if (a.length >= 5){
            clearInterval(interval);
        }
        else{
            a += "a";

            document.getElementById('sendQuack').innerText = "Qua" + a + "ck";
        }
    }, 100);

}

function unquaack(){
    var word = document.getElementById('sendQuack').innerText,
        a = word.slice(2, -2);

    console.log(word);

    var interval = setInterval(function(){
        if (a.length === 1){
            clearInterval(interval);
        }
        else{
            a = a.slice(0, -1);
            console.log(a);
            document.getElementById('sendQuack').innerHTML = "Qu" + a + "ck";
        }
    }, 100);
}
