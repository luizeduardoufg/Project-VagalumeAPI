import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { exit } from 'process';

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

  splitLines.forEach(line => {
    if (line == '') {
      console.log(line);
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
      console.log(line, pontuation);
    }
    else {
      line = line.slice(0, line.length - pontuation.length) + '.';
      console.log(line, pontuation);
    }
  });
}

const normalize = (gens) => {
  let count = 0;
  let x = 7; // X = 4, casos de REFRÃO
  for (let gen of gens) {
    let genPath = join(process.cwd(), 'Genders', gen)
    let arts = readdirSync(genPath)
    for (let art of arts) {
      let artPath = join(process.cwd(), 'Genders', gen, art)
      for (let artSong of readdirSync(artPath)) {
        let data = JSON.parse(readFileSync(join(artPath, artSong)).toString())
        if (count === x) _normalize(data.song.text);
        count++;
        if (count > x) exit();
      }
    }
  }

}


export { normalize };