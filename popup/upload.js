
function manageFileUpload() {
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

      // File size validation
      const reader = new FileReader();

      // Error handling
      reader.onerror = error => {
        console.error('Error reading file:', error);
      };

      // File content processing
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
  }