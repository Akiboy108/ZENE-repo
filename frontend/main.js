let rootElement;
let allPlaylists = [];

async function initRender() {
    rootElement = document.querySelector('#root');
    rootElement.addEventListener('click', globalClickEventHandler);
    await getPlaylists();

}

async function getPlaylists() {
    let url = `/api/personalplaylist`;
    let response = await fetch(url);
    if (!response.ok || response === undefined) {
        rootElement.insertAdjacentHTML('beforeend', showCreatePlaylistIfNone());
        throw new Error("No playlists", { cause: response });
    }
    else {
        let result = await response.json()
        allPlaylists.push(result.playlist) //result => playlist.json
        allPlaylists[0].map(x => console.log('X ======> ', x))
        console.log('ALL: ', allPlaylists);
        refreshDisplay();
    }
}

function showCreatePlaylistIfNone() {
    return `
        <div id="createPL">
            <div>
                <h1>You don't have any playlists yet.<h1>
                <h2>Let's create one!<h2>
            </div>
            <button id="createPLBtn">Create Playlist</button>
        </div>
    `
}
function showCreatePlaylist() {
    return `
        <div id="createPL">
            <br>
            <br>
            <button id="createPLBtn">Add New</button>
        </div>
    `
}

/* async function initAllPlaylist(result) {
    let url = '/api/personalplaylist';
    let response = await fetch(url);
    let result = await response.json();
    allPlaylists.push(result)
    console.log('ASD: ', allPlaylists.map(x => { console.log(x); displayAllPlaylists(x) }))
} */

function globalClickEventHandler(event) {
    if (event.target.id === 'nextPage') {
        console.log('click')
        location.assign(`/music/list`);
    }
    if (event.target.id === 'createPLBtn') {
        console.log('click create btn');
        location.assign('/create')
    }
}

function displayAllPlaylists(playlists) {
    console.log('asdasdasdasdadasdads: ', playlists)
    return `
        <div id='maindisplay'>
            <h1>Select your playlist</h1>
                ${playlists.map(x => AddPlaylist(x)).join('')}
        </div>
    `
}

function AddPlaylist(playlist) {
    return `
        <div id="${playlist.name}Div class="clickablePlaylistDiv">
            <h3>${playlist.id}.- ${playlist.name.split("_").join(' ')}</h3>
        </div>
    `
}

function refreshDisplay() {
    rootElement.replaceChildren();
    rootElement.insertAdjacentHTML('beforeend', displayAllPlaylists(allPlaylists[0]));
    rootElement.insertAdjacentHTML('beforeend', showCreatePlaylist());
}

window.addEventListener('load', initRender);