const restrictedSites = new Set();

chrome.storage.sync.get('blockedWebsitesArray', (data) => {
  const blockedWebsitesArray = data.blockedWebsitesArray || [];
  blockedWebsitesArray.forEach((item) => {
    const normalizedItem = item.toLowerCase();
    restrictedSites.add(normalizedItem);
    restrictedSites.add(normalizeURL(normalizedItem));
  });
  checkIfRestricted();
});

function normalizeURL(url) {
  return url.replace(/^www\./i, '');
}

function shouldBlockWebsite() {
  const currentHostname = normalizeURL(window.location.hostname);
  return restrictedSites.has(currentHostname);
}

function createBlockedPage() {
  const blockedPage = generateHTML();
  const style = generateStyling();
  const head = document.head || document.getElementsByTagName('head')[0];
  head.insertAdjacentHTML('beforeend', style);
  document.body.innerHTML = blockedPage;
}

function checkIfRestricted() {
  if (shouldBlockWebsite()) {
    createBlockedPage();
  }
}

function generateStyling() {
  return `
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #000000; /*i like black because im black on the inside*/
                font-family: 'Noto Serif', serif;
            }
            h1 {
                font-size: 3em;
                color: white;
            }
            iframe {
                margin-top: 20px;
                border: none;
            }
        </style>
    `;
}

function generateHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You need to lock in!</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Noto Serif', serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            h1 {
                font-size: 2.5em;
                margin-bottom: 30px;
            }
            .video-container {
                width: 80%;
                max-width: 800px;
            }
        </style>
    </head>
    <body>
        <h1>You need to lock in!</h1>
        <div class="video-container">
            <iframe width="100%" height="450" src="https://www.youtube.com/embed/tYzMYcUty6s?autoplay=1&si=1qbl3QbcXsVQe0kg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </body>
    </html>
  `;
}
