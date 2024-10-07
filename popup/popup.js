

window.onload = function() {
  updateBlockedWebsitesSection();
  document.getElementById('blockButton').onclick = handleBlockButtonClick;
};

function handleBlockButtonClick() {
  const websiteInput = document.getElementById('websiteInput').value;
  if (!websiteInput) {
    alert('Error: please enter a website URL');
    return;
  }

  chrome.storage.sync.get('blockedWebsitesArray', function(data) {
    const blockedWebsitesArray = data.blockedWebsitesArray || [];
    if (blockedWebsitesArray.includes(websiteInput)) {
      alert('Error: URL is already blocked');
    } else {
      blockedWebsitesArray.push(websiteInput);
      chrome.storage.sync.set({blockedWebsitesArray}, function() {
        updateBlockedWebsitesSection();
        document.getElementById('websiteInput').value = '';
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
    if (blockedWebsitesArray.length > 0) {
      blockedWebsitesArray.forEach((website, index) => {
        const websiteDiv = document.createElement('div');
        websiteDiv.classList.add('websiteDiv');

        const websiteDivText = document.createElement('div');
        websiteDivText.classList.add('websiteDivText');
        websiteDivText.textContent = website;
        websiteDiv.appendChild(websiteDivText);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.setAttribute('data-index', index);

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');
        deleteButton.appendChild(trashIcon);

        deleteButton.addEventListener('click', unblockURL);
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
}

function unblockURL(event) {
  const index = event.currentTarget.getAttribute('data-index');
  chrome.storage.sync.get('blockedWebsitesArray', function(data) {
    const blockedWebsitesArray = data.blockedWebsitesArray || [];
    blockedWebsitesArray.splice(index, 1);
    chrome.storage.sync.set(
        {blockedWebsitesArray}, updateBlockedWebsitesSection);
  });
}
