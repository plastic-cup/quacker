function postQuack(){
    var request = new XMLHttpRequest();

    request.open('POST', '/main?quack=' + document.getElementById('quack').value);
    request.send();
}

document.getElementById('sendQuack').addEventListener('click', postQuack);
