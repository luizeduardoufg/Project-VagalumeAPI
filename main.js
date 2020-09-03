//Imports
const https              = require('https')
const path               = require('path')
const fs                 = require('fs')
const fetchArt           = require('./utils/fetchArt.js')
const qtAnalysis         = require('./utils/qtAnalysis.js')
const normalize          = require('./utils/normalize.js')


//Variables
let gens = [
    'axe', 'bossa-nova', 'forro', 'funk', 'funk-carioca',
    'gospel', 'mpb', 'pagode', 'rap', 'samba', 'sertanejo'
]
let replacer = RegExp(' ', 'g')
let slash = RegExp('/', 'g')

//Functions
const map = (lang) => {
    switch (lang) {
        case 1: return 'pt'
        case 2: return 'en'
        case 3: return 'es'
        default: return lang
    }
}

const requestArtSongs = (art) => {
    let url = "https://www.vagalume.com.br/" + art + "/index.js"
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let dataChunks = []
            res.on('data', chunk => {
                dataChunks.push(chunk)
            })

            res.on('end', () => {
                let body = Buffer.concat(dataChunks)
                try{
                    body = JSON.parse(body)
                    resolve(body.artist.lyrics.item)
                }catch(err){
                    reject(err)
                }
            })

            res.on('error', err => {
                reject(err)
            })
        })
    })
}

const requestMusic = (art, song) => {
    let url = "https://api.vagalume.com.br/search.php"
                + "?art=" + art
                + "&mus=" + song
                + "&apikey={key}"
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let dataChunks = []
    
            res.on('data', chunk => {
                dataChunks.push(chunk)
            })
    
            res.on('end', () => {
                let body = Buffer.concat(dataChunks)
                try{
                    body = JSON.parse(body)
                    let mus = [body.mus[0].text, body.mus[0].lang]
                    resolve(mus)
                }
                catch(err){
                    reject(err)
                }
            })
    
            res.on('error', err => {
                reject(err)
            })
        })
    })
}

const writeFileSync = (gen, art, songName, mus) => {
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
        try{
            fs.writeFileSync(songPath, JSON.stringify(music, null, 4))
            console.log('Song ' + songName + ' from artist ' + art + ' written!')
        }catch(err){
            console.log('Error writing file: ', err.message)
        }
    } else {
        try{
            fs.mkdirSync(artFolderPath, {recursive: true})
            fs.writeFileSync(songPath, JSON.stringify(music, null, 4))
            console.log('Song ' + songName + ' from artist ' + art + ' written!')

        }catch(err){
            console.log('Error writing file: ', err.message)
        }
    }
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
                        writeFileSync(gen,art,song.desc,mus)
                    }).catch(err => console.log('Error on delay function: ', err.message))
                }
            }catch(e){
                console.log('Error on songs loop: ', e)
            }
        }
    }
}

// main()

const foo = () => {
    let arts = ['Leandro e As Abusadas']
    for(let art of arts){
        let artPath = path.join(__dirname, 'Genders', 'funk-carioca', art)
        readSongs(artPath)
    }
    
}

const readSongs = (dir) => {
    for(let artSong of fs.readdirSync(dir)){
        let data = JSON.parse(fs.readFileSync(path.join(dir, artSong)).toString())
        normalize.normalize(data.song.text)  
    }
}

foo()