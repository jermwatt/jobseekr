
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
      const fileContent = event.target.result;
      const words = fileContent.split(/\s+/);

      // Error handling
      chrome.storage.local.set({ fileContent, words }, () => {
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
    // retrieve the stored words from local storage
    chrome.storage.local.get('words', ({ words }) => {
      if (!words) {
        console.error('Error retrieving words from local storage');
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { words }, response => {
          console.log(response);
        });
      });
    });
  });


});


// // function to log the saved file content to the console
// document.addEventListener('DOMContentLoaded', () => {
//   const logContentButton = document.getElementById('logContentButton');
//   logContentButton.addEventListener('click', () => {
//     chrome.storage.local.get(['fileContent', 'words'], result => {
//       const fileContent = result.fileContent;
//       const words = result.words;
//       console.log('File content:', fileContent);
//       console.log('Words:', words);
//     });    
//   });
// });
