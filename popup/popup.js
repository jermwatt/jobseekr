
document.addEventListener('DOMContentLoaded', function() {
  var popupBody = document.getElementById('popup-body');

  // Attach a click event listener to the popup element
  popupBody.addEventListener('click', function() {
    console.log('Popup clicked!');
  });
});



// instantiate / change the state of popup.html
document.addEventListener('DOMContentLoaded', function() {




  // activate popup functionality
  managePopupButton();
  manageFileUpload();
  manageFileContent();

  // load the state of the button from storage
  chrome.storage.local.get('toggleUnderlineButtonisOn', function(result) {
    // set toggleUnderlineButtonisOn to the value from storage or false if it doesn't exist 
    var toggleUnderlineButtonisOn = result.toggleUnderlineButtonisOn || true;

    // get button by id
    var toggleUnderlineButton = document.getElementById('toggleUnderlineButton');

    // call function to manage button effects
    // manageToggleUnderlineButtonEffects(toggleUnderlineButton, toggleUnderlineButtonisOn);
  }
  );
     
});


