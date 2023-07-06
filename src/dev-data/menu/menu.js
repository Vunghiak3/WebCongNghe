const menu = document.querySelector('menu');
let prevScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

window.addEventListener('scroll', () => {
  const currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScrollPosition > prevScrollPosition) {
    // Cuộn trang xuống
    menu.attributes.position = "fixed";
    menu.classList.add('menu-hidden');
  } else {
    // Cuộn trang lên
    menu.classList.remove('menu-hidden');
  }
  prevScrollPosition = currentScrollPosition;
});