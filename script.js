let newsData = [];
const apiKey = "kzvccXW2l1EAE3toa0N5GFkWFozAqtqv";

// Limit to API requests
let lastRequestTime = 0; // Time for last API request
const requestDelay = 1000; // Delay between requests by 1 second
const maxRequestsPerMinute = 60; // Max number of requests per minute
let requestCount = 0; // Counting numbers of requests witing a minute

// Function for error messages shown in a module
function showError(message) {
  const errorModal = document.getElementById("errorModal");
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = message;
  errorModal.style.display = "block"; // Shows the module on the site
}

// Function to close the module
function closeModal() {
  const errorModal = document.getElementById("errorModal");
  errorModal.style.display = "none"; // Hides the module
}

// If user clicks on x the module closes
document.getElementById("closeModal").addEventListener("click", closeModal);

// Click outside of the module and it will close
window.addEventListener("click", function (event) {
  const errorModal = document.getElementById("errorModal");
  if (event.target === errorModal) {
    errorModal.style.display = "none";
  }
});

// Function to limit numbers of requests
async function limitedRequest(url) {
  const now = Date.now();
  const timeElapsed = now - lastRequestTime;

  // If there hasn't been enough time since the last request
  if (timeElapsed < requestDelay) {
    const delayTime = requestDelay - timeElapsed;
    console.log(`Väntar ${delayTime} ms innan nästa förfrågan...`);
    await new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  // If resquests have gone over the limit per minute, it will wait a minute
  if (requestCount >= maxRequestsPerMinute) {
    const timeToNextMinute = 60000 - (timeElapsed % 60000); // Wait until the next minute
    console.log(
      `För många förfrågningar på kort tid. Väntar i ${
        timeToNextMinute / 1000
      } sekunder...`
    );
    showError(
      `Vi har tillfälligt nått gränsen för antal förfrågningar. Försök igen om en stund`
    );
    await new Promise((resolve) => setTimeout(resolve, timeToNextMinute));
    requestCount = 0; // Restarts the counter when a new minute begins
  }

  // Uppdates last requests time and add on the counter
  lastRequestTime = Date.now();
  requestCount++;

  // Calls the API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Resursen kunde inte hittas (404).");
      } else if (response.status === 500) {
        throw new Error("Serverfel (500). Försök igen senare.");
      } else {
        throw new Error(
          `Error med response: ${response.status} - ${response.statusText}`
        );
      }
    }
    return await response.json();
  } catch (error) {
    console.error("Fel vid API-anrop:", error.message);
    throw new Error(
      "Nätverksfel eller API-problem. Kontrollera din internetanslutning."
    );
  }
}

// Fetch news from NY Times
async function fetchNews() {
  try {
    const data = await limitedRequest(
      `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`
    );
    if (!data || !data.results || data.results.length === 0) {
      throw new Error("API:n returnerade inga nyheter");
    }

    const mappedData = data.results.map((item) => ({
      category: "Top news",
      title: item.title,
      url: item.url,
      abstract: item.abstract,
      byline: item.byline,
      multimedia: item.multimedia[1],
      datum: item.updated_date,
    }));

    newsData.push(...mappedData);
    listItems(); // Call listItems to display data
  } catch (error) {
    console.error("Fel vid hämtningen av NY Times News:", error);
    showError(
      "Något gick fel med hämtningen av nyheterna från Ny Times. Försök igen senare."
    );
  }
}

// Fetch sports news from NY Times

async function fetchSports() {
  try {
    const data = await limitedRequest(
      `https://newsapi.org/v2/top-headlines?country=us&category=sport&apiKey=71612dda2b2c4b17b083e96712ba8964`
    );
    console.log(data);

    if (
      !data ||
      !data.articles ||
      !Array.isArray(data.articles) ||
      data.articles.length === 0
    ) {
      throw new Error("API:n returnerade inga sport nyheter.");
    }

    const mappedData = data.articles.map((item) => ({
      category: "sport",
      title: item.title,
      url: item.url,
      abstract: item.description,
      byline: item.author,
      multimedia: item.urlToImage ? { url: item.urlToImage } : null,
      datum: item.publishedAt,
    }));
    newsData.push(...mappedData);

    console.log(data);
  } catch (error) {
    console.error("Fel vid hämtningen av sport nyheterna:", error);
    showError(
      "Något gick fel med hämtningen av sport nyheterna. Försök igen senare."
    );
  }
}

