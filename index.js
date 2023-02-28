const tunnel = require('tunnel');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
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
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
};

//目标 快代理
//https://www.kuaidaili.com/free/inha/

class getIpPools {
  constructor() {
    this.ipList = [];
    this.successList = [];
    this.getLength = 0;
  }

  async toMultithreading() {
    const tasks = [
      ...new Array(5)
        .fill('')
        .map((__, i) => `https://www.kuaidaili.com/free/inha/${i + 1}`),
      ...new Array(5)
        .fill('')
        .map((__, i) => `https://www.kuaidaili.com/free/intr/${i + 1}`),
    ];
    for (const url of tasks) {
      const data = await this.getProxyIps(url);
      this.ipList = [...this.ipList, ...data];
    }
    this.getLength = this.ipList.length;
    console.log('this.ipList:', this.ipList);
  }

  async getProxyIps(url) {
    try {
      const { data: result } = await axios({
        url,
        headers: defaultHeaders,
        timeout: 3000,
      });
      const $ = cheerio.load(result);
      let list = [];
      $('#list .table tbody tr').each((i, e) => {
        let obj = {};
        $(e)
          .children()
          .each((x, y) => {
            switch (x) {
              case 0:
                obj.host = $(y).text();
                break;
              case 1:
                obj.port = $(y).text();
                break;
              case 4:
                obj.city = $(y).text();
                break;
              case 2:
                obj.type = $(y).text();
                break;

              default:
                break;
            }
          });
        list.push({
          ...obj,
          time: new Date().toLocaleString(),
        });
      });
      return list;
    } catch (error) {
      return [];
    }
  }

  //检测ip质量
  async checkIp(list) {
    for (const item of list) {
      try {
        await axios({
          url: 'https://www.baidu.com/',
          headers: defaultHeaders,
          proxy: false,
          httpsAgent: tunnel.httpsOverHttp({
            proxy: _.pick(item, ['host', 'port']),
          }),
          httpAgent: tunnel.httpOverHttp({
            proxy: _.pick(item, ['host', 'port']),
          }),
          timeout: 3000,
        });
        this.successList.push(item);
      } catch (error) { }
    }
  }

  async toDefaultRun() {
    await this.toMultithreading();
    await this.checkIp(this.ipList);
    console.log('this.successList:', this.successList);
    fs.writeFileSync(
      `./result.json`,
      JSON.stringify(this.successList),
      'utf-8'
    );
    console.log('写入成功:');
  }

  async toTestRun() {
    await this.toMultithreading();
    fs.writeFileSync(
      `./${Date.now()}.json`,
      JSON.stringify(this.ipList),
      'utf-8'
    );
    console.log('写入成功:');
  }
}

const work = new getIpPools();

const method = process.argv[2]
console.log('method:', method);
if(!_.isEmpty(method)){
  work[method]()

}