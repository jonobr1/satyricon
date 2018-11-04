(function() {

  /**
   * @author jonobr1 / http://jonobr1.com/
   */
  var root = this;

  var Latin = root.Latin = function(textContent) {

    this.order = [];

    this.dictionary = {
      noun: {},
      verb: {},
      both: {}
    };

    this.parse(textContent);

  };

  Latin.Types = {
    noun: 'noun',
    verb: 'verb',
    both: 'both'
  };

  /**
   * Reference: http://snowball.tartarus.org/otherapps/schinke/intro.html
   */
  Latin.Stem = function(word) {

    // Step 1 & 2
    var result = Latin.CondenseAlphabet(word);

    // Step 3
    result = Latin.HandleQue(result);

    if (!result.isUnique) {

      // Demonstrative Step added by jonobr1
      result = Latin.HandleDemonstrative(result.value);

      if (!result.isDemonstrative) {

        // Step 4 & 5
        result = Latin.HandleNoun(result.value);

        if (result.isNoun) {
          result = {
            type: Latin.Types.noun,
            value: word,
            stem: result.stem
          };

        } else {

          // Step 6 & 7
          result = Latin.HandleVerb(result.value);
          if (result.isVerb) {
            result = {
              type: Latin.Types.verb,
              value: word,
              stem: result.stem
            };
          } else {
            result = {
              type: Latin.Types.noun,
              value: word,
              stem: result.value
            };
          }

        }

      } else {

        result = {
          type: Latin.Types.both,
          value: word,
          stem: result.stem
        };

      }

    } else {

      // From `Latin.QueSuffixList`
      result = {
        type: Latin.Types.both,
        value: word,
        stem: result.value
      };

    }

    // Step 8
    return result;

  };

  Latin.CondenseAlphabet = function(str) {
    return str.replace(/j/ig, 'i').replace(/v/ig, 'u');
  };

  Latin.HandleQue = function(word) {

    var isQue = word.match(/que$/i);

    if (!isQue) {
      return {
        value: word
      };
    }

    if (Latin.QueSuffixList.indexOf(word) >= 0) {
      return {
        isUnique: true,
        value: word
      };
    }

    return {
      value: word.replace(/que$/, '')
    };

  };

  Latin.HandleDemonstrative = function(word) {

    var index = Latin.DemonstrativeList.indexOf(word);
    var stem;

    if (index >= 0) {
      switch (word.charAt(0)) {
        case 'h':
          stem = 'hic';
          break;
        case 'a':
          stem = 'aliqui';
          break;
        case 'q':
        case 'c':
          stem = 'qui';
          break;
        case 'i':
          switch (word.charAt(1)) {
            case 'l':
              stem = 'ille';
              break;
            case 'p':
              stem = 'ipse';
              break;
            case 's':
              stem = 'iste';
              break;
          }
          break;
      }
      return {
        isDemonstrative: true,
        value: word,
        stem: stem
      };
    }

    return {
      value: word
    };

  };

  Latin.HandleNoun = function(word) {

    var isNoun = false;
    var stem = word;

    for (var i = 0; i < Latin.NounSuffixList.length; i++) {

      var suffix = Latin.NounSuffixList[i];
      var regex = new RegExp(suffix + '$', 'i');

      if (regex.test(word)) {
        stem = word.replace(regex, '');
        isNoun = stem.length >= 1;
        break;
      }

    }

    return {
      isNoun: isNoun,
      value: word,
      stem: stem
    };

  };

  Latin.HandleVerb = function(word) {

    var isVerb = false;
    var stem = word;

    for (var i = 0; i < Latin.VerbSuffixList.length; i++) {

      var suffix = Latin.VerbSuffixList[i];
      var regex = new RegExp(suffix + '$', 'i');

      if (regex.test(word)) {

        stem = word.replace(regex, '');
        isVerb = true;

        // Step 6(b)
        stem = Latin.HandleVerbStem(stem, suffix);

        break;

      }

    }

    return {
      isVerb: isVerb,
      value: word,
      stem: stem
    };

  };

  Latin.HandleVerbStem = function(stem, suffix) {

    switch (suffix) {

      case 'iuntur':
      case 'erunt':
      case 'untur':
      case 'iunt':
      case 'unt':
        stem += 'i';
        break;

      case 'beris':
      case 'bor':
      case 'bo':
        stem += 'bi';
        break;

      case 'ero':
        stem += 'eri';
        break;

    }

    return stem;

  }

  // Latin.PronounList = [
  //   'me', 'tu', 'te', 'se', 'hic', 'hoc', 'hac', 'haec', 'hanc', 'quis',
  //   'quid', 'quod', 'aliquis', 'aliquid'
  // ];
  //
  // Latin.PrepositionList = [
  //   'in', 'non', 'ad', 'nec', 'ex', 'sed', 'hinc', 'dein', 'illinc', 'tamen',
  //   'quod', 'aliquid', 'quid', 'de', 'ac', 'sub', 'si', 'ne', 'se', 'an',
  //   'adhuc', 'deinde'
  // ];

  Latin.NounSuffixList = [
    'ibus', /*'ius',*/ 'ae', 'am', 'as', 'em', 'es', 'ia', 'is', 'nt', 'os', 'ud',
    'um', 'us', 'a', 'e', 'i', 'o', 'u'
  ];

  Latin.VerbSuffixList = [
    'iuntur', 'beris', 'erunt', 'untur', 'iunt', 'mini', 'ntur', 'stis',
    'bor', 'ero', 'mur', 'mus', 'ris', 'sti', 'tis', 'tur', 'unt', 'bo', 'ns',
    'nt', 'ri', 'm',  'r',  's', 't'
  ];

  // Base off the Declension List found here:
  // https://en.wikipedia.org/wiki/Latin_declension
  // And their Verb Conjugation counter-parts here:
  // https://en.wikipedia.org/wiki/Latin_conjugation

  Latin.QueSuffixList = [
    'a', 'ab', '',
    'atque', 'quoque', 'neque', 'itaque', 'absque', 'apsque', 'abusque',
    'adaeque', 'adusque', 'denique', 'deque', 'susque', 'oblique', 'peraeque',
    'plenisque', 'quandoque', 'quisque', 'quaeque', 'cuiusque', 'cuique',
    'quemque', 'quamque', 'quaque', 'quique', 'quorumque', 'quarumque',
    'quibusque', 'quosque', 'quasque', 'quotusquisque', 'quousque', 'ubique',
    'undique', 'usque', 'uterque', 'utique', 'utroque', 'utribique', 'torque',
    'coque', 'concoque', 'contorque', 'detorque', 'decoque', 'excoque',
    'extorque', 'obtorque', 'optorque', 'retorque', 'recoque', 'attorque',
    'incoque', 'intorque', 'praetorque'
  ];

  Latin.DemonstrativeList = [
    'hic', 'huius', 'huic', 'hunc', 'hoc', 'haec', 'hanc', 'hac', 'hi', 'horum',
    'his', 'hos', 'hae', 'harum', 'has', 'ille', 'illius', 'illi', 'illum',
    'illo', 'illa', 'illam', 'illud', 'illorum', 'illis', 'illos', 'illae',
    'illarum', 'illas', 'iste', 'isti', 'ista', 'istae', 'istum', 'istos',
    'istam', 'istas', 'istud', 'istius', 'istorum', 'istarum', 'isto', 'istis',
    'ipse', 'ipsi', 'ipsa', 'ipsae', 'ipsum', 'ipsos', 'ipsam', 'ipsas',
    'ipsius', 'ipsorum', 'ipsarum', 'ipsis', 'ipso', 'quis', 'quid', 'quem',
    'cuius', 'cui', 'quo', 'qui', 'quae', 'quod', 'quos', 'quam', 'quas',
    'quorum', 'quarum', 'quibus', 'qua', 'aliquis', 'aliquid', 'aliquem',
    'alicuius', 'alicui', 'aliquo', 'aliqui', 'aliquae', 'aliquod', 'aliquos',
    'aliquam', 'aliquas', 'aliquorum', 'aliquarum', 'aliquibus', 'aliqua'
  ];

  Latin.prototype.parse = function(textContent) {

    this.source = textContent;
    this.order.length = 0;

    var startTime = Date.now();

    var words = textContent.split(/[\s]/);

    for (var i = 0; i < words.length; i++) {

      var word = words[i].replace(/\W/g, '').toLowerCase();

      if (!word) {
        continue;
      }

      var item = Latin.Stem(word);

      if (!this.dictionary[item.type][item.stem]) {
        this.dictionary[item.type][item.stem] = [];
      }

      this.dictionary[item.type][item.stem].push(item);
      item.index = this.order.length;

      this.order.push(item);

    }

    if (window.console && window.console.log) {
      window.console.log('Latin.parse completed. Took:',
        Date.now() - startTime, 'milliseconds');
    }

    return this;

  };

})();
