const path = require('path')


const mapLang = (lang) => {
    switch (lang) {
        case 1: return 'pt'
        case 2: return 'en'
        case 3: return 'es'
        default: return lang
    }
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
            lang: mapLang(mus[1])
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
            lang: mapLang(mus[1])
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


module.exports = {
    mapLang: mapLang, 
    writeFile: writeFile,
    writeFileSync: writeFileSync,
    delay: delay,
    removeAccents: removeAccents,
}