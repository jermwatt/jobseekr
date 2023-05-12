

let words_to_underline = ['test', 'name', 'jeremy', 'machine', 'learning', 'engineer', 'published', 'textbook', 'university', 'press']
let regex = createRegexFromArray(words_to_underline);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // main switch for underlining / removing underlines
    if (window.location.href.includes("linkedin.com/jobs/collections/")) {
        const targetElement = document.getElementById("job-details");
        if (targetElement) {
            underlineSwitch(message, targetElement, sendResponse);
        }
    }

    // extract job data from views version of linekdin job post
    if (window.location.href.includes("linkedin.com/jobs/view/")) {
        var targetElement = document.querySelector('article.jobs-description__container.jobs-description__container--condensed');
        if (targetElement) {
            underlineSwitch(message, targetElement, sendResponse);
            }
    }

});
  