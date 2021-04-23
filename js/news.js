const newsLoadBtn = document.getElementById("news");

newsLoadBtn.addEventListener("click", () => {
  const url = `https://newsapi.org/v2/everything?q=coronavirus&from=2021-04-20&sortBy=popularity&apiKey=139911a684594e429bc75246fc91771f`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
});
