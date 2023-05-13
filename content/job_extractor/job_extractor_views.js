
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

            // cleanup dictionary
            dictionary = cleanupDict(dictionary);

            // pool keywords
            let pageWords = combineValueArrays(dictionary);

            // save pageWords to local storage
            chrome.storage.local.set({ pageWords }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving data to local storage:', chrome.runtime.lastError);
                } else {
                    console.log('pageWords saved to local storage.');
                }
               });
            }
        }
    }
}


 