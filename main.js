//Imports
const path               = require('path')
const fs                 = require('fs')
const qtAnalysis         = require('./modules/qtAnalysis.js')
const normalize          = require('./modules/normalize.js')
const utils              = require('./modules/utils.js.js')
const api                = require('./modules/api.js.js')


//Variables
let gens = [
    'axe', 'bossa-nova', 'forro', 'funk', 'funk-carioca',
    'gospel', 'mpb', 'pagode', 'rap', 'samba', 'sertanejo'
]
let replacer = RegExp(' ', 'g')
let slash = RegExp('/', 'g')

//Functions
const main = async () => {
    for (let gen of gens){
        console.log(`Gender> ${gen}`)
        let arts = await api.fetchArt(gen)
        for (let art of arts) {
            console.log(`Artist> ${art}`)
            let artNorm = utils.removeAccents(art).replace(replacer, '-').toLowerCase()
            let songs = await api.requestArtSongs(artNorm)
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
                    await utils.delay(3000).then(async () => {
                        let mus = await api.requestMusic(art, song.desc)
                                        .catch(err => console.log('Error requesting lyrics', err.message))
                        utils.writeFileSync(gen,art,song.desc,mus)
                    }).catch(err => console.log('Error on delay function: ', err.message))
                }
            }catch(e){
                console.log('Error on songs loop: ', e)
            }
        }
    }
}

const foo = () => {
    for (let gen of gens){
        let genPath = path.join(__dirname, 'Genders', gen)
        let arts = fs.readdirSync(genPath)
        for(let art of arts){
            let artPath = path.join(__dirname, 'Genders', gen, art)
            for(let artSong of fs.readdirSync(artPath)){
                let data = JSON.parse(fs.readFileSync(path.join(artPath, artSong)).toString())
                normalize.normalize(data.song.text)  
            }
        }
    }
    
}


// main()
// foo()

