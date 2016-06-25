const Path = require("path");
const Fs = require("fs");

const files_path = Path.join(__dirname, "..", "..", "..", "files");
const music_dir = Path.join("Audio", "Music");
const absolute_path = Path.join(files_path, music_dir);
if(!Fs.existsSync(absolute_path)){ Fs.mkdirSync(absolute_path); }

var bands = {};

const read_file = function(band, album, file){
    const album_path = Path.join(band, album);
    const file_path = Path.join(album_path, file);
    if (!Fs.lstatSync(Path.join(absolute_path, file_path)).isDirectory()) {
        var ext = Path.extname(file);
        if(ext == ".mp3"){
            bands[band].albums[album].songs.push({
                id: bands[band].albums[album].songs.length.toString(),
                title: file,
                artist: band,
                url: "/files/get?path=/Audio/Music/"+album_path+"&file="+file
            });
        } else if(ext == ".png" || ext == ".jpg"){
            if(file == ("cover" + ext)){ bands[band].albums[album].cover = file_path;
            } else { console.log(file); }
        }
    } else { console.log(file_path); }
}

const read_album = function(band, album){
    const path = Path.join(absolute_path,band,album);
    if (Fs.lstatSync(path).isDirectory()) {
        bands[band].albums[album] = {
            name: album,
            songs: []
        }
        Fs.readdir(path, function (err, files) {
            if (err) throw err;
            files.forEach(function(file){ read_file(band,album,file); });
        });
    } else { read_file(band,album); }
}

const read_band = function(band){
    const path = Path.join(absolute_path,band);
    bands[band] = {
        name: band,
        albums: {}
    };
    if (Fs.lstatSync(path).isDirectory()) {
        Fs.readdir(path, function (err, files) {
            if (err) throw err;
            files.forEach(function(file){ read_album(band,file); });
        });
    } else { read_file(band); }
}

Fs.readdir(absolute_path, function (err, files) {
    if (err) throw err;
    files.forEach(function(file){ read_band(file); });
});

const bands_handler = function(req, res){
    res(JSON.stringify(bands));
}

const band_handler = function(req, res){
    var band = bands[req.params.band];
    if(band){ res(JSON.stringify(band)); }
    else { res({ "code": 404 }); }
}

const get_band_handler = function(req, res){
    var band = bands[req.params.band];
    if(band){
        //TODO: enviar discografia zipada
    } else { res({ "code": 404 }); }
}

const album_handler = function(req, res){
    var band = bands[req.params.band];
    if(band){
        var album = band.albums[req.params.album];
        if(album){ res(JSON.stringify(album)); }
        else { res({ "code": 404 }); }
    } else { res({ "code": 404 }); }
}

const get_album_handler = function(req, res){
    var band = bands[req.params.band];
    if(band){
        var album = band.albums[req.params.album];
        if(album){
            //TODO: enviar album
        } else { res({ "code": 404 }); }
    } else { res({ "code": 404 }); }
}

const song_handler = function(req, res){
    var band = bands[req.params.band];
    if(band){
        var album = band.albums[req.params.album];
        if(album){
            var song = album.songs[req.params.song];
            if(song){ res(JSON.stringify(song)); }
            else { res({ "code": 404 }); }
        } else { res({ "code": 404 }); }
    } else { res({ "code": 404 }); }
}

// TODO: Implementar verificação de token
module.exports = [{method: "GET", path: "/music/bands", handler: bands_handler },
                  {method: "GET", path: "/music/bands/{band}", handler: band_handler },
                  {method: "GET", path: "/music/bands/{band}/get", handler: get_band_handler },
                  {method: "GET", path: "/music/bands/{band}/{album}", handler: album_handler },
                  {method: "GET", path: "/music/bands/{band}/{album}/get", handler: get_album_handler },
                  {method: "GET", path: "/music/bands/{band}/{album}/{song}", handler: song_handler }];
