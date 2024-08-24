"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const section1 = document.querySelector("#section--1");
const operations = document.querySelector(".operations__tab-container");
const containerDots = document.querySelector(".dots");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const btnsNavLinks = document.querySelector(".nav__links");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

const openModal = function (e) {
  e.preventDefault(); // Prevent default link behavior
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Page Navigation //
// Learn more button

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

// Navigation links
btnsNavLinks.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default link behavior
  if (e.target.classList.contains("nav__link"))
    document.querySelector(e.target.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
});

// Operations

operations.addEventListener("click", function (e) {
  const target = e.target.closest(".operations__tab");

  // Check if there is no target
  if (!target) return;

  // Getting the active tab index and the target tab index
  const activeTab = document.querySelector(".operations__tab--active").dataset
    .tab;
  const targetTab = target.dataset.tab;

  // Check if the clicked tab is already active
  if (activeTab === targetTab) return;

  // Remove active classes from both tabs and their corresponding content
  document
    .querySelector(`.operations__tab--${activeTab}`)
    .classList.remove("operations__tab--active");
  document
    .querySelector(`.operations__content--${activeTab}`)
    .classList.remove("operations__content--active");

  // Adding active classes to both tabs and their corresponding content
  document
    .querySelector(`.operations__tab--${targetTab}`)
    .classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${targetTab}`)
    .classList.add("operations__content--active");
});

// Cookie message //
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookies for improved functionality and personalization!<button class="btn btn--close--cookie">Got It!</button>';
message.style.backgroundColor = "#37383d";
header.append(message);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
// Cookie close button
const btnCloseCookie = document.querySelector(".btn--close--cookie");
// Close cookie message when clicked on the button //
btnCloseCookie.addEventListener("click", function () {
  message.remove();
});

// Nav Menu Animations //

// Function to handle hover
const handleHover = function (e, opacity = 1, linkScale = 1, lowScale = 1) {
  if (!e.target.classList.contains("nav__link")) return;
  const link = e.target;
  const siblings = link.closest(".nav").querySelectorAll(".nav__link");
  const logo = link.closest(".nav").querySelector("img");
  siblings.forEach(el => {
    if (el === link) return; // Skip the active link
    el.style.opacity = opacity;
    el.style.transform = `scale(${lowScale})`;
  });
  logo.style.opacity = opacity;
  logo.style.transform = `scale(${lowScale})`;
  link.style.transform = `scale(${linkScale})`;
};

// Event Listener for mouse over
nav.addEventListener("mouseover", e => handleHover(e, 0.5, 1.1, 0.9));

// Event Listener for mouse out
nav.addEventListener("mouseout", e => handleHover(e));

// Sticky Nav //
// Getting the nav height
const navHeight = nav.getBoundingClientRect().height;

// Function to add sticky navigation
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

// Observer options
const navobsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // Sticky navbar 100px from the bottom of the viewport
};

// Create an observer instance and start watching the header element
const headerObserver = new IntersectionObserver(stickyNav, navobsOptions);
// Observe the header element
headerObserver.observe(header);

// Sections Animation //
// // All sections
const sections = document.querySelectorAll(".section");

// Function to reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target); // Stop observing once the section is revealed
};

// Observe options
const secObsOptions = {
  root: null,
  threshold: 0.15, // Intersection Observer threshold
};

// Observer for sections animation
const sectionObserver = new IntersectionObserver(revealSection, secObsOptions);

sections.forEach(sec => {
  sec.classList.add("section--hidden");
  sectionObserver.observe(sec);
});

// Lazy Loading Images //
// All images
const imgs = document.querySelectorAll("img[data-src]");

// Function to load images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src; // Replace the source attribute with the high resolution one
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  ); // Remove lazy class once the image is loaded
  observer.unobserve(entry.target); // Stop observing once the image is loaded
};

// Observe options
const imgObsOptions = {
  root: null,
  threshold: 0, // Intersection Observer threshold
  rootMargin: "200px", // Intersection Observer threshold for images, 200px from the bottom of the viewport
};

// Observer for loading images
const imgObserver = new IntersectionObserver(loadImg, imgObsOptions);

// Adding observers for images
imgs.forEach(img => imgObserver.observe(img));

// SLider //
// slider function
const slider = function () {
  // All slides
  const slides = document.querySelectorAll(".slide");

  // Function to create dots
  const createDots = function () {
    slides.forEach((_, i) =>
      containerDots.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
  };
  createDots();

  // Function go to slide
  const goToSlide = function (slide) {
    // Moving slides
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );

    // ALl dots
    const dots = document.querySelectorAll(".dots__dot");

    // Update dots
    dots.forEach(dot => {
      if (dot.dataset.slide == slide) dot.classList.add("dots__dot--active");
      else if (dot.classList.contains("dots__dot--active"))
        dot.classList.remove("dots__dot--active");
    });
  };

  // Function to go to next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    goToSlide(currentSlide);
  };

  // Function to go to previous slide
  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    goToSlide(currentSlide);
  };

  // loop through slides to adjust there first position
  goToSlide(0);

  // current slide
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // Event listener to move slides to right
  btnRight.addEventListener("click", nextSlide);

  // Event listener to move slides to left
  btnLeft.addEventListener("click", prevSlide);

  // Event listener to move slides using arrow keys
  document.addEventListener("keydown", e => {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  document.querySelector(".dots").addEventListener("click", e => {
    if (!e.target.classList.contains("dots__dot")) return;
    goToSlide(e.target.dataset.slide);
  });
};
slider();
