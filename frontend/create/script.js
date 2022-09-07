const root = document.querySelector('#root');
let playlist = [];
let name = '';
let newID;
let input;
let clickCounter = 0;
let pwType = 'password';
async function initRender() {
    root.addEventListener('input', globalInputHandler);
    root.addEventListener('click', globalClickHandler);
    root.addEventListener('submit', globalSubmitHandler);

    refreshDisplay();
}

async function globalClickHandler(event) {
    newID = playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    input = document.querySelector("#playListInput");


    if (event.target.id === 'createPlaylistButton') {
        PLname = input.value.split(" ").join('_'); //PlayListname
        //playlist.PLname[name] = PLname.split(' ').join('_');
        playlist.id = newID;
        let pw = document.querySelector('#passwordInputValidate').value;
        playlist.password = pw;
        if (pw1.length >= 8 && pw2.length >= 8) {
            if (pw1 === pw2) {
                validPW()
                fetchNewPlaylist(playlist)
            }
            else {
                invalidPW();
                root.insertAdjacentHTML('beforeend', notMatchingPW());
                let remove = document.querySelector('#shortPW')
                root.removeChild(remove)
            }
        }
        else {
            invalidPW();
            root.insertAdjacentHTML('beforeend', tooShortPW())
            let remove = document.querySelector('#wrongPWs')
            root.removeChild(remove)
        }
    }
    if (event.target.id === 'checkbox') {
        clickCounter++;
        let pwinput = document.querySelector('#passwordInput');
        let pwinputVal = document.querySelector('#passwordInputValidate');
        if (clickCounter % 2 != 0) {
            event.target.classList.add('active');
            event.target.classList.add('active');
        }
        else {
            event.target.classList.remove('active');
            event.target.classList.remove('active');
        }
        decidePwType(pwinput, pwinputVal)
    }
}

function decidePwType(pwinput, pwinputVal) {
    let switchBtn = document.querySelector("#checkbox");
    if (switchBtn.classList.contains('active')) {
        pwinput.type = 'text';
        pwinputVal.type = 'text';
    }
    else {
        pwinput.type = 'password';
        pwinputVal.type = 'password';
    }
}

function fetchNewPlaylist(playlist) {
    let url = `/api/add/${input.value.split(" ").join('_').toLowerCase()}`;
    fetch(url, {
        body: JSON.stringify({
            "playlist": playlist,
            "pw": playlist.password
        }),
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    //createJSON(playlist)
    location.assign('/')
    //location.assign(`/user/${input.value.split(" ").join('-')}`);
}

function globalSubmitHandler(event) {

}
let pw1 = '';
let pw2 = '';
function globalInputHandler(event) {

    if (event.target.id === 'passwordInput') {
        pw1 = event.target.value;
    }
    if (event.target.id === 'passwordInputValidate') {
        pw2 = event.target.value;
        console.log(pw2.length)
    }

}

function validPW() {
    let input = document.getElementById('passwordInput');
    let input2 = document.getElementById('passwordInputValidate');
    //input.style.backgroundColor = `rgba(34, 199, 34, 0.406)`;
    input.style.border = '2px solid green'
    //input2.style.backgroundColor = `rgba(34, 199, 34, 0.406)`;
    input2.style.border = '2px solid green'
}

function invalidPW() {
    let input = document.getElementById('passwordInput');
    let input2 = document.getElementById('passwordInputValidate');
    //input.style.backgroundColor = `rgba(199, 34, 34, 0.506)`;
    input.style.border = '2px solid red'
    //input2.style.backgroundColor = `rgba(199, 34, 34, 0.506)`;
    input2.style.border = '2px solid red'
}

function notMatchingPW() {
    return `<span class="passwordMessage" id="wrongPWs">Passwords are not matching!</span>`
}

function tooShortPW() {
    return `<span class="passwordMessage" id="shortPW">Password is too Short. It should be at least 8 characters!</span>`;
}

function createMainContainer() {
    return `
        <div id="Container">
            ${createPlayList()}
        </div>
    `
}
//<i class="fa-light fa-eye-slash"></i>
function createPlayList() {
    return `
        <div class="createPlaylist">
        <h1>Create your playlist:</h1>
            <div id="createPlaylistDiv">
                <input class="input" type="text", id="playListInput" placeholder="Name of the playlist">
            </div>
            <div id="showPWContainer">
                <div id="pwContainer">
                    <label for="passwordInput">Please create a password</label>
                    <input id="passwordInput" class="input" type="${pwType}" placeholder="8-15 character A-Z, 0-9">
                    <label for="passwordInputValidate">Your password again:</label>
                    <input id="passwordInputValidate" class="input" type="${pwType}" placeholder="8-15 character A-Z, 0-9">
                </div>
                <div class="innerDiv">
                <label for="checkbox">Show pasword:</label>
                    <label class="switch">
                        <input id="checkbox" type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div id="createPlaylistButtonDiv">
                <button type="click" id="createPlaylistButton" data-id=${newID}>Create playlist</button>
            </div>
        </div>
    `
}

function refreshDisplay() {
    root.replaceChildren();
    root.insertAdjacentHTML('beforeend', createMainContainer(newID));
}

window.addEventListener('load', initRender);