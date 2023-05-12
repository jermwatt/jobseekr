function removeQuotes(str) {
  return str.replace(/['"]/g, '');
}

// remove emojis from text
function removeEmojis(text) {
  var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u261D|\uD83D[\uDC4D\uDC4E\uDC4C\uDC4F\uDC46\uDC47\uDC49-\uDC4B\uDC4A\uDC48]|[\u270A-\u270D]|[\uDC00-\uDFFF]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;

  // Remove emojis from text (after converting to string)
  return text.toString().replace(emojiRegex, '').trim();
}

// create dictionary out of split string
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

// split up string on paragraphs
function splitStringByPattern(str) {
  // split up string based on paragrahs
  var regex = /<p>.*?<\/p>/g;
  var split_str = str.split(regex);

  // cut into dictionary based on <strong>
  var dictionary =  createDictionary(split_str);

  // console.log(dictionary);
  return dictionary
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

  return splitStringByPattern(removeEmojis(removeQuotes(textWithTags)).replace(/\n/g, '').replace('<span>','').replace('</span>','').trim());
}


// extract job data from collections version of LinkedIn job post
if (window.location.href.includes("linkedin.com/jobs/collections/")) {
  window.onload = function() {
    var jobDetailsElement = document.getElementById("job-details");
    if (jobDetailsElement) {
      var element = jobDetailsElement.querySelector("span");
      if (element) {
        // Assuming `element` is the root element of your DOM structure
        var sectionTexts = extractTextWithTagsFromElement(element);
        console.log(sectionTexts);

      }
    }
  }
}

