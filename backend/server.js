import express from 'express';
import fs from 'fs';
import path from 'path';
import http from 'http';
import formidable from 'formidable';
import bodyParser from 'body-parser';

const __dirname = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/user';
const __index_html = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/index.html';
const __style_css = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/style.css';
const __script_js = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/script.js';



const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

/* app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(`${__dirname}/public`))

app.use('/', (req, res) => {
    res.status(200).render('index');
}); */

app.get('/api/genre', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/genres.json', 'utf8'));
    let genres = data.genres;
    res.send(genres);
});

app.get('/api/music', (req, res) => {//Shows raw json data
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

app.post('/api/uploadFile/:name', async (req, res, next) => {

    const form = new formidable.IncomingForm();
    const uploadFolder = `${__dirname}/${req.params.name}`
    form.multiples = true;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB
    form.uploadDir = uploadFolder;
    console.log('* * *', form);

    // Parsing
    form.parse(req, async (err, fields, files) => {
        console.log(fields);
        console.log(files);
        if (err) {
            console.log("Error parsing the files");
            return res.status(400).json({
                status: "Fail",
                message: "There was an error parsing the files",
                error: err,
            });
        }
    });

    if (!files.myFile.length) {
        const file = files.myFile;
        const isValid = isFileValid(file);
        const fileName = encodeURIComponent(file.name.replace(/\s/g, '_'));

        if (!isValid) {
            return res.status(400).json({
                status: 'Fail',
                message: 'This file type is not valid!'
            });
        }
        try {
            fs.renameSync(file.path, join(uploadFolder, fileName))
        } catch (error) {
            console.log('! ! ! ', error)
        }

        try {
            const newFile = await File.create({
                name: `files/${fileName}`
            })
            return res.status(200).json({
                status: 'success',
                message: 'File created sucesfully!'
            });
        } catch (error) {
            res.json({
                error
            })
        }
    }
});

app.post('/api/sendData/:id', (req, res) => { //SEND INFO ABOUT LAST OPENED PLAYLIST
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/clickedList.json', 'utf8'));
    const clData = { id: body.id, name: body.name }
    data.list.push(clData);
    fs.writeFileSync('./backend/clickedList.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(clData);
});

app.post('/api/add/:name', (req, res) => { //CREATE NEW PLAYLIST
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    let newID = data.playlist.reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    const newPlaylist = { id: newID, name: req.params.name, [req.params.name]: body.playlist, password: body.pw/* list: body.playlist */ }
    const newArtist = { name: body.artist }
    data.playlist.push(newPlaylist);
    const choosenList = data.playlist.find(x => x.id === newPlaylist.id);
    /* data.artists.push(newArtist); */
    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    fs.access(`${__dirname}/${choosenList.name}`, (error) => { //Checks if given directory already exists
        if (error) {
            fs.mkdir(path.join(__dirname, `${choosenList.name.split(' ').join('_')}`), (err) => {//Creates new direcotry
                if (err) {
                    console.log('* * * Folder cannot be created!')
                }
                console.log("* * * Folder successfully created...")
            });
            fs.copyFile(__index_html, `${__dirname}/${choosenList.name.split(' ').join('_')}/index.html`, (err) => { //Copies index.html to the new dir.
                if (err) {
                    console.log(`* * * Cannot copy HTML file to this location! ${err}`);
                }
                else {
                    console.log('* * * HTML file succesfully copied to the new destination!');
                }
            });
            fs.copyFile(__script_js, `${__dirname}/${choosenList.name.split(' ').join('_')}/script.js`, (err) => { //Copies script.js to the new dir.
                if (err) {
                    console.log(`* * * Cannot copy JS file to this location! ${err}`);
                }
                else {
                    console.log('* * * JS file succesfully copied to the new destination!');
                }
            });
            fs.copyFile(__style_css, `${__dirname}/${choosenList.name.split(' ').join('_')}/style.css`, (err) => { //Copies style.css to the new dir.
                if (err) {
                    console.log(`* * * Cannot copy CSS file to this location! ${err}`);
                }
                else {
                    console.log('* * * CSS file succesfully copied to the new destination!');
                }
            });
        }
        else {
            console.log('* * * Given directory already exists!')
        }
    })
    //fs.writeFileSync('./backend/artists.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(newPlaylist);
});

app.delete('/api/delete/:id', (req, res) => {//DELETE THE CORECT PL
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    const removable = data.playlist.find(x => x.id === parseInt(req.params.id));
    const index = data.playlist.indexOf(removable);
    data.playlist.splice(index, 1);
    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    fs.rm(`${__dirname}/${removable.name}`, { recursive: true }, err => {//delete directory of playlist
        if (err) {
            console.log('* * * Something went wrong! Directory cannort be removed!')
        }
        console.log(`* * * '${removable.name}' directory is deleted succesfully!`)
    })
    res.send(data.playlist)
});



app.use(express.static('./frontend'));
app.listen(9000);