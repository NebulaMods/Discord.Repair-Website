document.addEventListener("DOMContentLoaded", async () => {
  //GetVerifyPage();
  VerifyUser();
  ToggleVerifyOptions();
});

async function VerifyUser() {
  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  let state = urlParams.get("state");
  if (code == "" || code == null || state == "" || state == null) {
    ToggleErrorModal(
      "The parameters are missing to correctly identify the user and/or server."
    );
    return;
  }
  const XHR = new XMLHttpRequest();
  let captchaCode = grecaptcha.getResponse();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    history.pushState(null, null, window.location.pathname);
    const hiddenDiv = document.getElementById("hiddenDiv");
    hiddenDiv.classList.toggle("hidden");
    ToggleSuccessModal();
  });
  XHR.addEventListener("error", (error) => {
    let jsonData = JSON.parse(error.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
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

function ToggleVerifyOptions() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  if (code == "" || code == null || state == "" || state == null) return;
  const hiddenDiv = document.getElementById("hiddenDiv");
  hiddenDiv.classList.toggle("hidden");
}

function ToggleErrorModal(error) {
  const modal = document.getElementById("errorModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  const errorText = document.getElementById("errorModalText");
  errorText.innerText = error;
}

function ToggleSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
}
