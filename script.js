var sendQuack = document.getElementById('sendQuack'),
    mapDiv = document.getElementById('mapDiv'),
    quaxDiv = document.getElementById('quaxDiv'),
    quaxButton = document.getElementById('quaxButton'),
    mapButton = document.getElementById('mapButton'),
    IDIndex = document.cookie.indexOf('userID'),
    quackCookie = document.cookie.slice(IDIndex + 7, IDIndex + 15),
    enterQuack = document.getElementById('enterQuack'),
    placeholders = ['You\'ve got to ask yourself one question: "Do I feel Quacky?" Well, do ya, punk?',
                    'Quacks? Where we\'re going, we don\'t need Quacks!', 'Get to the Quacker!',
                    'I\'ll be Quack.', 'Use the Quack, Luke.', 'Quacks. Why\'d it have to be Quacks?',
                    'I have had it with these motherQuacking snakes on this motherQuacking plane!',
                    'I wish I knew how to Quack you.', 'I\'ll Quack what she\'s Quacking.', 'Here\'s Quacking at you, kid.',
                    'Don\'t cross the Quacks.', 'If you wanna be my Quacker, you gotta get with my Quack',
                    'Never gonna Quack you up, never gonna Quack you down'],
    quacks,
    socket = io();

sendQuack.addEventListener('click', postQuack);
enterQuack.addEventListener('keydown', function(event){
    if (event.keyCode === 13){
        postQuack();
    }
}, false);
sendQuack.addEventListener('mouseover', quaack);
sendQuack.addEventListener('mouseout', unquaack);
quaxButton.addEventListener('click', function(){
    quaxDiv.className = '';
    mapDiv.className = 'hidden';
});
mapButton.addEventListener('click', function(){
    mapDiv.className = '';
    quaxDiv.className = 'hidden';
});

socket.on('quack', function(data){
    showQuack(data[0]);
});

enterQuack.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];

function postQuack(){
    var quack = enterQuack;
    var request = new XMLHttpRequest();
    var quackText = quack.value.replace(/\./g, '%2E').replace(/#/g, '%23');
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
                socket.emit('quack', result);
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
    ducksOnMap({lat: quack.lat, lon: quack.lon, quack: quack.quack});
    if (quack.hashtag){
        quack.quack = quack.quack.replace(/(#\w+$|#\w+)/, '<span class="hash">' + '$1' + '</span>');
    }
    var geolocationName = quack.address;
    var quackContainer = document.createElement("div");
    quackContainer.className = 'quack';
    quackContainer.id = quack.userID;
    quackContainer.innerHTML = '<p id="' + quack.id + '">' + quack.quack + '</p> <p id="quackTime"><br><span>Posted on: </span>' + quack.time.replace(" GMT+0100 (BST)", "") + '<span><br>Near: </span><em>' + geolocationName + ' </em><span><br>Lat: </span>' + quack.lat + '<span>, Lon: </span>' + quack.lon + '</p>';
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
    request.send(JSON.stringify(this.parentNode.firstChild.id));

    this.parentNode.remove();
}
