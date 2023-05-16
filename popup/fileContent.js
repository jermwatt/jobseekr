function manageFileContent() {
  // event listener for sending words to content script
  const sendWordsButton = document.getElementById('sendWords');

  // event listener for sending words to content script
  sendWordsButton.addEventListener('click', () => {
    // get the filtered words from local storage
    chrome.storage.local.get('filteredWords', ({ filteredWords }) => {
      // send a message to the content script to update the underline words
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateUnderlineWords', filteredWords }, response => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
          } else if (response && response.message) {
            console.log(response.message);
          }
        });
      });
    });
  });
}
