const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", validateForm);

async function validateForm(event) {
  event.preventDefault();

  let isValid = true;
  const inputs = Array.from(createForm.querySelectorAll("input, textarea"));

  inputs.forEach((input) => {
    const errorDiv = input.nextElementSibling;

    // validate file input
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
  const formData = new FormData(createForm);

  const body = {
    title: formData.get("title"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
}
