import { setPopup, showPopup, hidePopup } from "./popup.js";

const username = localStorage.getItem("username");
const blogOwner = username || "tomine";

let allPosts = [];

async function fetchPosts() {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${blogOwner}`,
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Failed network response");
    return data.data;
  } catch (error) {
    console.error("Something went wrong" + error);
    setPopup("warning-popup", error.message, [
      { text: "OK", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}

// grid feed

async function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const link = document.createElement("a");
    link.href = `${blogOwner}/post/index.html?id=${post.id}`;

    const thumbnail = document.createElement("img");
    thumbnail.src = post.media.url;
    thumbnail.alt = post.media.alt;
    thumbnail.classList.add("thumbnail-media");

    const title = document.createElement("h3");
    title.textContent = post.title;
    title.classList.add("thumbnail");

    link.appendChild(thumbnail);
    link.appendChild(title);
    container.appendChild(link);
  });
}

// carousel

async function displayCarousel(highlights) {
  const slidesWrapper = document.getElementById("slides-container");

  highlights.forEach((highlight) => {
    const link = document.createElement("a");
    link.href = `/post/index.html?id=${highlight.id}`;
    link.classList.add("link-wrap");

    const slideImg = document.createElement("img");
    slideImg.src = highlight.media.url;
    slideImg.alt = highlight.media.alt;
    slideImg.classList.add("slide");

    const titleDiv = document.createElement("div");
    titleDiv.textContent = highlight.title;
    titleDiv.classList.add("slide-title");

    link.appendChild(slideImg);
    link.appendChild(titleDiv);
    slidesWrapper.appendChild(link);
  });

  handleSlides(slideIndex);
}

let slideIndex = 1;

function plusSlides(n) {
  handleSlides((slideIndex += n));
}

function currentSlide(n) {
  handleSlides((slideIndex = n));
}

document.querySelector(".prev").addEventListener("click", () => {
  plusSlides(-1);
});

document.querySelector(".next").addEventListener("click", () => {
  plusSlides(1);
});

document.querySelectorAll(".dot").forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide(index + 1);
  });
});

function handleSlides(n) {
  let i;
  let slides = document.getElementsByClassName("link-wrap");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" selected", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " selected";
}

async function init() {
  allPosts = await fetchPosts();
  if (!allPosts) return;

  const highlights = allPosts.slice(0, 3);
  const restHighlights = allPosts.slice(3, 15);

  displayPosts(restHighlights);
  displayCarousel(highlights);
}

init();
