//Imports
import { join } from 'path'
import { existsSync } from 'fs'
import { normalize } from './modules/normalize.js'
import { removeAccents, delay, writeFileSync, flagOKExists, writeFlagOK } from './modules/utils.js'
import { fetchArt, requestArtSongs, requestMusic } from './modules/api.js'

// WLS2 insted of process.cwd(), SRC
const SRC = '/mnt/d/Projects/PFC/Project-VagalumeAPI/src/';


//Variables
//genders that doesn't have enough brasilian musicians
//black-music, blues,chillout, classic rock, classico, country, dance, disco, electro swing, electronica, emocore,
//fado, folk, gotico, grunge, hard rock, hardcore, heavy metal, hip hop,house, indie, industrial, infantil,
// instrumental, j-pop/j-rock, jazz, jovem guarda, k-pop/k-rock, kizomba, lo-fi, metal, musicas gauchas, new age,
// new wave, piano rock, pop/punk, pos-punk, post-rock, power-pop, progressivo, psicodelia, punk rock, r&b, reggae,
// reggaeton, rock alternativo, rockabilly, samba enredo, ska, soft rock, soul music, surf music,tecnopop, trance,
// trap, trilha sonora, trip-hop, tropical house, trilha sonora, velha guarda, world music.

const gens = [
  'axe', 'bossa-nova', 'forro', 'funk', 'funk-carioca', 'gospel',
  'mpb', 'pagode', 'pop', 'pop-rock', 'rap', 'regional', 'rock',
  'romantico', 'samba', 'sertanejo',
];

const replacer = RegExp(' ', 'g');
const slash = RegExp('/', 'g');
const __dirname = SRC;

const main = async () => {
  for (let gen of gens) {
    if (flagOKExists(gen)) continue;
    console.log(`Gender> ${gen}`);
    let arts = await fetchArt(gen);
    for (let art of arts) {
      console.log(`Artist> ${art}`);
      let artNorm = removeAccents(art).replace(replacer, '-').toLowerCase();
      let songs = await requestArtSongs(artNorm)
        .catch(err => console.log('Error requesting songs: ', err.message))
      try {
        for (let song of songs) {
          let songPathJson = join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.json`);
          let songPathTxt = join(__dirname, 'Genders', gen, art, `${song.desc.replace(slash, '')}.txt`);
          if (existsSync(songPathJson) || existsSync(songPathTxt)) {
            console.log(`The music ${gen + '>' + art + '>' + song.desc} from artist ${art} already exists.`);
            continue;
          }
          console.log(gen + '> ' + art + '> ' + `Song> ${song.desc}`);
          try {
            let mus = await requestMusic(art, song.desc, true);
            writeFileSync(gen, art, song.desc, mus);
          } catch (err) {
            console.log('Error requesting lyrics: ', err.message);
          }
          finally {
            await delay(3000);
          }
        }
      } catch (e) {
        console.log('Error on songs loop: ', e);
      }
    }
    writeFlagOK(gen);
  }
}

// main();
normalize(gens);