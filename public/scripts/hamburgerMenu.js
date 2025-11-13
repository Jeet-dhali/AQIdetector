const hamburgerMenu = document.querySelector('.hamburger-menu');
const closeMenu = document.querySelector('.close-menu');
const sideMenu = document.querySelector('.sidemenu');

hamburgerMenu.addEventListener('click', () => {
    sideMenu.classList.add('open');
})

closeMenu.addEventListener('click', ()=>{
    sideMenu.classList.remove('open');
})