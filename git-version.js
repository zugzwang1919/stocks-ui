// This script runs operations *synchronously* which is normally not the best
// approach, but it keeps things simple, readable, and for now is good enough.

const { gitDescribeSync } = require('git-describe');
const { writeFileSync } = require('fs');

const gitInfo = gitDescribeSync();
const buildDate = new Date();
gitInfo['buildDate'] = buildDate;
gitInfo['version'] = '21.04';
const versionInfoJson = JSON.stringify(gitInfo, null, 2);

writeFileSync('git-version.json', versionInfoJson);