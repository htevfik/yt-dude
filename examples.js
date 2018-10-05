// this part is not relative to examples
// i wrote this to make sure 
// you can see output well
const
  fs = require('fs'),
  exampleOutput = fs.createWriteStream('index.output.txt');

process.stdout.write = process.stderr.write = exampleOutput.write.bind(exampleOutput);

// first and easiest thing;
// getting results from 
// a youtube search
const crawler = require('./dist');

crawler.verbose = true;
crawler.search('gazirovka black').then(results => {
  console.log(results[0]);
});