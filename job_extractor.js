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
  

// On LinkedIn job view pages
if (window.location.href.includes("linkedin.com/jobs/view/")) {
    var element = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
    if (element) {
      console.log('-------- plugin output --------');
      console.log('---- job VIEW page job description content ----');
      var dictionary = extractViewElementDictionary(element);
      console.log(dictionary);
    }
  }
  

  
  // On LinkedIn job collections pages
  if (window.location.href.includes("linkedin.com/jobs/collections/")) {

        var jobDetailsElement = document.getElementById("job-details");
        if (jobDetailsElement) {
            console.log('-------- plugin output --------');
            console.log('---- job COLLECTIONS page job description content ----');
            var spanElements = jobDetailsElement.querySelectorAll("span");
            var spanDictionary = {};
            
            Array.from(spanElements).forEach(span => {
                var strongElement = span.querySelector("strong");
                if (strongElement) {
                var key = strongElement.textContent.trim();
                var value = span.textContent.trim().substring(strongElement.textContent.length).trim();
                spanDictionary[key] = value;
                }
            });
            
            console.log(spanDictionary);
        }
        
    }
