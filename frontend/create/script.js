const root = document.querySelector('#root');
let playlist = [];
let name = '';
let newID;
let userObj = {};


async function initRender() {
    root.addEventListener('input', globalInputHandler);
    root.addEventListener('click', globalClickHandler);
    root.addEventListener('submit', globalSubmitHandler);

    refreshDisplay();
}

async function globalClickHandler(event) {
    newID = playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    let input = document.querySelector("#playListInput");

    let url = `/api/add/${input.value.split(" ").join('_').toLowerCase()}`;
    if (event.target.id === 'createPlaylistButton') {
        PLname = input.value.split(" ").join('_'); //PlayListname
        //playlist.PLname[name] = PLname.split(' ').join('_');
        playlist.id = newID;

        fetch(url, {
            body: JSON.stringify({
                "playlist": playlist
            }),
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        //createJSON(playlist)
        location.assign('/')
        //location.assign(`/user/${input.value.split(" ").join('-')}`);
    }
}

function globalInputHandler(event) {

}

function globalSubmitHandler(event) {

}

function createMainContainer() {
    return `
        <div id="Container">
            ${createPlayList()}
        </div>
    `
}

function createPlayList() {
    return `
        <div class="createPlaylist">
        <h1>Create your playlist:</h1>
            <div id="createPlaylistDiv">
                <input type="text", id="playListInput" placeholder="Name of the playlist">
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