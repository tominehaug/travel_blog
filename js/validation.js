export function validateForm(event, form) {
  event.preventDefault();

  let isValid = true;
  const inputs = Array.from(form.querySelectorAll("input, textarea"));

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
  return isValid;
}
