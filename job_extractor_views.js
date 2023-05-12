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
  
    return removeEmojis(removeQuotes(textWithTags)).replace(/\n/g, '').replace('<span>','').replace('</span>','').trim();
  }

// extraction from view version of job post
function extractViewElementDictionary(element) {
    if (!element) {
      console.error('Invalid element provided.');
      return null;
    }
  
    var innerHTML = element.innerHTML;

    console.log(innerHTML)
    var components = innerHTML.split('<strong>');
  
    // Remove empty strings and trim whitespace
    components = components.filter(component => component.trim() !== '');
  
    var dictionary = {};
  
    for (var i = 0; i < components.length; i++) {
      var component = components[i];
      var keyStartIndex = component.indexOf('<strong>') + 8;
      var keyEndIndex = component.indexOf('</strong>');
      if (keyStartIndex < 0 || keyEndIndex < 0) {
        console.warn('Invalid component format:', component);
        continue;
      }
      var key = component.substring(keyStartIndex-9, keyEndIndex).replace(/<[^>]+>/g, '').trim();
      var value = component.substring(keyEndIndex + 9).trim();
  
      if (key.length > 0) {
        key = key.replace(/<[^>]+>/g, '  ');
  
        if (value.includes('<ul>')) {
          var ulStartIndex = value.indexOf('<ul>');
          var ulEndIndex = value.indexOf('</ul>');
          if (ulStartIndex < 0 || ulEndIndex < 0) {
            console.warn('Invalid component format:', component);
            continue;
          }
          var ulContent = value.substring(ulStartIndex, ulEndIndex + 5);
          var liTags = ulContent.split('<li>');
          var sentences = liTags.map(tag => tag.replace(/<[^>]+>/g, '').trim()).filter(sentence => sentence !== '');
          value = sentences;
        } else {
          value = value.replace(/<[^>]+>/g, '').trim();
        }
  
        // Remove emojis from key and value
        key = removeEmojis(key);
        value = removeEmojis(value);
        
        dictionary[key] = value;
      }
    }
  
    return dictionary;
}

// extract job data from views version of linekdin job post
if (window.location.href.includes("linkedin.com/jobs/view/")) {
    window.onload = function() {
    var jobDetailsElement = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
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


 