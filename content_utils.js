
// unpack text from all children nodes
function extractTextWithTagsFromElement(element) {
  if (!element) {
    console.error('Invalid element provided.');
    return null;
  }

  var textWithTags = '';


  function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textWithTags += node.textContent.replace(/\n/g, ' ');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      textWithTags += '<' + node.tagName.toLowerCase() + '>';
      var childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        traverseNodes(childNodes[i]);
      }
      textWithTags += '</' + node.tagName.toLowerCase() + '>';
    }
  }

  traverseNodes(element);

  return textWithTags.replace(/\n/g, '').replace('<span>','').replace('</span>','').trim();
}


// remove quotes
function removeQuotes(str) {
  return str.replace(/['"]/g, '');
}  

// remove emojis from text
function removeEmojis(text) {
  var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u261D|\uD83D[\uDC4D\uDC4E\uDC4C\uDC4F\uDC46\uDC47\uDC49-\uDC4B\uDC4A\uDC48]|[\u270A-\u270D]|[\uDC00-\uDFFF]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;

  // Remove emojis from text (after converting to string)
  return text.toString().replace(emojiRegex, '').trim();
}

// create final dictionary with <strong> element as key </strong>
function createDictionary(arr) {
  const dict = {};
  let currentKey = null;
  for (let i = 0; i < arr.length; i++) {
    const entry = arr[i];
    if (entry.match(/^<strong>.*<\/strong>$/)) {
      // This entry matches the pattern <strong>*</strong>, so it's a key
      currentKey = entry.replace(/<[^>]+>/g, '').trim();
      dict[currentKey] = '';
    } else {
      // This entry is a value to be appended to the current key
      if (currentKey) {
        dict[currentKey] += entry.replace(/<[^>]+>/g, ' ').trim();
      }
    }
  }
  return dict;
}


// split on characters and keep the left part
function splitAndKeepLeftFirst(input, characters) {
  var regex = new RegExp('(.*?' + characters + ')');
  var match = input.match(regex);
  if (match) {
    var left = match[1];
    var right = input.slice(left.length);
    return [left, right];
  }
  return [input];
}

// wrapper for splitting string on <strong> tags
function splitStringByStrongTags(input) {
  if (input.startsWith('<strong>') && !input.endsWith('</strong>')) {
      return splitAndKeepLeftFirst(input, '</strong>');
  }
  return [input];
}

// main cleaner and splitter function 
function splitStringByPattern(str) {
  // remove unnecessary characters
  str = removeQuotes(removeEmojis(str))

  // split up string based on paragrahs
  var regex = /<br>.*?<\/br>/g 
  var split_str = str.split(regex);

  // remove <p> tags </p>
  for (var i = 0; i < split_str.length; i++) {
      split_str[i] = split_str[i].replace(/<p>/g, '').trim();
      split_str[i] = split_str[i].replace(/<\/p>/g, '').trim();
  }

  // remove empty strings
  split_str = split_str.filter(function (el) {
      return el != "";
  });

  // if </strong> is seen first, move </strong> to previous element
  for (var i = 1; i < split_str.length; i++) {
      if (split_str[i].startsWith('</strong>')) {
        // add </strong> to previous element
        split_str[i-1] = split_str[i-1] + '</strong>';

        // remove first instance of </strong> from current element
        split_str[i] = split_str[i].replace('</strong>', function(match) {
          return '';
        });
      }
    }

  // check each element of split_str for <strong> tags with splitStringByStrongTags
  var new_split_str = [];
  for (var i = 0; i < split_str.length; i++) {
      split = splitStringByStrongTags(split_str[i]);
      if (split.length > 1) {
          new_split_str.push(split[0]);
          new_split_str.push(split[1]);
      }
      else {
          new_split_str.push(split[0]);
      }
  }

  // cut into dictionary based on <strong>
  var dictionary =  createDictionary(new_split_str);

  // console.log(dictionary);
  return dictionary
}


