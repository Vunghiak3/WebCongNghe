let subtotalElem = document.querySelector(".subtotal-price");
let totalElem = document.querySelector(".total-price");
let rows = document.querySelectorAll(".item-product");

let subtotal = 0;

rows.forEach((row) => {
  let priceElem = row.querySelector(".price");
  let quantityElem = row.querySelector(".quantity");
  let price = parseInt(priceElem.textContent.replace(/\D/g, "")); // Lấy giá trị số từ chuỗi giá trị (loại bỏ ký tự VND)
  let quantity = parseInt(quantityElem.textContent.replace(/\D/g, "")); // Lấy số lượng từ chuỗi giá trị (loại bỏ ký tự 'x')
  subtotal += price * quantity;
});

let total = subtotal; // Giá trị total ban đầu sẽ bằng giá trị subtotal

subtotalElem.textContent = subtotal.toLocaleString("vi-VN") + " VND"; // Cập nhật giá trị cho Subtotal
totalElem.textContent = total.toLocaleString("vi-VN") + " VND"; // Cập nhật giá trị cho Total

// momo
let momoPaymentElem = document.querySelector(".momo-payment"); // Phần tử chứa phương thức thanh toán qua Momo
let paymentOptions = document.querySelectorAll(".payment-option input"); // Tất cả các phương thức thanh toán

// Ẩn phần tử chứa phương thức thanh toán qua Momo ban đầu
momoPaymentElem.classList.add("hide");

// Xử lý sự kiện khi người dùng chọn phương thức thanh toán
paymentOptions.forEach((option) => {
  option.addEventListener("change", (event) => {
    if (event.target.value === "momo") {
      momoPaymentElem.classList.remove("hide");
      momoPaymentElem.classList.add("show");
    } else {
      momoPaymentElem.classList.remove("show");
      momoPaymentElem.classList.add("hide");
    }
  });
});

// button place order
let placeOrderButton = document.getElementById("place-order-button");
let checkout = document.querySelector(".checkout-wrapper")

placeOrderButton.addEventListener("click", () => {
    checkout.textContent = 'Thank you for your order!'
    checkout.classList.add('thank-order')
});
