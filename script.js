var sendQuack = document.getElementById('sendQuack'),
    IDIndex = document.cookie.indexOf('userID'),
    quackCookie = document.cookie.slice(IDIndex + 7, IDIndex + 15),
    quacks;

sendQuack.addEventListener('click', postQuack);
sendQuack.addEventListener('mouseover', quaack);
sendQuack.addEventListener('mouseout', unquaack);

function postQuack(){
    var quack = document.getElementById('enterQuack');
    var request = new XMLHttpRequest();
    var quackText = quack.value.replace(/\./g, '%2E');
    if (!quackCookie){
        giveCookie();
    }
    request.open('POST', '/main?quack=' + quackText + '&userID=' + quackCookie);
    request.send();
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200){
                var result = JSON.parse(request.responseText);
                var obj = {};
                obj[result.id] = result;
                showQuack(result.id, obj);
            }
        }
    };
    quack.value = '';
}

function giveCookie(){
    if (IDIndex === -1){
        quackCookie = 'userID=' + Math.floor((Math.random() * (1 - 0.1) + 0.1) * 100000000);
        document.cookie = quackCookie;
    } else {
        quackCookie = document.cookie.slice(IDIndex + 7, IDIndex + 15);
    }
    return quackCookie;
}

function showQuacks(quacks){
    for (var key in quacks){
        showQuack(key, quacks);
    }
}

function showQuack(key, quacks){
    var quackContainer = document.createElement("div");
    quackContainer.className = 'quack';
    quackContainer.id = quacks[key].userID;
    quackContainer.innerHTML = '<p id="' + quacks[key].id + '">' + quacks[key].quack + '</p> <p id="quackTime">Posted on: ' + quacks[key].time + '</p>';
    quackContainer.addEventListener('mouseenter', showDelete);
    quackContainer.addEventListener('mouseleave', hideDelete);
    var quax = document.getElementById('quax');
    quax.insertBefore(quackContainer, quax.firstChild);
}

function getQuacks(){
    var request = new XMLHttpRequest();
    request.open('GET', '/main');
    request.send();
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200){
                showQuacks(JSON.parse(request.responseText));
            }
        }
    };
}

window.onload = getQuacks();

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

    var interval = setInterval(function(){
        if (a.length === 1){
            clearInterval(interval);
        }
        else{
            a = a.slice(0, -1);
            document.getElementById('sendQuack').innerHTML = "Qu" + a + "ck";
        }
    }, 100);
}

function showDelete(){
    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', deleteQuack);
    this.appendChild(deleteButton);
}

function hideDelete(){
    var button = this.lastChild;
    this.removeChild(this.lastChild);
}

function deleteQuack(){
    var IDIndex = document.cookie.indexOf('userID');
    if (IDIndex === -1 || quackCookie !== this.parentNode.id){
        alert('You can\'t delete a quack you didn\'t quack');
        return;
    }
    var request = new XMLHttpRequest();
    request.open('DELETE', '/main');
    request.send(JSON.stringify({id : this.parentNode.firstChild.id}));
    this.parentNode.remove();
}
