function managePopupButton() {
    // get button by id
    var toggleBtn = document.getElementById('toggle-btn');
    
    // load the initial state of the button from storage
    chrome.storage.local.get('isOn', function(result) {
      // set isOn to the value from storage or false if it doesn't exist
      var isOn = result.isOn || false;

      // change the button color based on the state of isOn
      toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';

      // change the button text based on the state of isOn
      toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
      
      // add event listener to the button
      toggleBtn.addEventListener('click', function() {
        // reverse the state of isOn
        isOn = !isOn; // toggle the state of isOn

        // set command based on isOn
        var command = isOn ? 'onReplace' : 'offReplace'; // set command based on isOn
        
        // store the state of the button in storage
        chrome.storage.local.set({isOn: isOn}, function() {
          console.log('Button state saved: ' + isOn);
        });
        
        // send message to any content script listening
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {command: command});
          // change the button color based on the state of isOn
          toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';

          // change the button text based on the state of isOn
          toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
        });
      });
    });
  }