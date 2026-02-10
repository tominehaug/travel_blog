const popup = document.getElementById("popup");
const backdrop = document.getElementById("popup-backdrop");
const messageDiv = document.getElementById("popup-message");
const actionsDiv = document.getElementById("popup-actions");
const popupContainer = document.querySelector(".popup");

// function that removes .hidden, shows popup
export function showPopup() {
  popup.classList.remove("hidden");
  backdrop.classList.remove("hidden");
}
// function that adds .hidden, closes popup
export function hidePopup() {
  popup.classList.add("hidden");
  backdrop.classList.add("hidden");
}
// function that adds type for styling, message for content, buttons for actions
export function setPopup(type, message, actions = []) {
  messageDiv.innerHTML = "";
  messageDiv.textContent = message;

  popup.classList.remove("warning-popup", "confirm-popup", "error-popup");
  popup.classList.add(type);

  actionsDiv.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.textContent = action.text;
    button.className = action.class;

    if (action.href) {
      button.addEventListener("click", () => {
        window.location.href = action.href;
      });
    }

    if (action.onClick) {
      button.addEventListener("click", action.onClick);
    }

    actionsDiv.appendChild(button);
  });
}
