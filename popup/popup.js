window.onload = function() {
  updateBlockedWebsitesSection();
  document.getElementById('blockButton').onclick = handleBlockButtonClick;
};

function handleBlockButtonClick() {
  const websiteInput = document.getElementById('websiteInput').value;
  const timerInput = document.getElementById('timerInput').value;

  if (!websiteInput) {
    alert('Error: please enter a website URL');
    return;
  }

  if (!timerInput || isNaN(timerInput) || timerInput <= 0) {
    alert('Error: please enter a valid time in minutes');
    return;
  }

  const timerInMilliseconds = timerInput * 60 * 1000;

  chrome.storage.sync.get('blockedWebsitesArray', function(data) {
    const blockedWebsitesArray = data.blockedWebsitesArray || [];
    if (blockedWebsitesArray.some(item => item.url === websiteInput)) {
      alert('Error: URL is already blocked');
    } else {
      const blockEntry = {
        url: websiteInput,
        unblockTime: Date.now() + timerInMilliseconds
      };
      blockedWebsitesArray.push(blockEntry);
      chrome.storage.sync.set({blockedWebsitesArray}, function() {
        updateBlockedWebsitesSection();
        document.getElementById('websiteInput').value = '';
        document.getElementById('timerInput').value = '';
        document.getElementById('websiteInput').focus();
      });
    }
  });
}

function updateBlockedWebsitesSection() {
  const blockedWebsitesDiv = document.getElementById('blockedWebsitesDiv');
  blockedWebsitesDiv.innerHTML = '';

  chrome.storage.sync.get('blockedWebsitesArray', function(data) {
    const blockedWebsitesArray = data.blockedWebsitesArray || [];
    const currentTime = Date.now();

    const updatedBlockedWebsitesArray = blockedWebsitesArray.filter(item => {
      if (item.unblockTime > currentTime) {
        return true;
      } else {
        return false;
      }
    });

    chrome.storage.sync.set(
        {blockedWebsitesArray: updatedBlockedWebsitesArray}, function() {
          if (updatedBlockedWebsitesArray.length > 0) {
            updatedBlockedWebsitesArray.forEach((item, index) => {
              const websiteDiv = document.createElement('div');
              websiteDiv.classList.add('websiteDiv');

              const websiteDivText = document.createElement('div');
              websiteDivText.classList.add('websiteDivText');
              websiteDivText.textContent = item.url;
              websiteDiv.appendChild(websiteDivText);

              const deleteButton = document.createElement('button');
              deleteButton.classList.add('delete');
              deleteButton.setAttribute('data-index', index);
              deleteButton.disabled = true;

              const trashIcon = document.createElement('i');
              trashIcon.classList.add('fas', 'fa-trash');
              deleteButton.appendChild(trashIcon);

              websiteDiv.appendChild(deleteButton);

              blockedWebsitesDiv.appendChild(websiteDiv);
            });
          } else {
            const nothingBlocked = document.createElement('div');
            nothingBlocked.textContent = 'No websites have been blocked';
            nothingBlocked.classList.add('nothingBlocked');
            blockedWebsitesDiv.appendChild(nothingBlocked);
          }
        });
  });
}