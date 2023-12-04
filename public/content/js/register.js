window.addEventListener("load", () => {
  // Get the form element
});

async function sendData() {
  const form = document.getElementById("registerForm");
  const XHR = new XMLHttpRequest();
  // Bind the FormData object and the form element
  const FD = new FormData(form);
  let captchaCode = grecaptcha.getResponse();
  //Add extra data to form before submission.
  FD.append("captchaCode", captchaCode);
  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {
    console.log(event);
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null || jsonData.success == "undefined") {
      window.location.replace(
        `${location.protocol}//${window.location.hostname}/login.html`
      );
      return;
    } else {
      grecaptcha.reset();
      form.reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (error) => {
    console.log(error);
    grecaptcha.reset();
    form.reset();
    ToggleErrorModal(error.target.responseText);
  });

  // Set up our request
  XHR.open("PUT", "https://api.discord.repair/v1/user");
  XHR.setRequestHeader("Content-Type", "application/json");
  if (FD.get("password") != FD.get("passwordCheck")) {
    ToggleErrorModal("Passwords do not match!");
    return;
  }
  FD.delete("passwordCheck");
  let json = JSON.stringify(Object.fromEntries(FD));
  //console.log(json);
  const jsonRequest = JSON.parse(json);
  let byteArr = str2ByteArr(jsonRequest.password);
  jsonRequest.password = arrayBufferToBase64(byteArr);
  // The data sent is what the user provided in the form
  json = JSON.stringify(jsonRequest);
  console.log(json);
  XHR.send(json);
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
