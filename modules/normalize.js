import { join } from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';

const SRC = '/mnt/d/Projects/PFC/Project-VagalumeAPI/src/';

const _normalize = (str) => {
  // console.log(str);
  let numberXRegExp = /(\d+)(x)/gi;
  let xNumberRegExp = /(x)(\d+)/gi;
  let parentesesRegExp = / *\([^)]*\) */g;
  let squareBracketsRegExp = / *\[[^\]]*]/g;
  let bracketsRegExp = / *\{[^\}]*}/g;
  str = str.replace(numberXRegExp, '');
  str = str.replace(xNumberRegExp, '');
  str = str.replace(parentesesRegExp, '');
  str = str.replace(squareBracketsRegExp, '');
  str = str.replace(bracketsRegExp, '');

  // console.log('==================================================\n', str);

  let splitLines = str.split('\n');

  let finalStr = '';

  splitLines.forEach(line => {
    if (line == '') {
      // console.log(line);
      finalStr += '\n';
      return line;
    }
    let alpha = /^[a-zà-ú]+$/i;
    let split = line.split('');
    let pontuation = [];
    for (let i = split.length - 1; i >= 0; i--) {
      if (alpha.test(split[i])) break;
      if (!alpha.test(split[i])) pontuation.unshift(split[i]);
    }
    let pontLength = pontuation.length - 1;

    if (pontuation[pontLength] == ')' || pontuation[pontLength] == ']' || pontuation[pontLength] == '}') {
      line = line.slice(0, line.length) + '.';
      finalStr += line;
      // console.log(line, pontuation);
    }
    else {
      line = line.slice(0, line.length - pontuation.length) + '.';
      finalStr += line;
      // console.log(line, pontuation);
    }
    finalStr += '\n';
  });

  // console.log(finalStr);
  return finalStr;
}

const normalize = (gens) => {
  // let count = 0;
  // let x = 0; // X = 4, casos de REFRÃO
  for (let gen of gens) {
    let genPath = join(SRC, 'Genders', gen)
    let arts = readdirSync(genPath)
    for (let art of arts) {
      let artPath = join(SRC, 'Genders', gen, art)
      for (let artSong of readdirSync(artPath)) {
        let data = JSON.parse(readFileSync(join(artPath, artSong)).toString())
        // if (count === x) {
          console.log(gen, ' - ', art, ' - ', artSong);
          let normalizedSongText = _normalize(data.song.text);
          data.song.text = normalizedSongText;
          let songName = artSong.split('.').slice(0, -1).join('.');
          let slash = RegExp('/', 'g');
          let songPath = join(artPath, `${songName.replace(slash, '')}.json`);
          // console.log(songPath);
          // console.log(songName);
          // console.log(data);
          writeFileSync(songPath, JSON.stringify(data, null, 4));
        // }
        // count++;
        // if (count > x) exit();
      }
    }
  }

}


export { normalize };