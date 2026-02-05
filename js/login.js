let isLoggedIn = false;

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", handleLogin);

async function handleLogin(event) {
  event.preventDefault();

  // collect login data
  const formData = new FormData(event.target);
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(body);

  // HTTP POST request
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // API checks if user exists
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Login failed");

    function saveLogin(user) {
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("username", user.name);
    }
    saveLogin(data.data);
    window.location.href = "../index.html";
  } catch (error) {
    console.error("login failed:" + error);
    //document.getElementById("loginMessage").textContent = error.message;
  }
}
