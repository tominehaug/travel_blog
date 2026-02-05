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
      isValid = false;
    } else {
      errorDiv.textContent = "";
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

async function handleRegistration(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  let pwd = document.getElementById("password");
  let rpass = document.getElementById("repeatpass");

  const body = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(body);
}
