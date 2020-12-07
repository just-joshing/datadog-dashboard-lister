const core = require('@actions/core');
const https = require('https');
const fs = require('fs');

async function run() {
  try {
    const datadogApiKey = core.getInput('datadog-api-key', { required: true });
    const datadogAppKey = core.getInput('datadog-app-key', { required: true });

    const dashboards = await new Promise((resolve, reject) => {
      https.get('https://api.datadoghq.com/api/v1/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': datadogApiKey,
          'DD-APPLICATION-KEY': datadogAppKey,
        }
      }, resp => {
        let data = "";
        resp.on('data', data_chunk => {
          data += data_chunk;
        });

        resp.on('end', () => {
          data = JSON.parse(data);
          if (!data.dashboards) {
            reject("Dashboards not returned. Likely a request error to Datadog. Check your inputs to this action.");
          }

          resolve(data.dashboards);
        });
      })
      .on('error', error => reject(error));
    });

    console.log("Filtering dashboards");
    const filteredDashboards = dashboards.filter(d => d.title.toLowerCase().includes("secret") && d.title.toLowerCase().includes("scanning"));
    console.log(`${filteredDashboards.length} dashboards found`);

    console.log("Writing dashboards");
    fs.writeFile("dashboards.txt",
      filteredDashboards.map(({ title, url }) => ({ title, url })),
      err => { if (err) throw err; }
    );

    console.log("Done writing");
  } catch (error) {
    core.setFailed(error.message || error);
  }
}

run();
