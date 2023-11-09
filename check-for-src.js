import fs from 'fs';
if (!fs.existsSync('./src')) {
  throw new Error(
    'src folder not included with published package. To run tests, storybook, etc., fork or clone the repo from https://github.com/dvorakjt/modeled-forms-react and run npm install. Then, run the appropriate command.',
  );
}
