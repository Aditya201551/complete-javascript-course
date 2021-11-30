'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(i => i.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const header = document.querySelector('.header');
const cookie = document.createElement('div');
cookie.classList.add('cookie-message');
cookie.innerHTML = `We use cookies to serve you better and use analytics! <button class="btn btn--close-cookie">Got It!</button>`;
cookie.style.backgroundColor = '#37383d';
cookie.style.height = `${getComputedStyle(cookie).height + 60}px`;
header.after(cookie);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  cookie.remove();
});

document.querySelector('.btn--scroll-to').addEventListener('click', e => {
  let sectionOne = document.querySelector('#section--1');

  //old school but more logical
  // let sectionOne=document.querySelector('#section--1').getBoundingClientRect()
  // window.scrollTo({
  //   left: sectionOne.left + window.pageXOffset,
  //   top: sectionOne.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //modern way
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});
//adding event listener to all the elements separately(creating a copy in forEach loop)
// document.querySelectorAll('.nav__link').forEach(i => {
//   i.addEventListener('click', e => {
//     e.preventDefault();
//     // console.log(this);
//     const id = i.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

//using eventDelegation(applying eventListener to the parent element of all the child element)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  const currentElement = e.target;
  e.preventDefault();
  // console.log(currentElement);
  document.querySelector(currentElement.getAttribute('href')).scrollIntoView({
    behavior: 'smooth',
  });
});

//tabbed component
let tabs = document.querySelectorAll('.operations__tab');
let contents = document.querySelectorAll('.operations__content');
document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (e) {
    let tab = e.target.closest('.operations__tab');
    if (e.target == this) {
      console.log('outside');
      return;
    }
    // console.log(e.target);
    tabs.forEach(i => {
      i.classList.remove('operations__tab--active');
    });
    tab.classList.add('operations__tab--active');
    let activeContent = document.querySelector(
      `.operations__content--${tab.dataset.tab}`
    );
    contents.forEach(i => {
      i.classList.remove('operations__content--active');
    });
    // console.log(activeContent);
    activeContent.classList.add('operations__content--active');
  });
//nav link
document
  .querySelector('.nav__links')
  .addEventListener('mouseover', function (e) {
    if (e.target == this) {
      // console.log('mouseover');
      for (let i of this.children) i.firstElementChild.style.opacity = 0.5;
      // e.target.style.opacity = 1;
      return;
    }
    // console.log(e.target);
    for (let i of this.children) i.firstElementChild.style.opacity = 0.5;
    e.target.style.opacity = 1;
  });

document
  .querySelector('.nav__links')
  .addEventListener('mouseout', function (e) {
    // console.log('mouseout');
    for (let i of this.children) i.firstElementChild.style.opacity = 1;
  });

//sticky navigation
let nav = document.querySelector('.nav');
let section1Coord = document.querySelector('#section--1');
// window.addEventListener('scroll', () => {
//   if (window.scrollY > section1Coord.getBoundingClientRect().top)
//     nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// function obsCallback(entries, observer) {
//   console.log(entries);
//   console.log(observer);
// }

// const obsOption = {
//   root: null,
//   threshold: 0,
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(header);

//sticky navigation
const headerObserver = new IntersectionObserver(
  entries => {
    const [entry] = entries;
    // console.log(entry);
    if (entry.isIntersecting) nav.classList.remove('sticky');
    else nav.classList.add('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '-90px',
  }
);
headerObserver.observe(header);

//reveal sections
let sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(
  (entries, observe) => {
    let [entry] = entries;
    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
    else entry.target.classList.add('section--hidden');
    // console.log(observe);
  },
  {
    root: null,
    threshold: 0.15,
  }
);
sections.forEach(i => {
  sectionObserver.observe(i);
  // i.classList.add('section--hidden');
});

//lazy loading of images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    let [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    console.log('observed');
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 1,
  }
);
images.forEach(i => imageObserver.observe(i));

//image slider
let slides = document.querySelectorAll('.slide');

//buttons
let buttonLeft = document.querySelector('.slider__btn--left');
let buttonRight = document.querySelector('.slider__btn--right');
gotoSlide(0);
function gotoSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}
let currentSlide = 0;
let maxSlide = slides.length - 1;
buttonRight.addEventListener('click', () => {
  if (currentSlide === maxSlide) currentSlide = 0;
  else currentSlide++;
  gotoSlide(currentSlide);
});

buttonLeft.addEventListener('click', () => {
  if (currentSlide == 0) currentSlide = maxSlide;
  else currentSlide--;
  gotoSlide(currentSlide);
});
