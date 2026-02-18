const isLoggedIn = Boolean(localStorage.getItem("token"));

// HEADER

async function authHeader() {
  const loggedOutBtn = document.querySelector(".logged-out");
  const loggedInBtn = document.querySelector(".logged-in");
  const username = localStorage.getItem("username");

  if (isLoggedIn) {
    loggedOutBtn.classList.add("hidden");
    loggedInBtn.classList.remove("hidden");
    const button = loggedInBtn.querySelector("span");
    button.textContent = username;
  } else {
    loggedOutBtn.classList.remove("hidden");
    loggedInBtn.classList.add("hidden");
  }
}

authHeader();

async function openNav() {
  const button = document.querySelector(".dropdown-btn");
  const nav = document.querySelector("nav");

  button.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

openNav();

// Sign out

const signOutBtn = document.getElementById("sign-out");

function removeLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

signOutBtn.addEventListener("click", () => {
  removeLogin();
  console.log(localStorage);
  window.location.href = "index.html";
});
