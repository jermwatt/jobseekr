
// extract job data from views version of linekdin job post
if (window.location.href.includes("linkedin.com/jobs/view/")) {
    window.onload = function() {
    var jobDetailsElement = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
    if (jobDetailsElement) {
        var element = jobDetailsElement.querySelector("span");
        if (element) {
            // Assuming `element` is the root element of your DOM structure
            var sectionTexts = extractTextWithTagsFromElement(element);

            // transform into dictionary
            var dictionary = splitStringByPattern(sectionTexts);

            // select keys for keyword pooling
            // selectKeysForKeywordPooling(dictionary);

            // pool and filter keywords
            var filteredKeywords = poolKeywords(dictionary);

            console.log(filteredKeywords)

        }
    }
}
}


 