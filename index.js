const core = require('@actions/core');
const https = require('https');

async function run() {
  try {
    const dd_api_key = core.getInput('datadog-api-key', { required: true });
    const dd_app_key = core.getInput('datadog-app-key', { required: true });

    console.log(`API ${dd_api_key.length}`);
    console.log(`APP ${dd_app_key.length}`);

    return new Promise(resolve => {
      https.get('https://api.datadoghq.com/api/v1/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': dd_api_key,
          'DD-APPLICATION-KEY': dd_app_key,
        }
      }, resp => {
        let data = "";
        resp.on('data', data_chunk => {
          data += data_chunk;
        });

        resp.on('end', () => {
          data = JSON.parse(data);
          console.log(data);

          if (data.dashboards) {
            console.log(`Length ${data.dashboards.length}`);

            if (data.dashboards.length > 0) {
              console.log(`Length ${data.dashboards[0].author_handle}`);
            }
          } else {
            core.setFailed("No dashboards");
          }

          const time = (new Date()).toTimeString();
          core.setOutput("time", time);

          resolve();
        });
      });
    });

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
