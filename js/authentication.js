const isLoggedIn = Boolean(localStorage.getItem("token"));

if (isLoggedIn) {
  document.getElementById("nav-button").style.display = "none";
} else {
  document.getElementById("nav-button").style.display = "block";
}
