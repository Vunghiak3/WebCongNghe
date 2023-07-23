// const registerForm = document.getElementById('register-form');
// const passwordInput = document.getElementById('password-register');
// const againPassInput = document.getElementById('again-pass');
// const usernameInput = document.getElementById('username-register');
// const fullnameInput = document.getElementById('fullname');
// const addressInput = document.getElementById('address');

// registerForm.addEventListener('submit', function(event) {
//   let errorMessages = [];
  
//   if (passwordInput.value !== againPassInput.value) {
//     errorMessages.push('Mật khẩu nhập lại không khớp!');
//   }
  
//   if (usernameInput.value === '') {
//     errorMessages.push('Chưa nhập tên người dùng hoặc email!');
//   }
  
//   if (passwordInput.value === '') {
//     errorMessages.push('Chưa nhập mật khẩu!');
//   }
  
//   if (fullnameInput.value === '') {
//     errorMessages.push('Chưa nhập họ và tên!');
//   }
  
//   if (addressInput.value === '') {
//     errorMessages.push('Chưa nhập địa chỉ!');
//   }
  
//   if (errorMessages.length > 0) {
//     event.preventDefault();
//     alert(errorMessages.join('\n'));
//   }
// });