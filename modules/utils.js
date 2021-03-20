import { join } from 'path'
import { existsSync, writeFileSync as _writeFileSync, mkdirSync, writeFile as _writeFile, mkdir } from 'fs'


const mapLang = (lang) => {
    switch (lang) {
        case 1: return 'pt'
        case 2: return 'en'
        case 3: return 'es'
        default: return lang
    }
}

let slash = RegExp('/', 'g')

const writeFileSync = (gen, art, songName, mus) => {
    let songPath = join(process.cwd(), 'Genders', gen, art, `${songName.replace(slash, '')}.json`)
    let artFolderPath = join(process.cwd(), 'Genders', gen, art)
    if (mus[1] != 1){
        console.log(`The music ${songName} is not brazilian.`)
        songPath = join(process.cwd(), 'Genders', gen, art, `${songName.replace(slash, '')}.txt`)
    }
    let music = {
        artist: art,
        song: {
            name: songName,
            text: mus[0],
            lang: mapLang(mus[1])
        }
    }

    if (existsSync(artFolderPath)) {
        try{
            _writeFileSync(songPath, JSON.stringify(music, null, 4))
            console.log('Song ' + songName + ' from artist ' + art + ' written!')
        }catch(err){
            console.log('Error writing file: ', err.message)
        }
    } else {
        try{
            mkdirSync(artFolderPath, {recursive: true})
            _writeFileSync(songPath, JSON.stringify(music, null, 4))
            console.log('Song ' + songName + ' from artist ' + art + ' written!')

        }catch(err){
            console.log('Error writing file: ', err.message)
        }
    }
}


const writeFile = (gen, art, songName, mus) => {
    let songPath = join(process.cwd(), 'Genders', gen, art, `${songName.replace(slash, '')}.json`)
    let artFolderPath = join(process.cwd(), 'Genders', gen, art)
    if (mus[1] != 1){
        console.log(`The music ${songName} is not brazilian.`)
        songPath = join(process.cwd(), 'Genders', gen, art, `${songName.replace(slash, '')}.txt`)
    }
    let music = {
        artist: art,
        song: {
            name: songName,
            text: mus[0],
            lang: mapLang(mus[1])
        }
    }

    if (existsSync(artFolderPath)) {
        _writeFile(songPath,
            JSON.stringify(music, null, 4),
            (err) => {
                if (err) throw err
                console.log('Song ' + songName + ' from artist ' + art + ' written!')
            })
    } else {
        mkdir(artFolderPath, { recursive: true }, err => {
            if (err) throw err
            _writeFile(songPath,
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


export const mapLang = mapLang
export const writeFile = writeFile
export const writeFileSync = writeFileSync
export const delay = delay
export const removeAccents = removeAccents