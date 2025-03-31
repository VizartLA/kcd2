window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});


const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.mobile-menu__close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__list a');

function toggleMenu() {
  if (!burgerMenu || !mobileMenu) return;
  
  const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
  burgerMenu.setAttribute('aria-expanded', !isExpanded);
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
  document.body.classList.toggle('body-no-scroll', !isExpanded);
}


burgerMenu?.addEventListener('click', toggleMenu);

closeMenu?.addEventListener('click', function() {
  if (burgerMenu) burgerMenu.setAttribute('aria-expanded', 'false');
  mobileMenu?.classList.remove('active');
  document.body.classList.remove('menu-open', 'body-no-scroll');
});

mobileMenuLinks?.forEach(link => {
  link.addEventListener('click', function() {
    toggleMenu();
    document.body.classList.remove('body-no-scroll');
  });
});


document.querySelector('.header__offer-button')?.addEventListener('click', () => {
  console.log('Кнопка Buy now нажата');
});

