function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }
    }, 100);
  });
}

async function waitForMenuItem(text, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('div[role="menuitem"]');
      console.log("Found menu items:", elements.length); // Logs number of items found

      const element = Array.from(elements).find(el => el.textContent.trim().includes(text));
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Menu item with text "${text}" not found within ${timeout}ms`));
      }
    }, 100);
  });
}

// async function waitForMenuItem(text, timeout = 5000) {
//   return new Promise((resolve, reject) => {
//     const startTime = Date.now();
//     const interval = setInterval(() => {
//       const elements = document.querySelectorAll('div[role="menuitem"]');
//       const element = Array.from(elements).find(el => el.textContent.includes(text));
//       if (element) {
//         clearInterval(interval);
//         resolve(element);
//       } else if (Date.now() - startTime > timeout) {
//         clearInterval(interval);
//         reject(new Error(`Menu item with text "${text}" not found within ${timeout}ms`));
//       }
//     }, 100);
//   });
// }

// Listen for messages from the background script
if (typeof listenerAdded === 'undefined' || !listenerAdded) {
  listenerAdded = true;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'removeFollower') {
      removeFollower();
    }
  });
}

if (typeof moreButtonClicked === 'undefined') {
  var moreButtonClicked = false;
}
if (typeof removeFollowerButtonClicked === 'undefined') {
  var removeFollowerButtonClicked = false;
}
if (typeof confirmButtonClicked === 'undefined') {
  var confirmButtonClicked = false;
}

async function removeFollower() {
  try {
    // Click the "More" button
    console.log("Attempting to click 'More' button");

    if (!moreButtonClicked) {
      // const moreButton = await waitForElement('button[aria-label="More"][role="button"]');
      // const moreButton = await waitForElement('button[data-testid="userActions"]');
      const moreButton = await waitForElement('button[data-testid="userActions"][aria-label="More"][role="button"]');
      moreButton.click();
      console.log('Clicked More button');
      moreButtonClicked = true;
    }

    // Delay to ensure the menu has time to appear
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Looking for 'Remove this follower' menu item");


    // Use this function to test the extension without prompting unfollows
    // const turnOnRepostsButton = await waitForMenuItem('Turn on reposts');
    // turnOnRepostsButton.click();
    // console.log('Clicked Turn on reposts button');

    // Click the "Remove this follower" button
    const removeFollowerButton = await waitForMenuItem('Remove this follower', 10000); // Increased timeout
    removeFollowerButton.click();
    console.log('Clicked Remove this follower button');

    // Wait for and click the confirmation button
    const confirmButton = await waitForElement('button[data-testid="confirmationSheetConfirm"]'); // Updated selector
    confirmButton.click();
    console.log('Clicked Confirm button');

    console.log('Follower removed successfully');
  } catch (error) {
    console.error('Error removing follower:', error.message);
  } finally {
    // Close the tab after a short delay
    setTimeout(() => window.close(), 2000);
  }
}
