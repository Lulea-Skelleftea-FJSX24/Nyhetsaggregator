const apiKey = "kzvccXW2l1EAE3toa0N5GFkWFozAqtqv";
  // Most viewed last 7 days
  fetch(
    `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`fel med response ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
        console.log("Most viewed api: ", data);
        heroLayout(data.results);
    })
    .catch((error) => {
      console.log(error);
    });

function heroLayout(articles) {
  if (!articles || articles.length < 2) return;

  const article1Element = document.getElementById("article1");
  const article2Element = document.getElementById("article2");

  if (!article1Element || !article2Element) return;

  const article1 = articles[0];
  const imageUrl1 = article1.media && article1.media[0] && article1.media[0]['media-metadata'] ? article1.media[0]['media-metadata'][2].url : '';

  article1Element.innerHTML = `
    <h1 class="heroArticleTitle">${article1.title}</h1>
    <div class="articleContent">
        <p class="heroAbstract">${article1.abstract}</p>
        <img src="${imageUrl1}" alt="Bild av nyhet">
    </div>
    <a class="buttonToArticle" href="${article1.url}" target="_blank">Läs Mer Här</a>
  `;

  const article2 = articles[1];
  const imageUrl2 = article2.media && article2.media[0] && article2.media[0]['media-metadata'] ? article2.media[0]['media-metadata'][2].url : '';

  article2Element.innerHTML = `
    <h1 class="heroArticleTitle">${article2.title}</h1>
    <div class="articleContent">
        <p class="heroAbstract">${article2.abstract}</p>
        <img src="${imageUrl2}" alt="Bild av nyhet">
    </div>
    <a class="buttonToArticle" href="${article2.url}" target="_blank">Läs Mer Här</a>
  `;
}

