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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    let datasetID = +event.target.dataset.id;
    if (event.target.id === 'nextPage') {
        console.log('click')
        location.assign(`/music/list`);
    }
    if (event.target.id === 'createPLBtn') {
        console.log('click create btn');
        location.assign('/create')
    }
    if (event.target.id === `editCol`) {
        console.log('editCol')
    }
    if (event.target.id === `delCol`) {
        console.log('delCol')
    }

}

function displayAllPlaylists(playlists) {
    return `
        <div id='maindisplay'>
            <h1>Select your playlist</h1>
            <table id="PLTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                    <tbody id="playlistTableBody">
                        ${playlists.map(x => AddPlaylist(x)).join('')}
                    </tbody>
            </table>
                
        </div>
    `
}

function AddPlaylist(playlist) {
    return `
    
        <tr  id="${playlist.name}Row" data-id=${playlist.name}>
            <td id="nameCol" class="clickablePlaylistDiv">
                <div>
                    ${capitalizeFirstLetter(playlist.name.split("_").join(' '))}
                </div>
            </td>
            <td class="editCol">
                <button id="editCol" class="fa fa-edit"></button>
            </td>
            <td class="delCol"> 
                <button id="delCol" class="fa fa-trash"></button>
            </td>
        </tr>
    
    `
}

function removePlaylist() {

}

function refreshDisplay() {
    rootElement.replaceChildren();
    rootElement.insertAdjacentHTML('beforeend', displayAllPlaylists(allPlaylists[0]));
    rootElement.insertAdjacentHTML('beforeend', showCreatePlaylist());
}

window.addEventListener('load', initRender);