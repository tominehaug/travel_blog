import { setPopup, showPopup, hidePopup } from "./popup.js";

const basePath = window.location.hostname.includes("github.io")
  ? "/travel_blog"
  : "";

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
  document.getElementById("mediaAlt").value = post.media.alt || "";
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

// Logic for validating and replacing/updating the post

const updateUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;
const editForm = document.getElementById("edit-form");

import { validateForm } from "./validation.js";

editForm.addEventListener("submit", (event) => {
  const isValid = validateForm(event, editForm);

  if (isValid) {
    updatePost();
  }
});

async function updatePost() {
  //Collect blog post data
  const formData = new FormData(editForm);
  const ingressInput = formData.get("ingress");
  const bodyInput = formData.get("body");
  const bodyTxt = `<h3 class="ingress">${ingressInput}</h3><p>${bodyInput}</p>`;

  const updatedBody = {
    title: formData.get("title"),
    body: bodyTxt,
    media: {
      url: formData.get("mediaUrl"),
      alt: formData.get("mediaAlt"),
    },
  };
  console.log(updatedBody);
  //HTTP PUT request
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBody),
    });
    // API checks request
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Upload failed");

    // alert: success or not
    setPopup("confirm-popup", "Your post was updated!", [
      {
        text: "View post",
        class: "primary-button",
        href: `${basePath}/post/index.html?id=${postId}`,
      },
      { text: "Home", class: "cancel-button", href: "../" },
    ]);
    showPopup();
  } catch (error) {
    setPopup("warning-popup", error.message, [
      { text: "back", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}

// Logic for deleting the post

const deleteBtn = document.getElementById("delete-btn");
const deleteUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

deleteBtn.addEventListener("click", () => {
  setPopup("warning-popup", "Do you want to delete this post?", [
    {
      text: "Yes",
      class: "warning-btn",
      onClick: deletePost,
    },
    { text: "No", class: "cancel-button", onClick: hidePopup },
  ]);
  showPopup();
});

async function deletePost() {
  try {
    const deleteOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(deleteUrl, deleteOptions);

    let data = null;
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }

    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Failed network response");

    // alert: success or not
    setPopup("confirm-popup", "Your post was deleted from the blog.", [
      {
        text: "New post",
        class: "primary-button",
        href: `${basePath}/post/create.html`,
      },
      { text: "Home", class: "cancel-button", href: "../" },
    ]);
    showPopup();
  } catch (error) {
    setPopup("warning-popup", error.message, [
      { text: "back", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}
