/* eslint-disable */
const fs = require('fs');

module.exports = function (results = []) {
    const summary = results.reduce(
        function (seq, current) {
            seq.errors += current.errorCount;
            seq.warnings += current.warningCount;
            return seq;
        },
        { errors: 0, warnings: 0 },
    );
    const buildReport = { errors: summary.errors, warnings: summary.warnings };

    fs.writeFile(`./coverage/eslint-build-report.json`, JSON.stringify(buildReport), function (errCreate) {
        if (errCreate) {
            console.log(`Error writeJsonToStorage: ${errCreate}`);
        }
        console.log(`eslint-build-report.json created.`);
    });
    console.log(`Errors: ${summary.errors}, Warnings: ${summary.warnings}\n`);
};
/* eslint-enable */