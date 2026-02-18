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

    const titleDiv = document.createElement("h3");
    titleDiv.textContent = post.title;
    titleDiv.classList.add("thumbnail");

    link.appendChild(thumbnail);
    link.appendChild(titleDiv);
    container.appendChild(link);
  });
}

console.log(allPosts);

async function init() {
  allPosts = await fetchPosts();
  if (!allPosts) return;

  displayPosts(allPosts);
}

init();
