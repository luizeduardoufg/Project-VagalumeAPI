const countWords = async (str) => {
    let exp = /\w+/g
    let words = 0
    let w = exp.exec(str)
    while(w){
        w = exp.exec(str)
        words++
    }
    return words
}

const countLetters = async (str) => {
    let exp =  /^[a-z]+$/i
    let letters = 0
    for(let i=0; i<str.split('').length; i++)
        if (exp.test(str.split('')[i]))
            letters++
    return letters
}

exports.countWords = countWords
exports.countLetters = countLetters