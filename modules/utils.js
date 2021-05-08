import { join } from 'path'
import { existsSync, writeFileSync as _writeFileSync, mkdirSync, writeFile as _writeFile, mkdir, exists } from 'fs'

const SRC = '/mnt/d/Projects/PFC/Project-VagalumeAPI/src/';

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
  let songPath = join(SRC, 'Genders', gen, art, `${songName.replace(slash, '')}.json`)
  let artFolderPath = join(SRC, 'Genders', gen, art)
  if (mus[1] != 1) {
    console.log(`The music ${gen + '>' + art + '>' + songName} is not brazilian.`)
    songPath = join(SRC, 'Genders', gen, art, `${songName.replace(slash, '')}.txt`)
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
    try {
      _writeFileSync(songPath, JSON.stringify(music, null, 4))
      console.log(gen + '> ' + 'Song> ' + songName + ' from artist> ' + art + ' written!')
    } catch (err) {
      console.log('Error writing file: ', err.message)
    }
  } else {
    try {
      mkdirSync(artFolderPath, { recursive: true })
      _writeFileSync(songPath, JSON.stringify(music, null, 4))
      console.log(gen + '> ' + 'Song> ' + songName + ' from artist> ' + art + ' written!')

    } catch (err) {
      console.log('Error writing file: ', err.message)
    }
  }
}


const writeFile = (gen, art, songName, mus) => {
  let songPath = join(SRC, 'Genders', gen, art, `${songName.replace(slash, '')}.json`)
  let artFolderPath = join(SRC, 'Genders', gen, art)
  if (mus[1] != 1) {
    console.log(`The music ${songName} is not brazilian.`)
    songPath = join(SRC, 'Genders', gen, art, `${songName.replace(slash, '')}.txt`)
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

const delay = t => new Promise(resolve => setTimeout(resolve, t))


const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const writeFlagOK = gen => {
  const path = join(SRC, 'Genders', gen, 'ok.txt');
  _writeFile(path, '', (err) => {
    if (err) throw err;
  });
}

const flagOKExists = gen => {
  const path = join(SRC, 'Genders', gen, 'ok.txt');
  if (existsSync(path)) {
    console.log('Flag OK exists on gender ' + gen + '. Moving on to the next gender.');
    return true;
  }
}

export { mapLang, writeFile, writeFileSync, delay, removeAccents, flagOKExists, writeFlagOK };