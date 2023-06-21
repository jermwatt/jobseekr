
function storeFile(fileWords) {
  // Set the fileWords in local storage
  chrome.storage.local.set({ fileWords }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving data to local storage:', chrome.runtime.lastError);
    } else {
      console.log('File content and words saved to local storage.');

      // Send a message to the content script to update the underline words
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateUnderlineWords', fileWords }, response => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
          } else if (response && response.message) {
            console.log(response.message);
          }
        });
      });



    }
  });
}


function manageFileUpload() {
    console.log('manageFileUpload function called')

    // get file upload button
    const fileUploadButton = document.getElementById('fileUploadButton');

    // listen for change in file upload button
    fileUploadButton.addEventListener('change', function(event) {
      // automatically reset underline word button to off when file upload button pressed
      resetToggleUnderlineButton();
      console.log('toggle button reset')

      // get file from file upload button
      const file = event.target.files[0];
      const reader = new FileReader();

      // if file exists
      if (file) {
        // File type validation
        const allowedFileTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedFileTypes.includes(file.type)) {
          console.error('Invalid file type. Only .txt, .pdf, and .docx files are allowed.');
          return;
        }

        // save name of file to state 
        chrome.storage.local.set({ resumeName: file.name }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving data to local storage:', chrome.runtime.lastError);
          } else {
            console.log('File name saved to local storage.');
          }
        });

        // Read file as text if .txt file
        if (
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // Word document
          file.type === 'application/pdf' // PDF document
          ) 
        {
            reader.onload = function(e) {
              console.log('reader.onload function called');
          
              const arrayBuffer = e.target.result;
          
              if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log('word doc file uploaded')

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
              } else if (file.type === 'application/pdf') {
                console.log('pdf doc file uploaded')

                // use pdf.js to load in pdf file
                const loadingTask = pdf.getDocument({ data: arrayBuffer });
          
                loadingTask.promise
                  .then(function(pdf) {
                    const numPages = pdf.numPages;
                    const extractedTextPromises = [];
          
                    for (let i = 1; i <= numPages; i++) {
                      extractedTextPromises.push(
                        pdf.getPage(i).then(function(page) {
                          return page.getTextContent().then(function(textContent) {
                            return textContent.items.map(function(item) {
                              return item.str;
                            }).join(' ');
                          });
                        })
                      );
                    }
          
                    return Promise.all(extractedTextPromises);
                  })
                  .then(function(pagesText) {
                    const text = pagesText.join(' '); // Concatenate text from all pages
                    const uniqueWords = getUniqueWords(text);
                    storeFile(uniqueWords);
                  })
                  .catch(function(error) {
                    console.error('Error:', error);
                  });
              }
            };
            

            console.log('reader.readAsArrayBuffer called')
            reader.readAsArrayBuffer(file);
          }
        }
      })
    }
  


