/* eslint-disable */
const axios = require('axios');

function SendSlackNotification() {
  const buildReport = require('../coverage/eslint-build-report.json');
  const codeCoverage = require('../coverage/coverage-summary.json');

  let color = "#36a64f";
  if (buildReport.errors > 0)
    color = "#FF0000";
  else if (buildReport.warnings > 0)
    color = "#ffae42";

  let cov_color = "#FF0000";
  if (codeCoverage.total.statements.pct > 70 &&
      codeCoverage.total.lines.pct > 70 &&
      codeCoverage.total.functions.pct > 70 &&
      codeCoverage.total.branches.pct > 70)
    cov_color = "#ffae42";
  else if (codeCoverage.total.statements.pct > 90 &&
      codeCoverage.total.lines.pct > 90 &&
      codeCoverage.total.functions.pct > 90 &&
      codeCoverage.total.branches.pct > 90)
    cov_color = "#36a64f";

  const SlackPayload = {
    attachments: [
      {
        color: color,
        pretext: 'Build completed on master branch.',
        fields: [
          {
            title: 'No. of errors',
            value: buildReport.errors,
            short: true,
          },
          {
            title: 'No. of warnings',
            value: buildReport.warnings,
            short: true,
          },
        ],
      },
      {
        color: cov_color,
        pretext: 'Code coverage %',
        fields: [
          {
            title: 'Statements',
            value: codeCoverage.total.statements.pct + '%  (' + codeCoverage.total.statements.covered + '/' + codeCoverage.total.statements.total + ')',
            short: true,
          },
          {
            title: 'Lines',
            value: codeCoverage.total.lines.pct + '%  (' + codeCoverage.total.lines.covered + '/' + codeCoverage.total.lines.total + ')',
            short: true,
          },
          {
            title: 'Functions',
            value: codeCoverage.total.functions.pct + '%  (' + codeCoverage.total.functions.covered + '/' + codeCoverage.total.functions.total + ')',
            short: true,
          },
          {
            title: 'Branches',
            value: codeCoverage.total.branches.pct + '%  (' + codeCoverage.total.branches.covered + '/' + codeCoverage.total.branches.total + ')',
            short: true,
          },
        ],
      },
    ],
  };

  const WebHookURL = 'test-slack-url';
  axios
      .post(WebHookURL, SlackPayload)
      .then((res) => {
        console.log(`Slack notification Status: ${res.status}`);
      })
      .catch((err) => {
        console.error(`Slack notification error: ${err}`);
      });
}

SendSlackNotification();
/* eslint-enable */