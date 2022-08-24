const root = document.querySelector('#root');
let playlist = [];
let songlist = [];
let songDetails = { id: '', artist: '', title: '', genre: '', duration: 0 }


async function initRender() {
    root.addEventListener('input', globalInputHandler);
    root.addEventListener('click', globalClickHandler);
    root.addEventListener('submit', globalSubmitHandler);

    refreshDisplay();
}

async function globalClickHandler(e) {

}

async function globalInputHandler(e) {

}

async function globalSubmitHandler(event) {
    event.preventDefault();
    let url = '/api/add';
    let tomb = [];
    playlist.map(x => tomb.push({ id: x.id, artist: x.artist, title: x.title, genre: x.genre, duration: x.duration }));

    fetch(url, {
        body: JSON.stringify({
            playlist: tomb
        }),
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    location.assign('/')
}

function createMainContainer(playlist) {
    return `
        <div id="Container">
            ${playlist.map(x => createSong(x).join(''))}
        </div>
    `
}

function createSong(song) {
    return `
        <div class="songBox">
            <div >
                <b>Artist: </b>${song.artist}
            </div>
            <div>
                <b>Title: </b>${song.title}
            </div>
            <div>
                <b>Genre: </b>${song.genre}
            </div>
            <div>
                <b>Duration: </b>${song.duration}
            </div>
        </div>
    `
}

function refreshDisplay() {
    root.replaceChildren();
    root.insertAdjacentHTML('beforeend', createMainContainer(playlist));
}

window.addEventListener('load', initRender);