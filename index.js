const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const carouselInner = document.getElementById("carouselInner");
const progressBar = document.getElementById("progressBar");
const API_KEY = "YOUR_API_KEY";

async function loadBreeds() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
      headers: { "x-api-key": API_KEY },
    });
    response.data.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    console.log("Breeds loaded:", response.data);
  } catch (error) {
    console.error("Error fetching breeds:", error);
  }
}

breedSelect.addEventListener("change", async () => {
  const breedId = breedSelect.value;
  console.log("Selected breed ID:", breedId);
  progressBar.style.width = "0%";

  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`,
      {
        headers: { "x-api-key": API_KEY },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressBar.style.width = `${percentCompleted}%`;
        },
      }
    );

    console.log("Images fetched:", response.data);

    const images = response.data;
    carouselInner.innerHTML = "";
    infoDump.innerHTML = "";

    if (images.length === 0) {
      console.log("No images found for this breed.");
      return;
    }

    images.forEach((image, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (index === 0) carouselItem.classList.add("active");

      const img = document.createElement("img");
      img.src = image.url;
      img.classList.add("d-block", "w-100");

      const favButton = document.createElement("div");
      favButton.classList.add("favourite-button");
      favButton.innerHTML = "❤️";
      favButton.onclick = () => favourite(image.id);
      carouselItem.appendChild(img);
      carouselItem.appendChild(favButton);
      carouselInner.appendChild(carouselItem);
    });

    const breedResponse = await axios.get(
      `https://api.thecatapi.com/v1/breeds/${breedId}`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );
    infoDump.innerHTML = `<h3>${breedResponse.data.name}</h3><p>${breedResponse.data.description}</p>`;
  } catch (error) {
    console.error("Error fetching images:", error);
  }

  progressBar.style.width = "100%";
});

function favourite(imgId) {
  console.log(`Toggle favourite for image ID: ${imgId}`);
}

loadBreeds();
