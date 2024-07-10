document.addEventListener('DOMContentLoaded', function() {
  const removeFollowersButton = document.getElementById('removeFollowers');
  if (removeFollowersButton) {
    removeFollowersButton.addEventListener('click', function() {
      let usernames = document.getElementById('usernames').value.split('\n');
      usernames.forEach(username => {
        chrome.tabs.create({ url: `https://twitter.com/${username}`, active: false }, function(tab) {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete' && !tab.scriptInjected) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              }, () => {
                // Right here, after confirming the script has been injected
                if (chrome.runtime.lastError) {
                  tab.scriptInjected = true;
                  console.error(`Script injection failed: ${chrome.runtime.lastError.message}`);
                } else {
                  chrome.tabs.sendMessage(tab.id, { action: 'removeFollower' });
                }
              });
              chrome.tabs.onUpdated.removeListener(listener); // Remove listener once injected
            }
          });
        });
      });
    });
  }
});
