import fs from 'fs';
if(!fs.existsSync('./src/__test__')) {
  throw new Error('Test folder not included with published pacakge. To run tests, fork or clone the repo from https://github.com/dvorakjt/modeled-forms-react and run npm install. Then run npm test.');
}