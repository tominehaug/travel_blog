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

  const headTitle = document.querySelector("title");
  headTitle.textContent = `${post.title}`;

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

  const editAccess = document.getElementById("edit-access");
  editAccess.querySelector("a").href = `/post/edit.html?id=${post.id}`;
  if (!(authUser === username)) {
    editAccess.classList.add("hidden");
  }
}

async function init() {
  const post = await fetchPost();
  if (post) {
    displayPost(post);
  }
}

init();

const shareBtn = document.querySelector(".share");

shareBtn.addEventListener("click", () => {
  const popupDiv = document.querySelector(".popup");
  const popupBackdrop = document.getElementById("popup-backdrop");
  const popupContainer = document.getElementById("popup");

  popupDiv.innerHTML = "";
  const sharePrompt = document.createElement("h2");
  sharePrompt.textContent = "Share this post!";
  const shareLink = document.createElement("p");
  shareLink.textContent = `https://tominehaug.github.io/post/index.html?id=${postId}`;
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList.add("cancel-button");
  popupDiv.appendChild(sharePrompt);
  popupDiv.appendChild(shareLink);
  popupDiv.appendChild(cancelBtn);

  popupContainer.classList.remove("hidden");
  popupBackdrop.classList.remove("hidden");

  cancelBtn.addEventListener("click", () => {
    popupContainer.classList.add("hidden");
    popupBackdrop.classList.add("hidden");
  });
});
