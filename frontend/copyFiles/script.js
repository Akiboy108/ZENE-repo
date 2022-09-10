let rootElement;
let artist;
let title;

async function initRender() {
    rootElement = document.querySelector('#root');
    rootElement.addEventListener('click', globalSubmitHandler);
    await getGenres();
    artist = document.querySelector('#artist');
    title = document.querySelector('#title');
}

//

async function globalSubmitHandler(event) {
    event.preventDefault();
    let url = `/api/uploadFile/${'akos'}`;
    fetch(url, {
        method: 'post',
    })
}

/* function getInputValues() {
    console.log(artist.value)
    console.log(title.value)
    console.log(file.value)
}

function clickSubmit(e) {
    e.preventDefault();
    if (e.target.id === 'submit') {
        getInputValues()
    }
} */

async function getGenres() {
    let url = `/api/genre`;
    let response = await fetch(url);
    let result = await response.json();
    rootElement.insertAdjacentHTML('beforeend', showAddSongIfNone(result));
}

function showAddSongIfNone(genres) {
    return `
        <div id="addSongBox">
            <h1>Your playlist is currently empty!</h1>
            <h3>Add some songs to it.</h3>
            <div id="myForm"> 
                <form action="/api/uploadFile" enctype="multipart/form-data" method="post" id="form">
                    <label for="artist">Artist </label>
                    <input class="input" id="artist" type="text" placeholder="Artist">
                    <br>
                    <label for="title">Title </label>
                    <input class="input" id="title" type="text" placeholder="Title">
                    <br>
                    <label for="file">File </label>
                    <input name="myFile" type="file" class="admin_input" id="myFile" accept="audio/mp3, audio/wav">
                    <br>
                    <label for="genre">Genre </label>
                    <select class="input" id="genre"  placeholder="Select Genre">
                        <option value="default">None</option>
                       ${genres.map(x => showOptions(x))}
                    </select>
                    <br>
                    <input class="admin_submit" type="submit"/>
                </form>
            </div>
        </div>
    `
}

function showOptions(genres) {
    return `
        <option id="${genres.id}" value="${genres.genre}">${genres.genre}</option>
    `
}

//TODO check formidable

window.addEventListener('load', initRender);