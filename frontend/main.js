let rootElement;
let allPlaylists = [];

async function initRender() {
    rootElement = document.querySelector('#root');
    rootElement.insertAdjacentHTML('beforeend', displayAllPlaylists());
    rootElement.addEventListener('click', globalClickEventHandler);

    await getPlaylists();
}

async function getPlaylists() {
    let url = `/api/personalplaylist`;
    let response = await fetch(url);
    if (!response.ok) {
        rootElement.insertAdjacentHTML('beforeend', showCreatePlaylist());
        throw new Error("Page doesn't exist yet!", { cause: response });
    }
    else {
        let result = await response.json();
        allPlaylists.push(result);
    }
    console.log('ALL: ', allPlaylists)
    initAllPlaylist(allPlaylists)
}

function showCreatePlaylist() {
    return `
        <div id="createPL">
            <div>
                You don't have any playlists yet.
                Let's create one!
            </div>
            <button id="createPLBtn">Create Playlist</button>
        </div>
    `
}

async function initAllPlaylist(playlists) {
    let url = '/api/personalplaylist';
    let response = await fetch(url);
    let result = await response.json();
    console.log(result);
}

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

function displayAllPlaylists() {
    return `
        <div id='maindisplay'>
            <h1>Select your playlist</h1>
                ${AddPlaylist(allPlaylists.map(x => x))}
        </div>
    `
}

function AddPlaylist(playlist) {
    return `
        <div id="${playlist.name}Div">
         ${playlist.name.toUpperCase()}
        </div>
    `
}

window.addEventListener('load', initRender);