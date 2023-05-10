const stopWords = [
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
];

function stripPunctuation(words) {
  const regex = /[^\w\s]|_/g; // matches all punctuation characters
  return words.map(word => word.replace(regex, ''));
}

function processFileContent(fileContent) {
      // create an array of words from the file content
      const words = fileContent.split(/\s+/);

      // remove punctuation from words
      const strippedWords = stripPunctuation(words);

      // remove duplicate words
      const uniqueWords = [...new Set(strippedWords)];

      // filter out stop words
      const filteredWords = uniqueWords.filter(word => !stopWords.includes(word));

      return filteredWords;
}

document.addEventListener('DOMContentLoaded', function() {
  var toggleBtn = document.getElementById('toggle-btn');
  
  // load the initial state of the button from storage
  chrome.storage.local.get('isOn', function(result) {
    var isOn = result.isOn || false;
    toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';
    toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
    
    toggleBtn.addEventListener('click', function() {
      isOn = !isOn; // toggle the state of isOn
      var command = isOn ? 'onReplace' : 'offReplace'; // set command based on isOn
      
      // store the state of the button in storage
      chrome.storage.local.set({isOn: isOn}, function() {
        console.log('Button state saved: ' + isOn);
      });
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: command});
        // change the button color based on the state of isOn
        toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';
        toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
      });
    });
  });
});

// event listener for storing user uploaded file
document.addEventListener('DOMContentLoaded', () => {
  
  // event listener for storing user uploaded file
  const fileInput = document.getElementById('fileInput');

  // event listener for storing file content and words in local storage
  fileInput.addEventListener('change', event => {
    const file = event.target.files[0];

    // File type validation
    const allowedFileTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedFileTypes.includes(file.type)) {
      console.error('Invalid file type. Only .txt, .pdf, and .docx files are allowed.');
      return;
    }

    const reader = new FileReader();

    // Error handling
    reader.onerror = error => {
      console.error('Error reading file:', error);
    };

    reader.onload = event => {
      // file content is a string
      const fileContent = event.target.result;

      // filter out stop words
      const filteredWords = processFileContent(fileContent);

      // Error handling
      chrome.storage.local.set({ fileContent, filteredWords }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving data to local storage:', chrome.runtime.lastError);
        } else {
          console.log('File content and words saved to local storage.');
        }
      });
    };
    reader.readAsText(file);
  });

  // event listener for sending words to content script
  const sendWordsButton = document.getElementById('sendWords');

  // event listener for sending words to content script
  sendWordsButton.addEventListener('click', () => {
    // get the filtered words from local storage
    chrome.storage.local.get('filteredWords', ({ filteredWords }) => {
      // send a message to the content script to update the underline words
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateUnderlineWords', filteredWords }, response => {
          console.log(response.message);
        });
      });
    });
  });
});

