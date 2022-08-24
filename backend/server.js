import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.get('/music/create', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    res.send(data);
});

app.get('/api/music', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    res.send(data);
});

app.get('/api/personalplaylist/:name', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/akosPlaylist.json', 'utf8'));
    res.send(data.req.params.name);
});

app.get('/api/filterByGenre', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/genres.json', 'utf8'));
    res.send(data);
});

app.post('/api/add', (req, res) => {
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    let newID = data.playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    const newSong = { id: newID, artist: body.artist, title: body.title, genre: body.genre, duration: body.duration }
    const newArtist = { name: body.artist }
    data.playlist.push(newSong);
    data.artists.push(newArtist)
    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    fs.writeFileSync('./backend/artists.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(newSong, newArtist);
});

app.use(express.static('./frontend'));
app.listen(9000);