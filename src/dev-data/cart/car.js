// Lấy danh sách các phần tử con của tbody
const items = document.querySelectorAll('.item-product');

// Lặp qua từng phần tử để tính tổng giá trị subtotal của chúng
let total = 0;
items.forEach(item => {
  const price = parseFloat(item.querySelector('.price-product').textContent.replace(/\D/g, ''));
  let quantity = parseInt(item.querySelector('.quantity').value);
  let subtotal = price * quantity;
  item.querySelector('.subtotal').textContent = subtotal.toLocaleString('vi-VN') + ' VND';
  total += subtotal;
});

// Cập nhật giá trị tổng
document.querySelector('.total-price').textContent = total.toLocaleString('vi-VN') + ' VND';

// Thêm sự kiện lắng nghe cho các phần tử input để tính lại giá trị subtotal khi số lượng thay đổi
const quantityInputs = document.querySelectorAll('.quantity');
quantityInputs.forEach(input => {
  input.addEventListener('change', () => {
    const item = input.closest('.item-product');
    const price = parseFloat(item.querySelector('.price-product').textContent.replace(/\D/g, ''));
    let quantity = parseInt(input.value);
    let subtotal = price * quantity;
    item.querySelector('.subtotal').textContent = subtotal.toLocaleString('vi-VN') + ' VND';
    total = 0;
    items.forEach(item => {
      total += parseFloat(item.querySelector('.subtotal').textContent.replace(/\D/g, ''));
    });
    document.querySelector('.total-price').textContent = total.toLocaleString('vi-VN') + ' VND';
  });
});

// Thêm sự kiện lắng nghe cho các phần tử i để xóa phần tử tương ứng và cập nhật lại tổng giá trị
const deleteButtons = document.querySelectorAll('.fa-trash');
deleteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.item-product');
    const subtotal = parseFloat(item.querySelector('.subtotal').textContent.replace(/\D/g, ''));
    item.remove();
    total -= subtotal;
    document.querySelector('.total-price').textContent = total.toLocaleString('vi-VN') + ' VND';
  });
});