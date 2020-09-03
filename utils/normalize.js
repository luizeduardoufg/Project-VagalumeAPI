const getLastLine = (str) => {
    let split = str.split('\n')
    return split[split.length-1]
}

const normalize = (str) => {
    let lastLine = getLastLine(str)
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
        ( pontuation[pontLength] == ')' 
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

exports.normalize = normalize