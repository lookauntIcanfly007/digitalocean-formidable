const imageTag = document.querySelector(".imageFromDigitalOcean");

const uploadFile = async () => {
  const formData = new FormData();
  const inputTag = document.querySelector(".input");
  const files = [...inputTag.files];
  files.forEach((file) => formData.append("images", file));
  const response = await fetch("http://localhost:3000/uploadFile", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log(data);
};

const fetchData = async () => {
  const apiUrlFromLs = localStorage.getItem("apiUrl");
  if (apiUrlFromLs) {
    console.log("yes");
  } else {
    window.location.href = "/api";
  }
};

fetchData();
