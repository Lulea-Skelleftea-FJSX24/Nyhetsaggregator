let newsData = [];

async function fetchSports() {
  try {
    const data = await limitedRequest(
      `https://newsapi.org/v2/top-headlines?country=us&category=sport&apiKey=71612dda2b2c4b17b083e96712ba8964`
    );

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
    console.error("Error fetching Sports News:", error);
    showError(
      "Something went wrong while fetching the sports news. Please try again later."
    );
  }
}

fetchSports();
console.log(newsData);
