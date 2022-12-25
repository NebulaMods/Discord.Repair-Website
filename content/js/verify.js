document.addEventListener("DOMContentLoaded", async () => {
  //GetVerifyPage();
});

async function VerifyUser() {
  const XHR = new XMLHttpRequest();
  let captchaCode = grecaptcha.getResponse();
  XHR.addEventListener("load", (event) => {
    let successVerify = document.getElementById("successfulVerify");
    let verifyForm = document.getElementById("verifyForm");
    verifyForm.style.display = "none";
    successVerify.style.display = "block";
  });
  XHR.addEventListener("error", (error) => {
    let jsonData = JSON.parse(error.target.responseText);
    alert(jsonData.details);
  });
  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  let state = urlParams.get("state");
  let url =
    "https://api.discord.repair/v1/discord-user/link?code=" +
    code +
    "&state=" +
    state;
  if (captchaCode != null || captchaCode != "") {
    url += "&captcha=" + captchaCode;
  }
  XHR.open("GET", url);
  XHR.send();
}

async function GetVerifyPage() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    console.log(jsonData);
  });
  XHR.addEventListener("error", (error) => {
    let jsonData = JSON.parse(error.target.responseText);
    alert(jsonData.details);
  });
  let urlParams = new URLSearchParams(window.location.search);
  let state = urlParams.get("state");
  XHR.open("GET", "https://api.discord.repair/v1/server/" + state);
  XHR.send();
}
