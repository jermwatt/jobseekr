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
      console.log(key)

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
  
        dictionary[key] = value;
      }
    }
  
    return dictionary;
}



function test(element) {
    if (!element || element.tagName.toLowerCase() !== 'span') {
      console.error('Invalid element provided or element is not a <span>.');
      return null;
    }
  
    var elements = Array.from(element.querySelectorAll('*'));
    console.log(elements)
  
    var extractedValues = [];
  
    elements.forEach(el => {
      var value = el.textContent.trim();
      if (value.length > 0) {
        extractedValues.push(value);
      }
    });
  
    return extractedValues;
  }
  
  
  
  
  
  

// On LinkedIn job view pages
if (window.location.href.includes("linkedin.com/jobs/view/")) {
    window.onload = function() {
    var element = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
    if (element) {
      console.log('-------- plugin output --------');
      console.log('---- job VIEW page job description content ----');
      var dictionary = extractViewElementDictionary(element);
      console.log(dictionary);
    }
  }
}
  

  
  // On LinkedIn job collections pages
  if (window.location.href.includes("linkedin.com/jobs/collections/")) {
    window.onload = function()  {
        var jobDetailsElement = document.getElementById("job-details");
        console.log(jobDetailsElement)
        if (jobDetailsElement) {
        var spanElement = jobDetailsElement.querySelector("span");
        console.log(spanElement)
        if (spanElement) {
            var pElements = spanElement.querySelectorAll("p");
            var strongElements = spanElement.querySelectorAll("strong");
            
            console.log("Paragraphs:");
            console.log(pElements);
            
            console.log("Strong elements:");
            console.log(strongElements);

            console.log('test')
            console.log(test(spanElement))
            }
        }
    }
  }
