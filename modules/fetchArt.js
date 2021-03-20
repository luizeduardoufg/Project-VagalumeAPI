import got from 'got';
import jsdom from "jsdom";
const { JSDOM } = jsdom;

export default async (gen) => {
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
