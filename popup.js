document.getElementById('removeFollowers').addEventListener('click', function() {
  let usernames = document.getElementById('usernames').value.split('\n');
  usernames.forEach(username => {
    chrome.tabs.create({ url: `https://twitter.com/${username}`, active: false }, function(tab) {
      // Using chrome.scripting API for Manifest V3
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
  });
});
