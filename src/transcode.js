(function(root) {

  var ready = false;
  var callbacks = [];
  var emojis;

  var Transcode = root.Transcode = function(domElement, callback) {

    var count = 0;
    var index = 0;
    var completed = false;

    function complete() {
      index++;
      if (!completed && index >= count) {
        callback();
        completed = true;
      }
    }

    function scrape(elem) {
      count++;
      iterate(elem.textContent, function(resp) {
        elem.previousTextContent = elem.textContent;
        elem.textContent = resp;
        complete();
      });
    }

    function inspect(elem) {

      if (elem.textContent.length > 0) {
        scrape(elem);
      } else if (elem.children.length > 0) {
        for (var i = 0; i < elem.children.length; i++) {
          var child = elem.children[i];
          inspect(child);
        }
      } else {
        scrape(elem);
      }

    }

    if (domElement && domElement.length > 0) {
      for (var i = 0; i < domElement.length; i++) {
        inspect(domElement[i]);
      }
    } else {
      inspect(domElement);
    }

  };

  Transcode.ready = function(callback) {
    if (ready) {
      callback();
      return Transcode;
    }
    callbacks.push(callback);
    return Transcode;
  };

  Transcode.fetch = function() {

    var url = '../assets/emoji-fuse-list.json';
    var r = new XMLHttpRequest();
    r.open('GET', url);

    r.onreadystatechange = function() {
      if (r.readyState === 4 && r.status === 200) {
        emojis = JSON.parse(r.responseText);
        ready = true;
        for (var i = 0; i < callbacks.length; i++) {
          callbacks[i](Transcode);
        }
        callbacks.length = 0;
      }
    };

    r.send();

    return r;

  };

  function iterate(text, callback) {

    var result = [];
    var emoji;
    var words = text.split(' ');

    function iterate(i) {

      if (i >= words.length) {
        if (callback) {
          callback(result.join(' '));
        }
        return;
      }

      var word = words[i];
      var query = null;

      if (word.replace(/\W/i, '').length > 3) {
        query = search(word);
      }

      if (query && query.length > 0) {
        emoji = query[0].emoji;
        cycle(query[0]);
        result.push(emoji);
      } else {
        result.push(word);
      }

      requestAnimationFrame(function() {
        iterate(i + 1);
      });

    }

    iterate(0);

  }

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
        var item = clone(emoji);
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

          if (subword.length >= 3) {
            if (word === subword) {
              score += 0.5;
              matched = true;
            }
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

  function clone(obj) {
    var result = {};
    for (var k in obj) {
      result[k] = obj[k];
    }
    return result;
  }

  Transcode.fetch();

})(this);
