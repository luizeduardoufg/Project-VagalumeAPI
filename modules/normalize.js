import { join } from 'path'
import { readdirSync, readFileSync } from 'fs'

const _getLastLine = (str) => {
    let split = str.split('\n')
    return split[split.length-1]
}

const _normalize = (str) => {
    let lastLine = _getLastLine(str)
    let split = lastLine.split('')
    let alpha =  /^[a-zà-ú]+$/i
    let pontuation = []
    for(let i=split.length-1;i>=0;i--){
        if(alpha.test(split[i])) break
        if (!alpha.test(split[i]))
            pontuation.unshift(split[i])
    }

    let pontLength = pontuation.length-1

    if (
        (
           pontuation[pontLength] == ')'
        || pontuation[pontLength] == ']'
        || pontuation[pontLength] == '}'
    )){
        lastLine = lastLine.slice(0,lastLine.length) + '.'
        console.log(lastLine, pontuation)
    }
    else{
        lastLine = lastLine.slice(0,lastLine.length - pontuation.length) + '.'
        console.log(lastLine, pontuation)
    }
}

const normalize = (gens) => {
    for (let gen of gens){
        let genPath = join(process.cwd(), 'Genders', gen)
        let arts = readdirSync(genPath)
        for(let art of arts){
            let artPath = join(process.cwd(), 'Genders', gen, art)
            for(let artSong of readdirSync(artPath)){
                let data = JSON.parse(readFileSync(join(artPath, artSong)).toString())
                _normalize(data.song.text)
            }
        }
    }

}


export const normalize = normalize