var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var files = setup([
  './assets/emoji-names.txt',
  './assets/emoji-find-replace.txt',
  './assets/emoji-character-picker.txt'
]);

var emojis = merge(files);
var formatted = format(emojis);

fs.writeFileSync(path.resolve(__dirname, './assets/emoji-fuse-list.json'), JSON.stringify(formatted), 'utf8');

console.log('Finished');

function format(emojis) {
  var result = [];
  for (var name in emojis) {
    var keywords = emojis[name];
    result.push({
      emoji: name,
      keywords: _.uniq(keywords.split(' | '))
    });
  }
  console.log(result);
  return result;
}

function merge(files) {

  var amount = files[0].length;
  var result = {};

  for (var i = 0; i < files.length; i++) {

    var list = files[i];

    for (var j = 0; j < list.length; j++) {

      var item = list[j];
      var emoji = item[0];
      var text = item[1];

      if (emoji in result) {
        result[emoji] += ' | ' + text;
      } else {
        result[emoji] = text;
      }

    }

  }

  return result;

}

function setup(files) {

  var result = [];

  for (var i = 0; i < files.length; i++) {

    var filename = files[i];
    var list = fs.readFileSync(path.resolve(__dirname, filename), {
      encoding: 'utf-8'
    });

    console.log('Setup', filename);

    list = massage(list);
    result.push(list);

  }

  return result;

}

function massage(text) {

  var result = text.split('\n');
  for (var i = 0; i < result.length; i++) {
    var line = result[i];
    var index = line.indexOf(' ');
    if (index >= 0) {
      result[i] = [
        line.slice(0, index + 1).replace(/\s/, ''),
        line.slice(index).replace(/^\s/, '')
      ];
    } else {
      result[i] = [line];
    }
  }

  return result;

}
