window.addEventListener("load", async () => {
  let loggedIn = window.sessionStorage.getItem("Authorization");
  if (loggedIn != null) {
    window.location.replace(
      `${location.protocol}//${window.location.hostname}/dashboard/index.html`
    );
    return;
  }

  // Get the form element
  const form = document.getElementById("loginForm");

  // Add 'submit' event handler
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await SendLoginData(form);
  });
});

async function SendLoginData(form) {
  const XHR = new XMLHttpRequest();
  // Bind the FormData object and the form element
  const FD = new FormData(form);
  //captcha info
  let captchaCode = grecaptcha.getResponse();
  // //Add extra data to form before submission.
  FD.append("captchaCode", captchaCode);
  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      sessionStorage.setItem("Authorization", jsonData.details);
      getUserInfo(jsonData.details);
      //
      return;
    } else {
      grecaptcha.reset();
      form.reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
    //alert(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    grecaptcha.reset();
    form.reset();
    ToggleErrorModal(event.target.responseText);
  });

  // Set up our request
  XHR.open("POST", "https://api.discord.repair/v1/user/token", true);
  XHR.setRequestHeader("Content-Type", "application/json");
  let json = JSON.stringify(Object.fromEntries(FD));
  let jsonRequest = JSON.parse(json);
  let byteArr = str2ByteArr(jsonRequest.password);
  jsonRequest.password = arrayBufferToBase64(byteArr);
  // The data sent is what the user provided in the form
  XHR.send(JSON.stringify(jsonRequest));
}

async function getUserInfo(authToken) {
  let XHR = new XMLHttpRequest();
  //let authToken = window.sessionStorage.getItem("Authorization");
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    window.sessionStorage.setItem("PFP", jsonData.pfp);
    window.sessionStorage.setItem("AccountType", jsonData.accountType);
    window.location.replace(
      `${location.protocol}//${window.location.hostname}/dashboard/index.html`
    );
  });
  XHR.addEventListener("error", (event) => {
    console.log(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader("Authorization", authToken);
  XHR.send();
}
function str2ByteArr(str) {
  let bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
    bytes.push(0);
  }
  return bytes;
}
function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function ToggleErrorModal(error) {
  const modal = document.getElementById("errorModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  const errorText = document.getElementById("errorModalText");
  errorText.innerText = error;
}
