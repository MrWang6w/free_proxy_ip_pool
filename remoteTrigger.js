const axios = require('axios');
const { Octokit } = require('octokit');
const _ = require('lodash');
async function testRun() {
  const octokit = new Octokit({
    auth: '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',
  });

  const { data: logsData } = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/workflows',
    {
      owner: 'MrWang6w',
      repo: 'free_proxy_ip_pool',
    }
  );

  const webHookAction = _.find(
    _.get(logsData, 'workflows', []),
    (x) => x.name.indexOf('webhook') !== -1
  );

  const data = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: 'MrWang6w',
    repo: 'free_proxy_ip_pool',
    event_type: 'webhook-run',
    client_payload: {
      logLevel: 111,
    },
  });
  // const data = await octokit.request(
  //   'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
  //   {
  //     owner: 'MrWang6w',
  //     repo: 'free_proxy_ip_pool',
  //     event_type: 'webhook-run',
  //     // inputs: {
  //     //   logLevel: 111,
  //     // },
  //     workflow_id: _.get(webHookAction, 'id'),
  //     ref: 'master',
  //     inputs: {
  //       logLevel: '111',
  //     },
  //   }
  // );

  console.log('data:', data);
}

testRun();

async function trigger() {
  const { data } = await axios({
    url: `https://api.github.com/repos/MrWang6w/free_proxy_ip_pool/dispatches`,
    headers: {
      // Accept: 'application/vnd.github.everest-preview+json',
      Authorization: `token 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`,
    },
    method: 'post',
    data: {
      event_type: 'webhook-run',
      // inputs: {
      //   logLevel: 111
      // }
    },
  }).catch((e) => {
    console.log('e:', e);
  });
  console.log('data:', data);
}

// trigger()
