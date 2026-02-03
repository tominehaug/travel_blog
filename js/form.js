const options = {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9taW5lIiwiZW1haWwiOiJ0b21yb2UwMzY1NEBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTc3MDEwOTE3MX0.K32oYTVpuvHL0xvg6EBPCzBy8kkDFXtMVZSc2G30QfQ",
    "X-Noroff-API-Key": "dda2524b-a812-416c-86fe-d71285aa801e",
  },
};

const response = await fetch(
  `${NOROFF_API_URL}/blog/posts/${username}`,
  options,
);
const data = await response.json();
