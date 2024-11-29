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
      throw new Error(
        `Error with response: ${response.status} - ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Fel vid API-anrop:", error);
    throw error; // Throws along the error to deal with later
  }
}

// Fetch news from NY Times
async function fetchNews() {
  try {
    const data = await limitedRequest(
      `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`
    );
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
    console.error("Error fetching NY Times News:", error);
    showError(
      "Something went wrong while fetching the news. Please try again later."
    );
  }
}

// Fetch sports news from NY Times
async function fetchSports() {
  try {
    const data = await limitedRequest(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:("Sports") AND glocations:("SWEDEN")&page=1&api-key=${apiKey}`
    );
    const mappedData = data.response.docs.map((item) => ({
      category: "sport",
      title: item.headline.main,
      url: item.web_url,
      abstract: item.abstract,
      byline: item.byline.original,
      multimedia: item.multimedia[1],
      datum: item.pub_date,
    }));
    newsData.push(...mappedData);
  } catch (error) {
    console.error("Error fetching Sports News:", error);
    showError(
      "Something went wrong while fetching the sports news. Please try again later."
    );
  }
}

// Fetch finance news from Polygon
async function fetchFinance() {
  try {
    const data = await limitedRequest(
      `https://api.polygon.io/v2/reference/news?limit=10&apiKey=Gb0Zk23fNHM0ID44E87pSMwzyykofNwp`
    );
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
    console.error("Error fetching Finance News:", error);
    showError(
      "Something went wrong while fetching the finance news. Please try again later."
    );
  }
}

// Fetch technology news from NewsData API
async function fetchTechNews() {
  try {
    const data = await limitedRequest(
      `https://newsdata.io/api/1/latest?apikey=pub_60058e2153ce481b3839350359f8847a3946c&category=technology&language=en`
    );
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
    console.error("Error fetching Technology News:", error);
    showError(
      "Something went wrong while fetching the technology news. Please try again later."
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
    console.error("Error fetching Most Viewed Articles:", error);
    showError(
      "Something went wrong while fetching the most viewed articles. Please try again later."
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
fetchNews();
fetchSports();
fetchFinance();
fetchTechNews();
fetchMostViewed();

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
    newsList.innerHTML = "<p>Inga nyheter i kategorin.</p>";
  } else {
    listItems(filteredNewsData);
  }
}

// Search Functionality
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
  if (!articles || articles.length < 2) return;

  const article1Element = document.getElementById("article1");
  const article2Element = document.getElementById("article2");

  if (!article1Element || !article2Element) return;

  const article1 = articles[0];
  const imageUrl1 =
    article1.media && article1.media[0] && article1.media[0]["media-metadata"]
      ? article1.media[0]["media-metadata"][2].url
      : "";
  article1Element.innerHTML = `
    <h1 class="heroArticleTitle">${article1.title}</h1>
    <div class="articleContent">
      <p class="heroAbstract">${article1.abstract}</p>
      <img src="${imageUrl1}" alt="Bild av nyhet">
      <button class="buttonToArticle" onclick="window.open('${article1.url}', '_blank')">Läs Mer Här</button>
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
      <img src="${imageUrl2}" alt="Bild av nyhet">
      <button class="buttonToArticle" onclick="window.open('${article2.url}', '_blank')">Läs Mer Här</button>
    </div>
  `;
}
