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
