function removeEmojis(text) {
  var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\u261D|\uD83D[\uDC4D\uDC4E\uDC4C\uDC4F\uDC46\uDC47\uDC49-\uDC4B\uDC4A\uDC48]|[\u270A-\u270D]|[\uDC00-\uDFFF]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;

  // Remove emojis from text (after converting to string)
  return text.toString().replace(emojiRegex, '').trim();
}


// // extraction from collection version of job post
// function extractCollectionElementDictionary(element) {
//   if (!element || element.tagName.toLowerCase() !== 'span') {
//     console.error('Invalid element provided or element is not a <span>.');
//     return null;
//   }

//   var innerHTML = element.innerHTML;
//   var components = innerHTML.split('</strong><p>');

//   // Remove empty strings and trim whitespace
//   components = components.filter(component => component.trim() !== '');

//   var dictionary = {};

//   for (var i = 0; i < components.length; i++) {
//     var component = components[i];
//     var keyStartIndex = component.indexOf('<strong>') + 8;
//     var keyEndIndex = component.indexOf('</strong>');
//     if (keyStartIndex < 0 || keyEndIndex < 0) {
//       console.warn('Invalid component format:', component);
//       continue;
//     }
//     var key = component.substring(keyStartIndex - 9, keyEndIndex).replace(/<[^>]+>/g, '').trim();

//     var value = component.substring(keyEndIndex + 9).trim();

//     if (key.length > 0) {
//       key = key.replace(/<[^>]+>/g, '  ');

//       if (value.includes('<ul>')) {
//         var ulStartIndex = value.indexOf('<ul>');
//         var ulEndIndex = value.indexOf('</ul>');
//         if (ulStartIndex < 0 || ulEndIndex < 0) {
//           console.warn('Invalid component format:', component);
//           continue;
//         }
//         var ulContent = value.substring(ulStartIndex, ulEndIndex + 5);
//         var liTags = ulContent.split('<li>');
//         var sentences = liTags.map(tag => tag.replace(/<[^>]+>/g, '').trim()).filter(sentence => sentence !== '');
//         value = sentences;
//       } else {
//         value = value.replace(/<[^>]+>/g, '').trim();
//       }

//       // Remove emojis from key and value
//       key = removeEmojis(key);
//       value = removeEmojis(value);

//       dictionary[key] = value;
//     }
//   }

//   return dictionary;
// }

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
      textWithTags += node.outerHTML;
      var childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        traverseNodes(childNodes[i]);
      }
      textWithTags += '</' + node.tagName.toLowerCase() + '>';
    }
  }

  traverseNodes(element);

  return removeEmojis(textWithTags).replace(/\n/g, '').replace('<span>','').replace('</span>','').trim();
}






// extract job data from collections version of LinkedIn job post
if (window.location.href.includes("linkedin.com/jobs/collections/")) {
  window.onload = function() {
    var jobDetailsElement = document.getElementById("job-details");
    if (jobDetailsElement) {
      var element = jobDetailsElement.querySelector("span");
      if (element) {
        // var dictionary = extractCollectionElementDictionary(element);
        // console.log(dictionary);

        // Assuming `element` is the root element of your DOM structure
        var sectionTexts = extractTextWithTagsFromElement(element);
        console.log(sectionTexts);

        // // Print the extracted section titles and text of interest
        // sectionTexts.forEach(function(section) {
        //   console.log('Section Title:', section.sectionTitle);
        //   console.log('Text of Interest:', section.textOfInterest);
        // });


      }
    }
  }
}

