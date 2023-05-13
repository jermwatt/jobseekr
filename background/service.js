// background.js

// reset popup on reload
// chrome.runtime.onStartup.addListener(function() {
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     // Check if the tab is a popup
//     if (tabs[0].url.endsWith('/popup.html')) {
//       chrome.storage.local.set({ isOn: false }, function() {
//         console.log('Button state reset to default value');
//       });
//       chrome.tabs.reload(tabs[0].id, { bypassCache: true });
//     }
//   });
// });
