const username = localStorage.getItem("username");
const blogOwner = username || "tomine";

fetch(`https://api.noroff.dev/v2/blog/posts/${blogOwner}`);
