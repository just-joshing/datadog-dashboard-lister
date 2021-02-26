const core = require('@actions/core');
const https = require('https');
const fs = require('fs');
const { match } = require('assert');

async function run() {
  try {
    const datadogApiKey = core.getInput('datadog-api-key', { required: true });
    const datadogAppKey = core.getInput('datadog-app-key', { required: true });
    const filters = JSON.parse(core.getInput('filter-titles-by-keywords', { required: false }));

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
    if (!Array.isArray(filters)) {
      throw new Error("filter-titles-by-keywords must be an array");
    }

    const filteredDashboards = dashboards.filter(d => {
      const title = d.title.toLowerCase();
      let matchesCondition = false;
      for (const filter of filters) {
        if (Array.isArray(filter)) {
          matchesCondition = filter.every(term => title.includes(term));
        } else if (typeof filter == "string") {
          matchesCondition = title.includes(filter);
        } else {
          throw new Error("Unparseable filter");
        }

        if (matchesCondition) {
          break;
        }
      }

      return matchesCondition;
    });

    console.log(`${filteredDashboards.length} dashboards found`);

    console.log("Writing dashboards to output variable");
    output = JSON.stringify(filteredDashboards.map(({ title, description, url }) => ({ title, description, url }))),
    core.setOutput("dashboards", output);
    console.log("Done writing");
  } catch (error) {
    core.setFailed(error.message || error);
  }
}

run();
