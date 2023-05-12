
// extract job data from collections version of LinkedIn job post
if (window.location.href.includes("linkedin.com/jobs/collections/")) {
  window.onload = function() {
    var jobDetailsElement = document.getElementById("job-details");
    if (jobDetailsElement) {
      var element = jobDetailsElement.querySelector("span");
      if (element) {
            // Assuming `element` is the root element of your DOM structure
            var sectionTexts = extractTextWithTagsFromElement(element);

            // transform into dictionary
            var dictionary = splitStringByPattern(sectionTexts);
            console.log(dictionary);
      }
    }
  }
}

