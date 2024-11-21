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
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
