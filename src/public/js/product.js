const imgItems = document.querySelectorAll(".img-item img");
const imgShow = document.querySelector(".img-show img");
const imgShowWrapper = document.querySelector(".img-show");
const imgWrapper = document.querySelector(".img-detail");
const imgBig = document.querySelector(".img-big");
const imgPrev = document.querySelector(".prev");
const imgNext = document.querySelector(".next");
// const imgClose = document.querySelector(".close");

let currentIndex = 0;

// Mặc định hiển thị ảnh đầu tiên trong img-show
imgShow.src = imgItems[0].src;

// Lắng nghe sự kiện click trên từng ảnh trong img-item và thay đổi ảnh hiển thị trong img-show
imgItems.forEach((imgItem, index) => {
  imgItem.addEventListener("click", () => {
    imgShow.src = imgItem.src;
    currentIndex = index;
  });
});

// Lắng nghe sự kiện click trên ảnh trong img-show để hiển thị lên img-wrapper
imgShowWrapper.addEventListener("click", () => {
  imgWrapper.style.display = "block";
  imgBig.src = imgShow.src;
  document.body.style.overflow = "hidden";
});

// Chuyển đến ảnh trước đó
imgPrev.addEventListener("click", () => {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = imgItems.length - 1;
  }
  imgBig.src = imgItems[currentIndex].src;
});

// Chuyển đến ảnh tiếp theo
imgNext.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= imgItems.length) {
    currentIndex = 0;
  }
  imgBig.src = imgItems[currentIndex].src;
});

// Đóng phần hiển thị ảnh lớn chi tiết khi click vào vùng bên ngoài
imgWrapper.addEventListener("click", (event) => {
  if (event.target === imgWrapper) {
    imgWrapper.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

document
  .getElementById("additional-info-btn")
  .addEventListener("click", function () {
    document.getElementById("description-btn").classList.remove("active");
    document.getElementById("additional-info-btn").classList.add("active");
    document.getElementById("description-section").style.display = "none";
    document.getElementById("additional-info-section").style.display = "block";
  });

document
  .getElementById("description-btn")
  .addEventListener("click", function () {
    document.getElementById("description-btn").classList.add("active");
    document.getElementById("additional-info-btn").classList.remove("active");
    document.getElementById("description-section").style.display = "block";
    document.getElementById("additional-info-section").style.display = "none";
  });

const images = document.querySelectorAll("img");
images.forEach((image) => {
  image.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
});
