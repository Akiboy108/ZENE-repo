import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.get('/api/music', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    res.send(data);
})

app.use(express.static('./frontend'));
app.listen(9000);