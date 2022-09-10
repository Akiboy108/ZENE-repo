let rootElement;
let artist;
let title;
let file;
let genre;
let extension;
let lastName = '';
async function initRender() {
    rootElement = document.querySelector('#root');
    rootElement.addEventListener('submit', globalSubmitHandler);
    await getGenres();
    lastName = await getLastName();
    artist = document.querySelector('#artist');
    title = document.querySelector('#title');
    file = document.querySelector('#file');
    genre = document.querySelector('#genre');
}

//

async function globalSubmitHandler(event) {
    event.preventDefault();
    console.log(`Submit files to '${lastName}' folder...`);
    let url = `/uploadSong/${lastName}`;
    let fileName = file.files[0].name;
    let splitByDot = fileName.split('.');
    let extension = splitByDot[splitByDot.length - 1];
    fetch(url, {
        body: JSON.stringify({
            "folder": lastName,
            "title": title.value,
            "artist": artist.value,
            "file": file.files[0].name,
            "genre": genre.value,
            "extension": extension,
        }),
        method: 'post',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
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

async function getLastName() {
    let url = `/api/uploadFile/`;
    let response = await fetch(url);
    let result = await response.json();
    console.log(`* * * You have clicked on ${result.name} list!`);
    return result.name;
}

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
                    <input name="myFile" type="file" class="input" id="file" accept="audio/mp3, audio/wav">
                    <br>
                    <label for="genre">Genre </label>
                    <select class="input" id="genre"  placeholder="Select Genre">
                        <option value="default">None</option>
                       ${genres.map(x => showOptions(x))}
                    </select>
                    <br>
                    <input class="input" type="submit"/>
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