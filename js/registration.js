import { setPopup, showPopup, hidePopup } from "./popup.js";

const registrationForm = document.getElementById("registration-form");
registrationForm.addEventListener("submit", validateForm);

async function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  const inputs = Array.from(registrationForm.querySelectorAll("input"));

  inputs.forEach((input) => {
    const errorDiv = input.nextElementSibling;

    if (!input.checkValidity()) {
      errorDiv.textContent = input.validationMessage;
      input.classList.add("invalid");
      isValid = false;
    } else {
      errorDiv.textContent = "";
      input.classList.remove("invalid");
    }
  });

  const password = registrationForm.elements.password.value;
  const confirm = registrationForm.elements.confirmPwd.value;
  const confirmErrorDiv =
    registrationForm.elements.confirmPwd.nextElementSibling;

  if (password !== confirm) {
    confirmErrorDiv.textContent = "Passwords don't match";
    isValid = false;
  } else {
    confirmErrorDiv.textContent = "";
  }

  if (isValid) {
    console.log("Validated!<3333");
    handleRegistration();
  }
}

async function handleRegistration() {
  // collect registration data
  const formData = new FormData(registrationForm);
  const body = {
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(body);
  // HTTP POST request
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // API checks request
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Registration failed");

    // if successful, alert and redirect
    setPopup("confirm-popup", "You have successfully signed up!", [
      {
        text: "Sign in",
        class: "primary-button",
        href: "../account/login.html",
      },
      { text: "Home", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  } catch (error) {
    setPopup("warning-popup", error.message, [
      {
        text: "Sign in",
        class: "primary-button",
        href: "../account/login.html",
      },
      { text: "back", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}
