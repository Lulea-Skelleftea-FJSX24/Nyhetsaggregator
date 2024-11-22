let newsData = [];

// console.log("Hello News!");
const apiKey = "kzvccXW2l1EAE3toa0N5GFkWFozAqtqv";
fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    // console.log(data);
    const mappedData = data.results.map((item) => ({
      category: "Top news",
      title: item.title, // Title
      url: item.url, // url for site
      abstract: item.abstract, // Text to put in p
      byline: item.byline, // Authors
      multimedia: item.multimedia[1],
      datum: item.updated_date, // Jpeg
    }));
    // Push the mapped data into the global newsData array
    newsData.push(...mappedData);
    // listItems();
  })
  .catch((error) => {
    console.log(error);
  });

console.log("Newsdata array", newsData);
// getElementByClassName("newsList") = UL!

function listItems(items = newsData) {
  // const listItems = document.createElement("li");
  const getTheUl = document.getElementsByClassName("newsList");
  items.forEach((createList) => {
    const listItemsForPage = document.createElement("li");
    if (createList.multimedia && createList.multimedia.url) {
      if (createList.multimedia.url.startsWith("images/")) {
        createList.multimedia.url =
          "https://nyt.com/" + createList.multimedia.url;
      }
      console.log(createList.multimedia);
      listItemsForPage.innerHTML = `<h3>${createList.title}</h3>
                            <img src="${createList.multimedia.url}" alt="pic of news">
                            <p>${createList.abstract}</p>
                            <p class="authors">${createList.byline}</p>
                            <a target="_blank" href="${createList.url}">Läs Mer Här</a>
                            <p class="authors">${createList.datum}</p>
      `;
    } else {
      listItemsForPage.innerHTML = `<h3>${createList.title}</h3>
                            <p>${createList.abstract}</p>
                            <p class="authors">${createList.byline}</p>
                            <a target="_blank" href="${createList.url}">Läs Mer Här</a>
                            <p class="authors">${createList.datum}</p>
      `;
    }
    getTheUl[0].appendChild(listItemsForPage);
    console.log(newsData);
  });
}
console.log("Hello News!");
// Sporten
fetch(
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:("Sports") AND glocations:("SWEDEN")&page=1&api-key=${apiKey}`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    // console.log("SPORT API", data);
    const mappedData = data.response.docs.map((item) => ({
      category: "sport",
      title: item.headline.main, // Title
      url: item.web_url, // url for site
      abstract: item.abstract, // Text to put in p
      byline: item.byline, // Authors
      multimedia: item.multimedia[1],
      datum: item.pub_date, // Jpeg
    }));
    newsData.push(...mappedData);
    // console.log(mappedData);
    listItems();
  })
  .catch((error) => {
    console.log(error);
  });
// Ekonomi
const apiKeyFinance = "Gb0Zk23fNHM0ID44E87pSMwzyykofNwp";
fetch(
  `https://api.polygon.io/v2/reference/news?limit=10&apiKey=${apiKeyFinance}`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Ekonomi API", data);
    const mappedData = data.results.map((item) => ({
      category: "Finance",
      title: item.title, // Title
      url: item.article_url, // url for site
      abstract: item.description, // Text to put in p
      byline: item.author, // Authors
      multimedia: item.image_url ? { url: item.image_url } : null, // Ensure it's an object if it exists
      datum: item.published_utc, // Jpeg
    }));
    // Push the mapped data into the global newsData array
    newsData.push(...mappedData);
    listItems();
  })
  .catch((error) => {
    console.log(error);
  });
// TEKNIK
const apiKeyTech = "pub_60058e2153ce481b3839350359f8847a3946c";
fetch(
  `https://newsdata.io/api/1/latest?apikey=pub_60058e2153ce481b3839350359f8847a3946c&category=technology&language=en`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("pizza API", data);
    const mappedData = data.results.map((item) => ({
      category: "technology",
      title: item.title, // Title
      url: item.link, // url for site
      abstract: item.description, // Text to put in p
      // byline: item.byline, // Authors
      multimedia: item.image_url,
      datum: item.pubDate, // Jpeg
    }));
    // Push the mapped data into the global newsData array
    newsData.push(...mappedData);
    console.log(newsData);
    listItems();
  })
  .catch((error) => {
    console.log(error);
  });


const categorySelect = document.querySelector("#categoryFilter");
categorySelect.addEventListener("change", filterByCategory)
function filterByCategory(event) {
  let filteredNewsData = [];
  // Filter news by category
  if (categorySelect.value==="all") {
    filteredNewsData = newsData;
  } else {
    filteredNewsData = newsData.filter(item => item.category === categorySelect.value);
  }

  // Clear news list
  const newsList = document.querySelector(".newsList");
  Array.from(newsList.children).forEach(child => newsList.removeChild(child));
  // If no matches display error
  if (filteredNewsData.length === 0) {
    newsList.innerHTML="<p>Inga nyheter i kategorin.</p>";
  } else {
    // Display filtered items
    listItems(filteredNewsData);
  }
}

const searchForm = document.querySelector(".search-container>form");
searchForm.addEventListener("submit", search);
function search(event) {
  event.preventDefault();

  const searchTextInput = document.querySelector("#search");
  let searchText = searchTextInput.value.trim()
  
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchText}&api-key=kzvccXW2l1EAE3toa0N5GFkWFozAqtqv`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    // console.log("search response",data)
    if (data.status !== "OK") {
      throw new Error("Response not ok", data)
    }
 
    // Clear news list
    const newsList = document.querySelector(".newsList");
    Array.from(newsList.children).forEach(child => newsList.removeChild(child));
    
    // If no matches display error
    if (data.response.docs.length === 0) {
      newsList.innerHTML="<p>Inga sökresultat.</p>";
    } else {
      
      // Display filtered items
      listItems(data.response.docs.map((item) => ({
        category: "search",
        title: item.headline.main, // Title
        url: item.web_url, // url for site
        abstract: item.abstract, // Text to put in p
        byline: item.byline, // Authors
        multimedia: item.multimedia[1],
        datum: item.pub_date, // Jpeg
      })));
    }
  })
  .catch((error) => {
    console.log(error);
  });
}