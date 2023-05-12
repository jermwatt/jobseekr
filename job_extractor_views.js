function removeEmojis(text) {
    var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u261D|\uD83D[\uDC4D\uDC4E\uDC4C\uDC4F\uDC46\uDC47\uDC49-\uDC4B\uDC4A\uDC48]|[\u270A-\u270D]|[\uDC00-\uDFFF]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;
  
    // Remove emojis from text (after converting to string)
    return text.toString().replace(emojiRegex, '').trim();
  }

// extraction from view version of job post
function extractViewElementDictionary(element) {
    if (!element) {
      console.error('Invalid element provided.');
      return null;
    }
  
    var innerHTML = element.innerHTML;
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
    var element = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
    if (element) {
    var dictionary = extractViewElementDictionary(element);
    console.log(dictionary);
    }
}
}


 