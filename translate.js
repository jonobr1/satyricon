// Imports the Google Cloud client library
var { Translate } = require('@google-cloud/translate');
var fs = require('fs');
var moment = require('moment');

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
var options = { from: 'la', to: 'en' };
var result = {};
var errors = {};
var keys = Object.keys(wordList);
var total = keys.length;
var index = 0;

var startTime = Date.now();

transform(keys[index]);

function transform(word) {
  if (!word) {
    console.log('Bad word');
    next();
  }
  translate
    .translate(word, options)
    .then(function(results) {
      var translation = results[0].toLowerCase();
      // Only add the word to the translation list if Google Translate
      // found any kind of translation:
      if (word === translation) {
        errors[word] = true;
      } else {
        result[word] = translation;
        console.log('Text:', word, 'Translation:', translation, Math.floor(100 * index / total) + '%');
      }
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
    fs.writeFileSync('./assets/word-translation-errors.json', JSON.stringify(errors), 'utf8');
    console.log('Finished.', moment().format(), 'Transcode took', (Date.now() - startTime) / 1000, 'seconds.');
    process.exit(1);
  }
}
