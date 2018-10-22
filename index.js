// Imports the Google Cloud client library
var {Translate} = require('@google-cloud/translate');
var fs = require('fs');

// Your Google Cloud Platform project ID
var projectId = 'jono-fyi';

// Instantiates a client
var translate = new Translate({
  projectId: projectId,
});

var wordList = fs.readFileSync('./assets/word-occurrence.json');
wordList = JSON.parse(wordList);

// // The text to translate
// var text = 'Hello, world!';
// // The target language
var target = 'en';
var result = {};
var keys = Object.keys(wordList);
var total = keys.length;
var index = 0;

transform(keys[index]);

function transform(word) {
  if (!word) {
    console.log('Bad word');
    next();
  }
  translate
    .translate(word, target)
    .then(function(results) {
      var translation = results[0];
      result[word] = translation;
      console.log(`Text: `, word, 'Translation:', translation, Math.floor(100 * index / total) + '%');
      next();
    })
    .catch(function(err) {
      console.error('ERROR:', err);
    });
}

function next() {
  if (index < total) {
    index++;
    transform(keys[index]);
  } else {
    console.log('Saving out file');
    console.log(result);
    fs.writeFileSync('./assets/word-translations.json', JSON.stringify(result), 'utf8');
    console.log('Done');
  }
}
