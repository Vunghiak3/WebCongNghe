const previewImages = document.querySelector("#preview-images");
const inputImages = document.querySelector("#product-images");

inputImages.addEventListener("change", (event) => {
  previewImages.innerHTML = "";

  for (const file of event.target.files) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      previewImages.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
});

const addButton = document.querySelector(".add-button");
const editButtons = document.querySelectorAll(".edit-button");
const formContainer = document.querySelector(".form-detail_container");
const form = formContainer.querySelector("form");
const btn = formContainer.querySelector("button")

// Xử lý khi click vào nút "Thêm mới"
addButton.addEventListener("click", () => {
  form.setAttribute("method", "post");
  btn.textContent = "Thêm"
  formContainer.classList.add("active-form");
});

// Xử lý khi click ra ngoài
document.addEventListener("click", (event) => {
  const target = event.target;

  if (
    !target.closest(".form-detail_wrapper") &&
    !target.closest(".add-button") &&
    !target.closest(".edit-button")
  ) {
    formContainer.classList.remove("active-form");
  }
});

// Xử lý khi click vào nút "Sửa"
editButtons.forEach((editButton) => {
  editButton.addEventListener("click", () => {
    form.setAttribute("method", "patch");
    btn.textContent = "Cập nhật"
    formContainer.classList.add("active-form");
  });
});
