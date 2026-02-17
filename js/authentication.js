const isLoggedIn = Boolean(localStorage.getItem("token"));

// Nav-bar

async function authNav() {
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

authNav();
