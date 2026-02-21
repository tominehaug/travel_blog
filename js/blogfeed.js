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

async function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const link = document.createElement("a");
    link.href = `/post/index.html?id=${post.id}`;

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

async function displayCarousel(highlights) {
  const slidesWrapper = document.getElementById("slides-container");

  highlights.forEach((highlight) => {
    const link = document.createElement("a");
    link.href = `/post/index.html?id=${highlight.id}`;

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
