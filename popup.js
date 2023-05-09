
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


// document.addEventListener('DOMContentLoaded', function() {
//   var toggleBtn = document.getElementById('toggle-btn');
  
//   // load the initial state of the button from storage
//   chrome.storage.local.get('isOn', function(result) {
//     var isOn = result.isOn || false;
//     toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';
//     toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
    
//     toggleBtn.addEventListener('click', function() {
//       isOn = !isOn; // toggle the state of isOn
//       var command = isOn ? 'onReplace' : 'offReplace'; // set command based on isOn
      
//       // store the state of the button in storage
//       chrome.storage.local.set({isOn: isOn}, function() {
//         console.log('Button state saved: ' + isOn);
//       });
      
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {command: command});
//         // change the button color based on the state of isOn
//         toggleBtn.style.backgroundColor = isOn ? 'red' : 'green';
//         toggleBtn.innerText = isOn ? 'Toggle Underline (OFF)' : 'Toggle Underline (ON)';
//       });
//     });
//   });
// });