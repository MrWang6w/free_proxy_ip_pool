const axios = require('axios');

async function trigger() {
  const { data } = await axios({
    url: `https://api.github.com/repos/MrWang6w/free_proxy_ip_pool/dispatches`,
    headers: {
      Accept: 'application/vnd.github.everest-preview+json',
      Authorization: `token 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`,
    },
    method: 'post',
    data: {
      event_type: 'webhook-run', 
      inputs: {
        logLevel: 111
      }
    },
  });
  console.log('data:', data);
}

// trigger()