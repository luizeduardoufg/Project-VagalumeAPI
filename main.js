const fs = require('fs')
const { JSDOM } = require("jsdom")
const { window } = new JSDOM("")
const $ = require("jquery")(window)
const path = require('path')
const fetchArt = require('./utils/fetchArt.js')
const qtAnalysis = require('./utils/qtAnalysis.js')

let gens = [
    'axe', 'bossa-nova', 'forro', 'funk', 'funk-carioca',
    'gospel', 'mpb', 'pagode', 'rap', 'samba', 'sertanejo'
]
let replacer = RegExp(' ', 'g')
let slash = RegExp('/', 'g')

const requestArtSongs = (artist) => {
    return $.getJSON("https://www.vagalume.com.br/" + artist + "/index.js").then(
        function (data) {
            return data.artist.lyrics.item
        }
    )
}

const map = (lang) => {
    switch (lang) {
        case 1: return 'pt'
        case 2: return 'en'
        case 3: return 'es'
        default: return lang
    }
}

const requestMusic = (artist, song) => {
    return $.getJSON(
        "https://api.vagalume.com.br/search.php"
        + "?art=" + artist
        + "&mus=" + song
        + "&apikey={key}"
    ).then(function (data) {
        return [data.mus[0].text, data.mus[0].lang]
    })
}


const writeFile = (gen, art, songName, mus) => {
    let songPath = path.join(__dirname, 'Genders', gen, art, `${songName.replace(slash, '')}.json`)
    let artFolderPath = path.join(__dirname, 'Genders', gen, art)
    if (mus[1] != 1){
        console.log(`The music ${songName} is not brazilian.`)
        songPath = path.join(__dirname, 'Genders', gen, art, `${songName.replace(slash, '')}.txt`)
    }
    let music = {
        artist: art,
        song: {
            name: songName,
            text: mus[0],
            lang: map(mus[1])
        }
    }

    if (fs.existsSync(artFolderPath)) {
        fs.writeFile(songPath,
            JSON.stringify(music, null, 4),
            (err) => {
                if (err) throw err
                console.log('Song ' + songName + ' from artist ' + art + ' written!')
            })
    } else {
        fs.mkdir(artFolderPath, { recursive: true }, err => {
            if (err) throw err
            fs.writeFile(songPath,
                JSON.stringify(music, null, 4),
                (err) => {
                    if (err) throw err
                    console.log('Song ' + songName + ' from artist ' + art + ' written!')
                })
        })
    }
}

const delay = t => new Promise (resolve => setTimeout(resolve, t))


const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}


const main = async () => {
    for (let gen of gens){
        console.log(`Gender> ${gen}`)
        let arts = await fetchArt(gen)
        for (let art of arts) {
            console.log(`Artist> ${art}`)
            let artNorm = removeAccents(art).replace(replacer, '-').toLowerCase()
            let songs = await requestArtSongs(artNorm)
                                .catch(err => console.log('Error requesting songs: ',err.message))
            try{
                for(let song of songs){
                    let songPathJson = path.join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.json`)
                    let songPathTxt  = path.join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.txt`)
                    if (fs.existsSync(songPathJson) || fs.existsSync(songPathTxt)){
                        console.log(`The music ${song.desc} from artist ${art} already exists.`)
                        continue
                    }
                    console.log(`Song> ${song.desc}`)
                    await delay(3000).then(async () => {
                        let mus = await requestMusic(art, song.desc)
                                            .catch(err => console.log('Error requesting lyrics', err.message))
                        writeFile(gen, art, song.desc, mus)
                    }).catch(err => console.log('Error on delay function: ', err.message))
                }
            }catch(e){
                console.log('Error on songs loop: ', e)
            }
        }
    }
}

// main()