console.log(newsData);
// Fetch finance news from Polygon
async function fetchFinance() {
  try {
    const data = await limitedRequest(
      `https://api.polygon.io/v2/reference/news?limit=10&apiKey=Gb0Zk23fNHM0ID44E87pSMwzyykofNwp`
    );
    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error("API:n returnerade inga ekonomi nyheter.");
    }

    const mappedData = data.results.map((item) => ({
      category: "Finance",
      title: item.title,
      url: item.article_url,
      abstract: item.description,
      byline: item.author,
      multimedia: item.image_url ? { url: item.image_url } : null,
      datum: item.published_utc,
    }));
    newsData.push(...mappedData);
  } catch (error) {
    console.error("Fel vid hämtningen av Ekonomi nyheterna:", error);
    showError(
      "Något gick fel med hämtningen av Ekonomi nyheterna. Försök igen senare."
    );
  }
}

// Fetch technology news from NewsData API
async function fetchTechNews() {
  try {
    const data = await limitedRequest(
      `https://newsdata.io/api/1/latest?apikey=pub_60058e2153ce481b3839350359f8847a3946c&category=technology&language=en`
    );
    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error("API:n returnerade inga teknik nyheter.");
    }

    const mappedData = data.results.map((item) => ({
      category: "technology",
      title: item.title,
      url: item.link,
      byline: item.source_name,
      abstract: item.description,
      multimedia: item.image_url,
      datum: item.pubDate,
    }));
    newsData.push(...mappedData);
    listItems();
  } catch (error) {
    console.error("Fel vid hämtningen av Teknik nyheterna:", error);
    showError(
      "Något gick fel med hämtningen av Teknik nyheterna. Försök igen senare."
    );
  }
}

// Fetch most viewed articles from NY Times
async function fetchMostViewed() {
  try {
    const data = await limitedRequest(
      `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=kzvccXW2l1EAE3toa0N5GFkWFozAqtqv`
    );
    heroLayout(data.results);
  } catch (error) {
    console.error("Error med hämtningen av mest lästa artiklarna:", error);
    showError(
      "Något gick fel med hämtningen av de mest lästa artiklarna. Försök igen senare."
    );
  }
}

// Function to display the list of news items
function listItems(items = newsData) {
  const getTheUl = document.getElementsByClassName("newsList");
  items.forEach((createList) => {
    const listItemsForPage = document.createElement("li");
    if (createList.multimedia && createList.multimedia.url) {
      if (createList.multimedia.url.startsWith("images/")) {
        createList.multimedia.url =
          "https://nyt.com/" + createList.multimedia.url;
      }
      listItemsForPage.innerHTML = `
        <h3>${createList.title}</h3>
        <img src="${createList.multimedia.url}" alt="pic of news">
        <p>${createList.abstract}</p>
        <p class="authors">${createList.byline}</p>
        <button class="buttonToArticle" onclick="window.open('${createList.url}', '_blank')">Läs Mer Här</button>
        <p class="authors">${createList.datum}</p>
      `;
    } else {
      listItemsForPage.innerHTML = `
        <h3>${createList.title}</h3>
        <p>${createList.abstract}</p>
        <p class="authors">${createList.byline}</p>
        <button class="buttonToArticle" onclick="window.open('${createList.url}', '_blank')">Läs Mer Här</button>
        <p class="authors">${createList.datum}</p>
      `;
    }
    getTheUl[0].appendChild(listItemsForPage);
  });
}

