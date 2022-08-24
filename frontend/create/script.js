const root = document.querySelector('#root');
let playlist = [];
let name = '';
let newID = playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;


async function initRender() {
    root.addEventListener('input', globalInputHandler);
    root.addEventListener('click', globalClickHandler);
    root.addEventListener('submit', globalSubmitHandler);

    refreshDisplay();
}

async function globalClickHandler(event) {
    let input = document.querySelector("#playListInput");
    let url = '/api/add';
    if (event.target.id === 'createPlaylistButton') {
        PLname = input.value; //PlayListname
        playlist[PLname] = {};
        playlist.id = newID;
        console.log(playlist);

        fetch(url, {
            body: JSON.stringify({
                playlist: playlist
            }),
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        location.assign('/')
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