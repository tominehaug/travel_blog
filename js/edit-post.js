import { setPopup, showPopup, hidePopup } from "./popup.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

// Logic for fetching and displaying the post

async function fetchPost() {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`,
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

async function displayInput(post) {
  document.getElementById("mediaUrl").value = post.media.url || "";
  document.getElementById("title").value = post.title || "";

  // separate ingress and body text within the API body
  const assistanceDiv = document.createElement("div");
  assistanceDiv.innerHTML = post.body || "";
  const fullBody = assistanceDiv.textContent;

  const ingressInput =
    assistanceDiv.querySelector(".ingress").textContent || "";
  document.getElementById("ingress").value = ingressInput;

  let bodyText;
  if (fullBody.startsWith(ingressInput)) {
    bodyText = fullBody.slice(ingressInput.length).trim();
  } else {
    bodyText = fullBody.trim();
  }
  document.getElementById("body").value = bodyText;
}

async function init() {
  const post = await fetchPost();
  if (post) {
    displayInput(post);
  }
}

init();

// Logic for replacing/updating the post

// Logic for deleting the post

const deleteBtn = document.getElementById("delete-btn");
const deleteUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

async function deletePost(url) {
  try {
    const deleteOptions = {
      method: "DELETE",
      headers: `Bearer${token}`,
    };
    const response = await fetch(url, deleteOptions);

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Failed network response");

    // alert: success or not
    setPopup("confirm-popup", "Your post was deleted from the blog.", [
      {
        text: "New post",
        class: "tertiary-button",
        href: "../post/create.html",
      },
      { text: "Home", class: "cancel-button", href: "./" },
    ]);
    showPopup();
  } catch (error) {
    setPopup("warning-popup", error.message, [
      { text: "back", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}

deleteBtn.addEventListener("click", deletePost(deleteUrl));
