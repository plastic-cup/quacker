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
    var lat;
    var lon;
    if (quackCookie.length !== 8){
        giveCookie();
    }
    navigator.geolocation.getCurrentPosition(function(response){
        lat = response.coords.latitude;
        lon = response.coords.longitude;
        request.open('POST', '/main?quack=' + quackText + '&userID=' + quackCookie + '&lat=' + lat + '&lon=' + lon);
        request.send();
    });
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200){
                var result = JSON.parse(request.responseText);
                showQuack(result[0]);
            }
        }
    };
    quack.value = '';
}


function giveCookie(){
    if (IDIndex === -1){
        var qCookie = 'userID=' + Math.floor((Math.random() * (1 - 0.1) + 0.1) * 100000000);
        document.cookie = qCookie;
        IDIndex = document.cookie.indexOf('userID');
    }
    quackCookie = document.cookie.slice(IDIndex + 7, IDIndex + 15);
}

function getQuackFromArray(quacksArray){
    quacksArray.forEach(function(quackObj){
        showQuack(quackObj);
    });
}

function showQuack(quack){
    console.log(quack);
    var quackContainer = document.createElement("div");
    quackContainer.className = 'quack';
    quackContainer.id = quack.userID;
    quackContainer.innerHTML = '<p id="' + quack.id + '">' + quack.quack + '</p> <p id="quackTime">Posted on: ' + quack.time + " <br>At lat: " + quack.lat + ", lon: " + quack.lon + '</p>';
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
                getQuackFromArray(JSON.parse(request.responseText)); // data from redis goes here
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
    if (IDIndex === -1 || quackCookie !== this.parentNode.id){
        alert('You can\'t delete a quack you didn\'t quack');
        return;
    }
    var request = new XMLHttpRequest();
    request.open('DELETE', '/main');
    console.log(JSON.stringify(this.parentNode.firstChild.id));
    request.send(JSON.stringify(this.parentNode.firstChild.id));

    this.parentNode.remove();
}
