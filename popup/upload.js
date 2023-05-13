
function storeFile(fileWords) {
    // set the fileWords in local storage
    chrome.storage.local.set({ fileWords }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving data to local storage:', chrome.runtime.lastError);
    } else {
      console.log('File content and words saved to local storage.');
    }
  });

  // send a message to the content script to update the underline words
  chrome.storage.local.get('fileWords', ({ fileWords }) => {
    // send a message to the content script to update the underline words
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateUnderlineWords', fileWords }, response => {
        console.log(response.message);
      });
    });
  });
}

function getUniqueWords(text) {
  function cleanText(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    const webAddressRegex = /\b(?:https?:\/\/|www\.)\S+\b/g;
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{2,4}\b/g;
    const cleanText = text.replace(emailRegex, '').replace(webAddressRegex, '').replace(dateRegex, '').replace('.','');      
    const lowerText = cleanText.toLowerCase().match(/\b\w+\b/g);
    return lowerText;
  }

  // Remove dates in the format DD/MM/YYYY or DD-MM-YYYY
  text = cleanText(text);

  // Remove punctuation from text
  let uniqueWords = [...new Set(text)];

  // Remove number elements from the word list
  uniqueWords = uniqueWords.filter(word => isNaN(word));
  return uniqueWords
}


function manageFileUpload() {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file) {

      // File type validation
      const allowedFileTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedFileTypes.includes(file.type)) {
        console.error('Invalid file type. Only .txt, .pdf, and .docx files are allowed.');
        return;
      }

        if (file.type ==  'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            reader.onload = function(e) {
              const arrayBuffer = e.target.result;

              // Use Mammoth to extract raw text from the DOCX file
              mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                  const text = result.value; // Extracted raw text
                  const uniqueWords = getUniqueWords(text);
                  storeFile(uniqueWords);
                })
                .catch(function(error) {
                  console.error('Error:', error);
                });
            };

            reader.readAsArrayBuffer(file);
          }
        }
      })
    }
  


