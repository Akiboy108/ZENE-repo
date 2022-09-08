import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/USERS'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/genre', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/genres.json', 'utf8'));
    let genres = data.genres;

    res.send(genres);
});

app.get('/api/music', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    res.send(data);
});
app.get('/api/getSongs/:name', (req, res) => {//CHECKS IF CLICKED PL IS EMPTY
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    let clicked = data.playlist.filter(x => x.name === (req.params.name));
    console.log(clicked)
    if (clicked[0][req.params.name].length === 0) {
        res.send(Error)
    } else {
        res.send(clicked[0])
    }
});

app.get('/api/mkdir/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    const choosenList = data.playlist.find(x => x.id === parseInt(req.params.id));
    fs.access(`${__dirname}/${choosenList.name}`, (error) => {
        if (error) {
            fs.mkdir(path.join(__dirname, `${choosenList.name}`), (err) => {
                if (err) {
                    return console.warn(err)
                }
                console.log("Folder successfully created...")
            });
        }
        else {
            console.log('Given directory already exists!')
        }
    })

})

app.get('/api/personalplaylist', (req, res) => {//SEND DATA ABOUT ALL PL
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    if (data.playlist.length === 0) {
        res.send(Error)
    }
    else {
        res.send(data);
    }
});

app.get('/api/getPassword/:id', (req, res) => { //SEND PASSWORD TO CHECK IF GIVEN IS CORRECT
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    const SpecData = data.playlist.find(x => x.id === parseInt(req.params.id));

    console.log(SpecData)
    res.send(SpecData);
})

app.get('/api/filterByGenre', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/genres.json', 'utf8'));
    res.send(data);
});

app.post('/api/sendData/:id', (req, res) => { //SEND INFO ABOUT LAST OPENED PLAYLIST
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/clickedList.json', 'utf8'));
    const clData = { id: body.id, name: body.name }
    data.list.push(clData);
    fs.writeFileSync('./backend/clickedList.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(clData)
});

app.post('/api/add/:name', (req, res) => { //CREATE NEW PLAYLIST
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    let newID = data.playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    const newPlaylist = { id: newID, name: req.params.name, [req.params.name]: body.playlist, password: body.pw/* list: body.playlist */ }
    const newArtist = { name: body.artist }
    data.playlist.push(newPlaylist);
    /* data.artists.push(newArtist); */
    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    //fs.writeFileSync('./backend/artists.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(newPlaylist);
});

app.delete('/api/delete/:id', (req, res) => {//DELETE THE CORECT PL
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    const removable = data.playlist.find(x => x.id === parseInt(req.params.id));
    const index = data.playlist.indexOf(removable);
    data.playlist.splice(index, 1);
    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    console.log('data::: ', data)
    console.log('play::: ', data.playlist)
    res.send(data.playlist)
});



app.use(express.static('./frontend'));
app.listen(9000);