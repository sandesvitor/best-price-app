const amazon = require('./bots/amazon')
const kabum = require('./bots/kabum')

require('dotenv').config()
require('./db/database/index')


const scrapper = (fn) => {
    return new Promise(resolve => {
        fn()
        resolve()
    })
}

async function exec() {
    try {
        await scrapper(amazon)

        await scrapper(kabum)

        return  "Run completed with no errors!!"

    } catch (ex) {
        console.log('Erro: ', ex)
    }
}

exec().then(console.log)
