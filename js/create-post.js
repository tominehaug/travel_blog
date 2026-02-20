import { setPopup, showPopup, hidePopup } from "./popup.js";
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

const createForm = document.getElementById("create-form");

import { validateForm } from "./validation.js";

createForm.addEventListener("submit", (event) => {
  const isValid = validateForm(event, createForm);

  if (isValid) {
    uploadPost();
  }
});

async function uploadPost() {
  //Collect blog post data
  const formData = new FormData(createForm);
  const ingressInput = formData.get("ingress");
  const bodyInput = formData.get("body");
  const bodyTxt = `<h3 class="ingress">${ingressInput}</h3><p>${bodyInput}</p>`;

  const body = {
    title: formData.get("title"),
    body: bodyTxt,
    media: {
      url: formData.get("mediaUrl"),
      alt: formData.get("mediaAlt"),
    },
  };
  console.log(body);

  //HTTP Post request
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );
    // API checks request
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Upload failed");

    // alert: success or not
    const newPostId = data.data.id;

    setPopup("confirm-popup", "Your post was uploaded to the blog!", [
      {
        text: "Go to post",
        class: "primary-button",
        href: `/post/index.html?id=${newPostId}`,
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
