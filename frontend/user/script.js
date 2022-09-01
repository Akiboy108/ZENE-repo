let rootElement;
let artist;
let title;
let file;

async function initRender() {
    rootElement = document.querySelector('#root');
    console.log('asd')
    //rootElement.addEventListener('click', globalClickHandler);
    await getGenres();
    artist = document.querySelector('#artist');
    title = document.querySelector('#title');
    file = document.querySelector('#file');
}

function getInputValues() {
    console.log(artist.value)
    console.log(title.value)
    console.log(file.value)
}

function clickSubmit(e) {
    e.preventDefault();
    if (e.target.id === 'submit') {
        console.log(getInputValues())
    }
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
            <div id="inputField">
                <label for="artist">Artist </label>
                <input class="input" id="artist" type="text" placeholder="Artist">
                <br>
                <label for="title">Title </label>
                <input class="input" id="title" type="text" placeholder="Title">
                <br>
                <label for="file">File </label>
                <input type="file" class="input" id="file" accept="audio/mp3, audio/wav">
                <br>
                <label for="genre">Genre </label>
                <select class="input" id="genre"  placeholder="Select Genre">
                    <option value="default">None</option>
                   ${genres.map(x => showOptions(x))}
                </select>
                <br>
                <button onClick="clickSubmit(event)" class="input" type="submit" id="submit">Submit</button>
            </div>
        </div>
    `
}

function showOptions(genres) {
    return `
        <option id="${genres.id}" value="${genres.genre}">${genres.genre}</option>
    `
}

window.addEventListener('load', initRender);
