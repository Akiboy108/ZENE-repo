let rootElement;
let allPlaylists = [];

async function initRender() {
    rootElement = document.querySelector('#root');
    /* rootElement.addEventListener('submit', globalSubmitHandler); */
    rootElement.addEventListener('click', globalClickHandler);
    await getPlaylists();

}
/*      allPlaylists = [
            [
                {1}
                {2}
                {3}
                {...}
            ]
        ]

        result = {
            "playlist": [
                {1}
                {2}
                {3}
                {...}
            ]
        }
*/
async function getPlaylists() {
    let url = `/api/personalplaylist`;
    let response = await fetch(url);
    if (!response.ok || response === undefined) {
        rootElement.insertAdjacentHTML('beforeend', showCreatePlaylistIfNone());
        throw new Error("No playlists", { cause: response });
    }
    else {
        let result = await response.json() //result => playlist.json                                
        allPlaylists.push(result.playlist)
        allPlaylists[0].map(x => console.warn('playlist.json.map(): ', x))
        allPlaylists.map(x => console.warn('all array.map: ', x))
        console.warn('allPlaylist: ', allPlaylists);
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
            <button type="button" id="createPLBtn">Create Playlist</button>
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

function globalClickHandler(event) {
    event.preventDefault();
    let datasetID = +event.target.dataset.id;
    if (event.target.id === 'createPLBtn') {
        console.log('click');
        location.assign('/create')
    }

    let clicked = searchClickedList(event);
    let clickedObj = clicked[0];

    if (event.target.id === `delCol`) {
        console.log(event.type)
        removePlaylist(datasetID)
    }
    if (event.target.id === clickedObj.name) {
        console.log('NAME::: ', clickedObj.name)
    }
}

function searchClickedList(e) {
    let res = allPlaylists[0].filter(x => x.name === e.target.id);
    return res;
}

async function fetchForNewSong(id) {
    let url = `/api/addSong/${id}`
    let response = fetch(url);
}

function displayAllPlaylists(playlists) {
    playlists.map(x => console.log(x.id + "'s name:", x.name));
    return `
        <div id='maindisplay'>
            <h1>Select your playlist</h1>
            <table id="PLTable">
                <thead>
                    <tr>
                        <th>Name</th>
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
        <tr  id="${playlist.name}Row"  id="nameCol">
            <td id="${playlist.name}" class="clickablePlaylistDiv" data-id=${playlist.id}>
                ${capitalizeFirstLetter(playlist.name.split("_").join(' '))}
            </td>
            <td class="delButton">
                <button type="button" id="delCol" class="fa fa-trash" data-id=${playlist.id}></button>
            </td>
        </tr>
    
    `
}

async function removePlaylist(id) {
    let url = `/api/delete/${id}`;
    //let removable = allPlaylists[0].playlist.find(x => x.name === datasetID);
    let response = await fetch(url, { body: ``, method: 'delete' });
    let result = await response.json();
    allPlaylists = [];
    allPlaylists.push(result);
    refreshDisplay();
}

function refreshDisplay() {
    rootElement.replaceChildren();
    if (allPlaylists[0].length === 0) {
        location.assign('/')
    }
    else {
        console.log('sima = ', allPlaylists.length, '[0] = ', allPlaylists[0].length)
        rootElement.insertAdjacentHTML('beforeend', displayAllPlaylists(allPlaylists[0]));
        rootElement.insertAdjacentHTML('beforeend', showCreatePlaylist());
    }
}

window.addEventListener('load', initRender);