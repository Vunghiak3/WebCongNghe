// Lấy tất cả các ô nhập số lượng sản phẩm
const quantityInputs = document.querySelectorAll('.quantity');

// Lặp qua từng ô nhập số lượng sản phẩm
quantityInputs.forEach(quantityInput => {
  // Lắng nghe sự kiện 'input' của từng ô nhập số lượng sản phẩm
  quantityInput.addEventListener('input', () => {
    // Lấy giá trị số lượng sản phẩm và giá tiền của sản phẩm tương ứng
    const quantity = parseInt(quantityInput.value);
    const priceElement = quantityInput.parentElement.previousElementSibling;
    const price = parseFloat(priceElement.textContent.replace(/\D/g, ''));

    // Tính lại giá trị sub-total của sản phẩm tương ứng
    const subtotalElement = quantityInput.parentElement.nextElementSibling;
    const subtotal = quantity * price;
    subtotalElement.textContent = `${subtotal.toLocaleString()} VND`;

    // Tính lại tổng giá trị đơn hàng sau khi thay đổi số lượng sản phẩm
    const subtotalElements = document.querySelectorAll('.subtotal');
    let total = 0;
    subtotalElements.forEach(subtotalElement => {
      total += parseFloat(subtotalElement.textContent.replace(/\D/g, ''));
    });
    document.querySelector('.total-price').textContent = `${total.toLocaleString()} VND`;
  });
});

// Lấy tất cả các biểu tượng xóa
const removeButtons = document.querySelectorAll('.remove-product');

// Lặp qua từng biểu tượng xóa
removeButtons.forEach(removeButton => {
  // Lắng nghe sự kiện 'click' của từng biểu tượng
  removeButton.addEventListener('click', () => {
    // Xác định phần tử cha (cột sản phẩm) của biểu tượng xóa và xóa nó khỏi bảng giỏ hàng
    const productColumn = removeButton.parentElement.parentElement;
    productColumn.remove();

    // Tính lại tổng giá trị đơn hàng sau khi xóa sản phẩm
    const subtotalElements = document.querySelectorAll('.subtotal');
    let total = 0;
   subtotalElements.forEach(subtotalElement => {
      total += parseFloat(subtotalElement.textContent.replace(/\D/g, ''));
    });
    document.querySelector('.total-price').textContent = `${total.toLocaleString()} VND`;
  });
});