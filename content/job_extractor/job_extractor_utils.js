// compute fraction of uppercase characters in a string
function getUppercaseFraction(inputString) {
  const totalCharacters = inputString.length;
  const uppercaseCharacters = inputString
    .split('')
    .filter(char => char === char.toUpperCase() && char !== char.toLowerCase())
    .length;

  const uppercaseFraction = uppercaseCharacters / totalCharacters;
  return uppercaseFraction;
}

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

function createDictionary(arr) {
  const dict = new Map();
  let currentKey = null;
  for (let i = 0; i < arr.length; i++) {
    var entry = arr[i];
    entry = entry.replace(/<(?!\/?strong\b)[^>]+>/g, ' ').trim();
    if (entry.match(/^<strong>.*<\/strong>$/)) {
      // This entry matches the pattern <strong>*</strong>, so it's a key
      currentKey = entry.replace(/<[^>]+>/g, '').trim();
      dict.set(currentKey, '');
    } else {
      // This entry is a value to be appended to the current key
      if (currentKey) {
        const currentValue = dict.get(currentKey);
        const modifiedValue = (currentValue + ' ' + entry.replace(/<[^>]+>/g, ' ').trim()).trim();
        if (currentValue.length === 0) {
          dict.set(currentKey, modifiedValue);
          currentKey = null; // reset current key
        }
      }
    }
  }
  return dict;
}


function processArray(array) {
  const resultMap = new Map();
  let currentKey = null;

  for (let i = 0; i < array.length; i++) {
    const element = array[i].replace(/<(?!\/?strong\b)[^>]+>/g, '').trim();

    if (element.startsWith('<strong>') && element.endsWith('</strong>')) {
      currentKey = element.substring(8, element.length - 9);
      resultMap.set(currentKey, '');
      continue;
    }

    if (element.length < 50  && trimmedEntry.length > 0) {
      const uppercaseFraction = getUppercaseFraction(element);
      if (uppercaseFraction >= 0.8) {
        currentKey = element;
        resultMap.set(currentKey, '');
        continue;
      }
    }

    if (currentKey !== null) {
      const currentValue = resultMap.get(currentKey);
      if (currentValue.length === 0) {
        const currentValue = resultMap.get(currentKey);
        const modifiedValue = (currentValue + ' ' + trimmedEntry).trim();
        resultMap.set(currentKey, modifiedValue);
        // resultMap.set(currentKey, element);
      }
    }
  }

  return resultMap;
}


function finalAttempt(arr) {
  const dict = new Map();
  let currentKey = null;

  for (let i = 0; i < arr.length; i++) {
    const entry = arr[i];

    // remove tags
    const trimmedEntry = entry.replace(/<[^>]+>/g, ' ').trim();

    if (trimmedEntry.length < 50 && trimmedEntry.length > 0) {
      currentKey = trimmedEntry;
      dict.set(currentKey, '');
    } else {
      if (currentKey !== null) {
        const currentValue = dict.get(currentKey);
        const modifiedValue = (currentValue + ' ' + trimmedEntry).trim();
        dict.set(currentKey, modifiedValue);
      }
    }
  }

  return dict;
}


// main cleaner and splitter function 
function splitStringByPattern(str) {
  // remove unnecessary characters
  str = removeQuotes(removeEmojis(str))

  // split up string based on paragrahs
  var regex = /<br>.*?<\/br>/g 
  var split_str = str.split(regex);
  split_str = split_str.filter(element => !(element.trim() === ""));
  split_str = split_str.filter(element => element.trim());

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

  // backup technique if <strong> tags are not used in description
  if (dictionary.size === 0){
    // try creating dictionary based on capital letter separators
    dictionary = processArray(new_split_str);
  }

  // final backup technique if <strong> tags are not used in description
  if (dictionary.size <= 2){
    // try creating dictionary based on capital letter separators
    dictionary = finalAttempt(new_split_str);
  }

  // console.log(dictionary);
  return dictionary
}



function storePageWords(pageWords) {
  // set the fileWords in local storage
  chrome.storage.local.set({ pageWords }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving data to local storage:', chrome.runtime.lastError);
    } else {
      console.log('Page content and words saved to local storage.');
    }
  });

  // send a message to the content script to update the underline words
  chrome.storage.local.get('pageWords', ({ pageWords }) => {
    // send a message to the content script to update the underline words
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updatePageWords', pageWords }, response => {
        console.log(response.message);
      });
    });
  });
}