// Call functions to fetch data
async function fetchAllNews() {
  try {
    await Promise.all([
      fetchNews(),
      fetchSports(),
      fetchFinance(),
      fetchTechNews(),
      fetchMostViewed(),
    ]);
    console.log("Alla nyheter har hämtats utan problem!");
  } catch (error) {
    console.error("Fel vid hämtningen av alla nyheter: ", error);
    showError(
      "Ett fel uppstod vid hämtningen av nyheterna. Försök igen senare."
    );
  }
}

// Category Filter
const categorySelect = document.querySelector("#categoryFilter");
categorySelect.addEventListener("change", filterByCategory);

function filterByCategory(event) {
  let filteredNewsData = [];
  if (categorySelect.value === "all") {
    filteredNewsData = newsData;
  } else {
    filteredNewsData = newsData.filter(
      (item) => item.category === categorySelect.value
    );
  }

  const newsList = document.querySelector(".newsList");
  Array.from(newsList.children).forEach((child) => newsList.removeChild(child));

  if (filteredNewsData.length === 0) {
    newsList.innerHTML = "<p>Inga nyheter hittades för denna kategori.</p>";
  } else {
    listItems(filteredNewsData);
  }
}

// Search Functionality
const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", search);

async function search(event) {
  event.preventDefault();

  const searchTextInput = document.querySelector("#search");
  let searchText = searchTextInput.value.trim().toLowerCase();

  // Filters news from newsData array based on the searched text
  let filteredNewsData = newsData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchText) ||
      item.abstract.toLowerCase().includes(searchText) ||
      (item.byline && item.byline.toLowerCase().includes(searchText))
    );
  });

  const newsList = document.querySelector(".newsList");

  // Clears latest results from the list
  Array.from(newsList.children).forEach((child) => newsList.removeChild(child));

  if (filteredNewsData.length === 0) {
    newsList.innerHTML = "<p>Inga sökresultat.</p>";
  } else {
    listItems(filteredNewsData);
  }
}

// Hero Layout for most popular articles
function heroLayout(articles) {
  try {
    if (!articles || articles.length < 2) {
      throw new Error("Otillräckliga artiklar för hero-layout.");
    }

    const article1Element = document.getElementById("article1");
    const article2Element = document.getElementById("article2");

    if (!article1Element || !article2Element) {
      throw new Error("Hero-element hittades inte på sidan.");
    }

    const article1 = articles[0];
    const imageUrl1 =
      article1.media && article1.media[0] && article1.media[0]["media-metadata"]
        ? article1.media[0]["media-metadata"][2].url
        : "";

    article1Element.innerHTML = `
    <h1 class="heroArticleTitle">${article1.title}</h1>
    <div class="articleContent">
    <p class="heroAbstract">${article1.abstract}</p>
    ${imageUrl1 ? `<img src="${imageUrl1}" alt="Bild av nyhet">` : ""}
    <button class="buttonToArticle" onclick="window.open('${
      article1.url
    }', '_blank')">Läs Mer Här</button>
    </div>
    `;

    const article2 = articles[1];
    const imageUrl2 =
      article2.media && article2.media[0] && article2.media[0]["media-metadata"]
        ? article2.media[0]["media-metadata"][2].url
        : "";

    article2Element.innerHTML = `
    <h1 class="heroArticleTitle">${article2.title}</h1>
    <div class="articleContent">
    <p class="heroAbstract">${article2.abstract}</p>
    ${imageUrl2 ? `<img src="${imageUrl2}" alt="Bild av nyhet">` : ""}
    <button class="buttonToArticle" onclick="window.open('${
      article2.url
    }', '_blank')">Läs Mer Här</button>
    </div>
    `;
  } catch (error) {
    console.error("Fel vid visning av hero-layout: ", error);
    showError("Kunde inte visa populära artiklar. Försök igen senare.");
  }
}

// Fetching all news and real-time updates with setInterval - 5 min
fetchAllNews();
setInterval(fetchAllNews, 300000);
