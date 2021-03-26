import { get } from 'https';
import got from 'got';
import jsdom from "jsdom";
const { JSDOM } = jsdom;

const fetchArt = async (gen) => {
    const url = 'https://www.vagalume.com.br/browse/style/' + gen + '.html'
    const response = await got(url)
    const dom = new JSDOM(response.body)
    let arts = []

    const nodeList = [...dom.window.document.getElementsByClassName('moreNamesContainer')]

    nodeList.forEach(list => {
        list.childNodes.forEach(node => {
            node.childNodes.forEach(li => {
                arts.push(li.textContent)
            })
        })
    })

    return arts
}

const requestArtSongs = (art) => {
    let url = "https://www.vagalume.com.br/" + art + "/index.js"
    return new Promise((resolve, reject) => {
        get(url, res => {
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
        get(url, res => {
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

export {fetchArt, requestArtSongs, requestMusic};