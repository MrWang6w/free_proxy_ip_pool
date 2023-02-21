const tunnel = require('tunnel')
const axios = require('axios')
const cheerio = require('cheerio')

// axios('https://www.lilnong.top/cors/sf2',{
//          proxy: false,
//          httpsAgent: tunnel.httpsOverHttp({proxy:{
//              host: '8.8.8.8',//代理服务器域名或者ip
//              port: 80 //代理服务器端口
//          }})
//      })
//      .then(v=>console.log(JSON.stringify(v.data)))
//      .catch(v=>console.log(v.message))

