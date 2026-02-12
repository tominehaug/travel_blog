import { setPopup, showPopup, hidePopup } from "./popup.js";
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", validateForm);

async function validateForm(event) {
  event.preventDefault();

  let isValid = true;
  const inputs = Array.from(createForm.querySelectorAll("input, textarea"));

  inputs.forEach((input) => {
    const errorDiv = input.nextElementSibling;

    //validate file input
    if (input.type === "file") {
      if (!input.files || input.files.length === 0) {
        errorDiv.textContent = "Please fill out this field";
        isValid = false;
      } else {
        errorDiv.textContent = "";
      }
      return;
    }

    //validate other input

    if (!input.checkValidity()) {
      errorDiv.textContent = input.validationMessage;
      input.classList.add("invalid");
      isValid = false;
    } else {
      errorDiv.textContent = "";
      input.classList.remove("invalid");
    }
  });

  if (isValid) {
    console.log("Validated!<3333");
    uploadPost();
  }
}

async function uploadPost() {
  //Collect blog post data
  const formData = new FormData(createForm);
  const ingressInput = formData.get("ingress");
  const bodyInput = formData.get("body");
  const bodyTxt = `<p class="ingress">${ingressInput}</p>${bodyInput}`;

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
    setPopup("confirm-popup", "Your post was uploaded to the blog!", [
      {
        text: "Go to post",
        class: "primary-button",
        href: "../account/login.html",
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
