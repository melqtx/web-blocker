const restrictedSites = new Set();

chrome.storage.sync.get('blockedWebsitesArray', (data) => {
  const blockedWebsitesArray = data.blockedWebsitesArray || [];
  const currentTime = Date.now();

  blockedWebsitesArray.forEach((item) => {
    if (item.unblockTime > currentTime) {
      const normalizedItem = item.url.toLowerCase();
      restrictedSites.add(normalizedItem);
      restrictedSites.add(normalizeURL(normalizedItem));
    }
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
                background-color: #3b5998; /* Facebook blue */
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: white;
                text-align: center;
            }
            h1 {
                font-size: 3em;
                margin-bottom: 20px;
            }
            p {
                font-size: 1.5em;
                margin-bottom: 20px;
            }
            .quote {
                font-style: italic;
                margin-bottom: 20px;
            }
            .meme {
                max-width: 100%;
                height: auto;
                border: 2px solid white;
                border-radius: 10px;
            }
        </style>
    `;
}

function generateHTML() {
  const quotes = [
    "\"The best way to predict the future is to create it.\" - Peter Drucker",
    "\"Success is not the key to happiness. Happiness is the key to success.\" - Albert Schweitzer",
    "\"Don't watch the clock; do what it does. Keep going.\" - Sam Levenson",
    "\"The only way to do great work is to love what you do.\" - Steve Jobs",
    "\"Believe you can and you're halfway there.\" - Theodore Roosevelt"
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Site Blocked</title>
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue&display=swap" rel="stylesheet">
        <style>
            body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #3b5998; /* Facebook blue */
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: white;
                text-align: center;
            }
            h1 {
                font-size: 3em;
                margin-bottom: 20px;
            }
            p {
                font-size: 1.5em;
                margin-bottom: 20px;
            }
            .quote {
                font-style: italic;
                margin-bottom: 20px;
            }
            .meme {
                max-width: 100%;
                height: auto;
                border: 2px solid white;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <h1>This site has been blocked</h1>
        <p>Team Cicada 3301</p>
        <p class="quote">${randomQuote}</p>
        
    </body>
    </html>
  `;
}
