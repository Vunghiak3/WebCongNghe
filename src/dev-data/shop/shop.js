const images = document.querySelectorAll("img");
images.forEach((image) => {
  image.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
});