import { setPopup, showPopup, hidePopup } from "./popup.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const username = localStorage.getItem("username");

const blogOwner = username || "tomine";

async function fetchPost() {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${blogOwner}/${postId}`,
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

async function displayPost(post) {
  const titleWrapper = document.getElementById("title-wrapper");
  const byline = document.getElementById("byline");
  const bodyWrapper = document.getElementById("body-wrapper");
  bodyWrapper.innerHTML = `${post.body}`;

  const banner = document.createElement("img");
  banner.src = post.media.url;
  banner.alt = post.media.alt;

  const title = document.createElement("h1");
  title.textContent = `${post.title}`;

  const createdDate = document.createElement("h4");
  createdDate.textContent = "Date: " + post.created.slice(0, 10);

  const author = document.createElement("h4");
  author.textContent = "Author: " + `${post.author.name}`;

  titleWrapper.appendChild(banner);
  titleWrapper.appendChild(title);
  byline.appendChild(author);
  byline.appendChild(createdDate);

  const authUser = post.author.name;

  const edit = document.createElement("a");
  edit.href = "../post/edit.html";
  edit.textContent = "EDIT";
  const editIcon = document.createElement("img");
  editIcon.src = "../assets/edit_desktop.png";
  edit.appendChild(editIcon);
  if (authUser === username) {
    byline.appendChild(edit);
  } else {
    byline.removeChild(edit);
  }
}

async function init() {
  const post = await fetchPost();
  if (post) displayPost(post);
}

init();
