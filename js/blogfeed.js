const username = localStorage.getItem("username");
const blogOwner = username || "tomine";

let allPosts = [];

async function fetchPosts() {
  try {
    const response = await fetch(
      `https://api.noroff.dev/v2/blog/posts/${blogOwner}`,
    );
    if (!response.ok)
      throw new Error(data.errors?.[0]?.message || "Failed network response");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Something went wrong" + error);
    setPopup("warning-popup", error.message, [
      { text: "OK", class: "cancel-button", onClick: hidePopup },
    ]);
    showPopup();
  }
}

async function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const link = document.createElement("a");
    link.href = `https://api.noroff.dev/v2/blog/posts/${post.id}`;

    const thumbnail = document.createElement("img");
    thumbnail.src = post.media.url;
    thumbnail.alt = post.media.alt;

    const titleDiv = document.createElement("div");
    titleDiv.textContent = post.title;
    titleDiv.classList.add("thumbnail");

    link.appendChild(thumbnail);
    link.appendChild(titleDiv);
    container.appendChild(link);
  });
}

async function init() {
  allPosts = await fetchPosts();
  if (!allPosts) return;

  displayPosts(allPosts);
}

init();
