import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import http from 'http';
import simpleGit from 'simple-git'
import formidable from 'formidable';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());

const git = simpleGit();
const __dirname = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/user';
const __index_html = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/index.html';
const __style_css = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/style.css';
const __script_js = 'D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/frontend/copyFiles/script.js';

app.get('/api/autoCommit/:name', async (req, res) => {
    await git.add('./frontend/user');
    await git.commit(`${req.params.name} folder added`);
});




/*==================================================================================================================================*/
/*==================================================================================================================================*/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "D:/WEB/htdocs/Webfejlesztés/VS_Code/ZENE-repo/uploads")
    },
    filename: function (req, file, cb) {
        console.error('! ! ! FILE ========> ', file);
        cb(null, file.fieldname + "-" + Date.now() + ".mp3")
    }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 100 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /mp3|wav/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("myFile");

app.get("/upload", function (req, res) {
    res.render("Signup");
})

app.post("/uploadSong/:name", function (req, res, next) {
    const data = JSON.parse(fs.readFileSync('./backend/playlist.json', 'utf8'));
    const body = req.body;
    const playlist = data.playlist.find(x => x.name === (req.params.name));
    let newID = playlist[req.params.name].reduce((prev, curr) => prev.id > curr.id ? prev : curr, { id: 0 }).id + 1;
    const newObj = { id: newID, folder: body.folder, artist: body.artist, title: body.title, file: body.file, genre: body.genre, extension: body.extension };
    playlist[req.params.name].push(newObj);

    fs.writeFileSync('./backend/playlist.json', JSON.stringify(data, undefined, 4), 'utf8');
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function (err) {
        if (err) {
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
            // SUCCESS, image successfully uploaded
            res.send("Success, Song uploaded!")
        }
    })
})
/*==================================================================================================================================*/
/*==================================================================================================================================*/




app.set("view engine", "ejs")
app.set('views', path.join(__dirname, "views"))
app.use(express.static(`${__dirname}/public`))


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

app.get('/api/uploadFile', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./backend/clickedList.json', 'utf8'));
    const info = data.list[data.list.length - 1];
    console.log('* * * NAME: ', info.name)
    res.send(info)
});

app.post('/api/sendData/:id', (req, res) => { //SEND INFO ABOUT LAST OPENED PLAYLIST
    const body = req.body;
    const data = JSON.parse(fs.readFileSync('./backend/clickedList.json', 'utf8'));
    const clData = { id: body.id, name: body.name }
    data.list.push(clData);
    fs.writeFileSync('./backend/clickedList.json', JSON.stringify(data, undefined, 4), 'utf8');
    res.send(clData.name);
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
            fs.mkdir(path.join(__dirname, `${choosenList.name.split(' ').join('_')}/music`), (err) => {//Creates new direcotry for musics
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