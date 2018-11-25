var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var settings = {
  encoding: 'utf-8'
};

var emojis = fetch('./assets/emoji-fuse-list.json');
var translations = fetch('./assets/word-translations.json');
var errors = fetch('./assets/word-translation-errors.json');

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
      query = search(latin);
    } else {
      if (english.length <= 3) {
        console.log('Unable to assign emoji for such a small word');
        continue;
      }
      query = search(english);
    }

    if (query.length > 0) {
      emoji = query[0].emoji;
      result[latin] = emoji;
      cycle(query[0]);
      console.log('Assigned', latin, 'to', query);
    } else {
      console.log('Unable to assign', latin, 'to an emoji');
    }

  }

  return result;

}

/**
 * Many of the Emojis have similar definitions like the generic "object"
 * assignment. So if emojis have the same score the one in the list
 * will always show up first. In this case if an emoji is selected,
 * then push it back to the end of the Emojis list in order to let other
 * Emojis inhabit the text.
 */
function cycle(obj) {
  var index = obj.index;
  var item = emojis.splice(index, 1)[0];
  if (item) {
    emojis.push(item);
  }
}

function search(word) {

  var query = [];

  for (var i = 0; i < emojis.length; i++) {

    var emoji = emojis[i];
    var keywords = emoji.keywords;
    var score = compare(word, keywords);

    if (score > 0) {
      var item = _.clone(emoji);
      item.score = score;
      item.index = i;
      query.push(item);
    }

  }

  query = query.sort(function(a, b) {
    return b.score - a.score;
  });

  return query;

}

function compare(word, keywords) {

  var score = 0;
  var amount = 0;

  for (var i = 0; i < keywords.length; i++) {

    var keyword = keywords[i];

    if (keyword.length < 3) {
      continue;
    }

    var subwords = keyword.split(/\s/);

    // Only return perfect matches
    if (word === keyword) {

      score += 1;
      amount++;

    } else if (subwords.length > 1) {

      var matched = false;

      for (var j = 0; j < subwords.length; j++) {

        var subword = subwords[j];

        if (word === subword) {
          score += 0.5;
          matched = true;
        }

      }

      if (matched) {
        amount += subwords.length;
      }

    }

  }

  // "Normalize" the score
  return score / amount;

}

function fetch(filename) {
  var uri = path.resolve(__dirname, filename);
  var result = fs.readFileSync(uri, settings);
  result = JSON.parse(result);
  return result;
}
