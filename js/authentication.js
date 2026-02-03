const isLoggedIn = Boolean(localStorage.getItem("token"));

if (isLoggedIn) {
  document.getElementById("nav-button").style.display = "block";
} else {
  document.getElementById("nav-button").style.display = "none";
}
