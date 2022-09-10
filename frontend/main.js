let allPlaylists = [];
let rootElement;
let delSetID;
let lastClickedName = '';

async function initRender() {
    rootElement = document.querySelector('#root');
    /* rootElement.addEventListener('submit', globalSubmitHandler); */
    document.body.addEventListener('click', globalClickHandler);
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
        console.log('%c No playlist to fetch', 'color: red; background: white')
    }
    else {
        let result = await response.json() //result => playlist.json                                
        allPlaylists.push(result.playlist)
        //allPlaylists[0].map(x => console.warn('playlist.json.map(): ', x))
        //allPlaylists.map(x => console.warn('all array.map: ', x))
        //console.warn('allPlaylist: ', allPlaylists);
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

async function globalClickHandler(event) {
    event.preventDefault();
    let datasetID = +event.target.dataset.id;
    let userinputpw;

    if (event.target.id === 'createPLBtn') {
        //console.log('click');
        location.assign('/create')
    }

    let clicked = searchClickedList(event);
    let clickedObj = clicked[0];

    if (event.target.id === `delCol`) {
        rootElement.style.filter = 'blur(5px)';
        delSetID = +event.target.dataset.id;
        validatePassword();
    }
    if (event.target.id === 'okBtn') {
        //console.log(delSetID)
        if (givenPW() === await realPW(delSetID)) {
            let validateBox = document.querySelector('#delBox');
            removePlaylist(delSetID)
            rootElement.style.filter = 'blur(0px)';
            document.body.removeChild(validateBox)
        }
        else {
            //console.log("WRONG PASSWORD");
            let pwinput = document.getElementById('PWtoBeChecked')
            //pwinput.style.backgroundColor = `rgba(199, 34, 34, 0.506)`;
            pwinput.style.border = '2px solid red'

        }
    }
    if (event.target.id === 'cancelBtn') {
        let validateBox = document.querySelector('#delBox');
        rootElement.style.filter = 'blur(0px)';
        document.body.removeChild(validateBox)
    }
    if (event.target.id === clickedObj.name) {
        await sendClickedListData(clickedObj)
        //await createUserFolder(clickedObj.id)
        location.assign(`/user/${clickedObj.name}`);
    }
}

async function validatePassword(dataID, id) {
    document.body.insertAdjacentHTML('beforeend', showValidationBox());
}

function showValidationBox() {
    return `
            <div id="delBox">
                <div id="PWtoBeCheckedContainer">
                    <h1>PASSWORD:</h1>
                    <input id="PWtoBeChecked" type="password" placeholder="Enter password to delete">
                    <button id="okBtn">OK</button>
                    <button id="cancelBtn">Cancel</button>
                </div>
            </div>
        `
}

async function realPW(id) {
    let url = `/api/getPassword/${id}`
    let response = await fetch(url);
    let result = await response.json();
    return result.password;
}
function givenPW() {
    let givenpw = document.getElementById('PWtoBeChecked').value;
    return givenpw
}

async function sendClickedListData(co) {//co = clicked object
    let url = `/api/sendData/:${co.name}`
    fetch(url, {
        body: JSON.stringify({ "id": co.id, "name": co.name }),
        method: 'post',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
    console.log(co.name);
    lastClickedName = co.name
}

/* async function showChoosenPlaylist(co) {
    let url = `/api/getSongs/${co.name}`
    let response = await fetch(url);

    if (!response.ok || response === undefined) {
        rootElement.replaceChildren();
        getGenres();
        throw new Error("No songs", { cause: response });
    }
    else {
        let result = await response.json() //result => playlist.json                                
        refreshDisplay();
    }
} */

function searchClickedList(e) {
    let res = allPlaylists[0].filter(x => x.name === e.target.id);
    return res;
}

function displayAllPlaylists(playlists) {
    //playlists.map(x => console.log(x.id + "'s name:", x.name));
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
        //console.log('sima = ', allPlaylists.length, '[0] = ', allPlaylists[0].length)
        rootElement.insertAdjacentHTML('beforeend', displayAllPlaylists(allPlaylists[0]));
        rootElement.insertAdjacentHTML('beforeend', showCreatePlaylist());
    }
}



window.addEventListener('load', initRender);
