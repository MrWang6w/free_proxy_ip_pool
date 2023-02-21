const tunnel = require('tunnel');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash')
const baseUrl = 'https://www.xiaoxiangdaili.com'
const defaultHeaders = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'zh-CN,zh;q=0.9',
  'sec-ch-ua':
    '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  Referer: 'https://www.xiaoxiangdaili.com/',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};

//目标大象代理
//https://www.xiaoxiangdaili.com/free/list

//获取最新一天Url
async function getTodayUrl() {
  const { data: list } = await axios({
    url: 'https://www.xiaoxiangdaili.com/free/list',
    header: defaultHeaders,
  });
  const $ = cheerio.load(list);
  let mainList = []
  $('#main > .blogTop > .panel ').each((i, e) => {
    const content = $(e)?.find('.clearfix') || {}
    const { href = '' } = content?.attr()
    const title = content?.find('.title').text()
    if (!_.isEmpty(href) && !_.isEmpty(title)) {
      mainList = [...mainList, {
        url: `${baseUrl}${href}`,
        title,
        href
      }]
    }
  })
  // console.log('mainList:', mainList);
  return _.get(mainList, '[0]', {})
}

//获取代理
async function getProxyIps() {
  const { url } = await getTodayUrl();
  const { data: result } = await axios({
    url,
    header: defaultHeaders,
  })
  const $ = cheerio.load(result);
  const originLength = $('.freeProxyInfo tr').length;
  let list = []
  $('.freeProxyInfo tr').each((i, e) => {
    let obj = {}
     $(e).children().each((x,y)=>{
       switch (x) {
         case 0:
           obj.ip = $(y).text()
           break;
         case 1:
           obj.port = $(y).text()
           break;
         case 2:
           obj.city = $(y).text()
           break;
         case 3:
           obj.type = $(y).text()
           break;
       
         default:
           break;
       }
    })
    list.push(obj)
  })
  console.log('list:', list);
}


getProxyIps()
// axios('https://www.lilnong.top/cors/sf2',{
//          proxy: false,
//          httpsAgent: tunnel.httpsOverHttp({proxy:{
//              host: '8.8.8.8',//代理服务器域名或者ip
//              port: 80 //代理服务器端口
//          }})
//      })
//      .then(v=>console.log(JSON.stringify(v.data)))
//      .catch(v=>console.log(v.message))
