const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const DIRECTORY_TO_TRACK = core.getInput('directory_to_track', req);
const NUMBER_OF_CODE_OWNERS = core.getInput('number_of_code_owners', req);
const FILE_PATH = path.join(DIRECTORY_TO_TRACK, 'CODEOWNERS');


const fileStream = fs.createReadStream(FILE_PATH);
