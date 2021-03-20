//Imports
import { join } from 'path'
import { existsSync } from 'fs'
import qtAnalysis from './modules/qtAnalysis.js'
import { normalize as _normalize } from './modules/normalize.js'
import { removeAccents, delay, writeFileSync } from './modules/utils.js'
import { fetchArt, requestArtSongs, requestMusic } from './modules/api.js'


//Variables
let gens = [
    'axe', 'bossa-nova', 'forro', 'funk', 'funk-carioca',
    'gospel', 'mpb', 'pagode', 'rap', 'samba', 'sertanejo'
]

let replacer = RegExp(' ', 'g')
let slash = RegExp('/', 'g')

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
                    let songPathJson = join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.json`)
                    let songPathTxt  = join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.txt`)
                    if (existsSync(songPathJson) || existsSync(songPathTxt)){
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
_normalize(gens)
