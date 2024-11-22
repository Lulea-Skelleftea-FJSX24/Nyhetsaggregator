let newsData = [];

console.log("Hello News!");
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

function listItems() {
  // const listItems = document.createElement("li");
  const getTheUl = document.getElementsByClassName("newsList");
  newsData.forEach((createList) => {
    const listItemsForPage = document.createElement("li");
    listItemsForPage.innerHTML = `<h3>${createList.title}</h3>
                           <img src="${createList.multimedia.url}" alt="pic of news">
                           <p>${createList.abstract}</p>
                           <p class="authors">${createList.byline}</p>
                           <a target="_blank" href="${createList.url}">Läs Mer Här</a>
                           <p class="authors">${createList.datum}</p>
    `;
    // if (createList.multimedia === undefined) {
    //   listItemsForPage.innerHTML = `<h3>${createList.title}</h3>

    //                        <p>${createList.abstract}</p>
    //                        <p class="authors">${createList.byline}</p>
    //                        <a target="_blank" href="${createList.url}">Läs Mer Här</a>
    //                        <p class="authors">${createList.datum}</p>
    // `;
    // } else {
    //   console.log("error");
    // }
    getTheUl[0].appendChild(listItemsForPage);
    console.log(newsData);
  });
}
console.log("Hello News!");
// Sporten
// fetch(
//   `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:("Sports") AND glocations:("SWEDEN")&page=1&api-key=${apiKey}`
// )
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`fel med response ${response.statusText}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     // console.log("SPORT API", data);
//     const mappedData = data.response.docs.map((item) => ({
//       category: "sport",
//       title: item.headline.main, // Title
//       url: item.web_url, // url for site
//       abstract: item.abstract, // Text to put in p
//       byline: item.byline, // Authors
//       multimedia: item.multimedia[1],
//       datum: item.pub_date, // Jpeg
//     }));
//     newsData.push(...mappedData);
//     // console.log(mappedData);
//     listItems();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// Ekonomi
// const apiKeyFinance = "Gb0Zk23fNHM0ID44E87pSMwzyykofNwp";
// fetch(
//   `https://api.polygon.io/v2/reference/news?limit=10&apiKey=${apiKeyFinance}`
// )
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`fel med response ${response.statusText}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log("Ekonomi API", data);
//     const mappedData = data.results.map((item) => ({
//       category: "Finance",
//       title: item.title, // Title
//       url: item.article_url, // url for site
//       abstract: item.description, // Text to put in p
//       byline: item.author, // Authors
//       multimedia: item.image_url,
//       datum: item.published_utc, // Jpeg
//     }));
//     // Push the mapped data into the global newsData array
//     newsData.push(...mappedData);
//     listItems();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// TEKNIK;
fetch(`https://esports.sportdevs.com/news-agg-leagues?league_id=eq.5468`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`fel med response ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("ESPORTS API", data);
  })
  .catch((error) => {
    console.log(error);
  });
