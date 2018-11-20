var fs = require('fs');
var path = require('path');
var Fuse = require('fuse.js');
var _ = require('underscore');

var settings = {
  encoding: 'utf-8'
};

var emojis = fetch('./assets/emoji-fuse-list.json');
var translations = fetch('./assets/word-translations.json');
var errors = fetch('./assets/word-translation-errors.json');

var fuse = new Fuse(emojis, {
  threshold: 0.01,
  distance: 5,
  findAllMatches: true,
  keys: ['keywords']
});

var transcodes = lookup(translations);

fs.writeFileSync(path.resolve(__dirname, './assets/latin-emoji.json'), JSON.stringify(transcodes), settings.encoding);
process.exit(1);

function lookup(list) {

  var result = {};
  var emoji;

  for (var latin in list) {

    var english = list[latin];
    var query;

    if (_.isBoolean(english)) {
      query = fuse.search(latin);
    } else {
      if (english.length <= 3) {
        console.log('Unable to assign emoji for such a small word');
        continue;
      }
      query = fuse.search(english);
    }

    if (query.length > 0) {
      emoji = query[0].emoji;
      result[latin] = emoji;
      console.log('Assigned', latin, 'to', query);
    } else {
      console.log('Unable to assign', latin, 'to an emoji');
    }

  }

  return result;

}

function fetch(filename) {
  var uri = path.resolve(__dirname, filename);
  var result = fs.readFileSync(uri, settings);
  result = JSON.parse(result);
  return result;
}
