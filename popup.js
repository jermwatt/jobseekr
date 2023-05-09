document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.getElementById('toggle-btn');
    var isOn = false;
    
    toggleBtn.addEventListener('click', function() {
      isOn = !isOn; // toggle the state of isOn
      var command = isOn ? 'onReplace' : 'offReplace'; // set command based on isOn
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: command});
        // change the button color based on the state of isOn
        toggleBtn.style.backgroundColor = isOn ? 'green' : 'red';
      });
    });
  });