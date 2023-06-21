

// chrome.browserAction.onClicked.addListener(function(tab) {
//   // This function will be executed when the page action icon is clicked
//   // You can perform any desired actions here
//   console.log("Extension icon clicked!");


// });



// chrome.action.onClicked.addListener(function (tab) {
//   console.log("Hello")
// });

// // reset popup on reload
// chrome.runtime.onStartup.addListener(function() {
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     // Check if the tab is a popup
//     if (tabs[0].url.endsWith('/popup.html')) {
//       chrome.storage.local.set({ toggleUnderlineButtonisOn: false }, function() {
//         console.log('Button state reset to default value');
//       });
//       chrome.tabs.reload(tabs[0].id, { bypassCache: true });
//     }
//   });
// });
