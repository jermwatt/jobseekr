
function manageToggleUnderlineButtonEffects(toggleUnderlineButton, toggleUnderlineButtonisOn) {
      // change the button color based on the state of toggleUnderlineButtonisOn
      toggleUnderlineButton.style.backgroundColor = toggleUnderlineButtonisOn ? 'red' : 'green';

      // change the button text based on the state of toggleUnderlineButtonisOn
      toggleUnderlineButton.innerText = toggleUnderlineButtonisOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
      
      // set command based on toggleUnderlineButtonisOn
      var command = toggleUnderlineButtonisOn ? 'onReplace' : 'offReplace'; // set command based on isOn

      // store the state of the button in storage
      chrome.storage.local.set({toggleUnderlineButtonisOn: toggleUnderlineButtonisOn}, function() {
        console.log('Button state saved: ' + toggleUnderlineButtonisOn);
      });
      
      // send message to any content script listening
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: command});
        // change the button color based on the state of toggleUnderlineButtonisOn
        toggleUnderlineButton.style.backgroundColor = toggleUnderlineButtonisOn ? 'red' : 'green';

        // change the button text based on the state of toggleUnderlineButtonisOn
        toggleUnderlineButton.innerText = toggleUnderlineButtonisOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
      });
}


function resetToggleUnderlineButton() {
    // get button by id
    var toggleUnderlineButton = document.getElementById('toggleUnderlineButton');

    // set toggleUnderlineButtonisOn to false
    var toggleUnderlineButtonisOn = false;
     
    // call function to manage button effects
    manageToggleUnderlineButtonEffects(toggleUnderlineButton, toggleUnderlineButtonisOn);

    // store the state of the button in storage
    chrome.storage.local.set({toggleUnderlineButtonisOn: toggleUnderlineButtonisOn}, function() {
      console.log('Button state saved: ' + toggleUnderlineButtonisOn);
    });
}


function managePopupButton() {
    // get button by id
    var toggleUnderlineButton = document.getElementById('toggleUnderlineButton');

    // get toggleUnderlineButtonisOn value from storage
    chrome.storage.local.get('toggleUnderlineButtonisOn', function(result) {
      // set toggleUnderlineButtonisOn to the value from storage or false if it doesn't exist 
      var toggleUnderlineButtonisOn = result.toggleUnderlineButtonisOn || false;

      // add event listener to the button
      toggleUnderlineButton.addEventListener('click', function() {
        // reverse the state of toggleUnderlineButtonisOn
        toggleUnderlineButtonisOn = !toggleUnderlineButtonisOn; // toggle the state of isOn

        // call function to manage button effects
        manageToggleUnderlineButtonEffects(toggleUnderlineButton, toggleUnderlineButtonisOn);
      });
    });
  }