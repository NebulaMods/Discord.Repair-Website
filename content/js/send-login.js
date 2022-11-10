window.addEventListener("load", async () => {
  var loggedIn = window.sessionStorage.getItem("Authorization");
  if (loggedIn != null) {
    window.location.replace("https://discord.repair/dashboard/index.html");
    return;
  }

  // Get the form element
  const form = document.getElementById("myForm");

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
  var captchaCode = grecaptcha.getResponse();
  // //Add extra data to form before submission.
  FD.append("captchaCode", captchaCode);
  // Define what happens on successful data submission
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      sessionStorage.setItem("Authorization", jsonData.details);
      getUserInfo(jsonData.details);
      //
      return;
    } else {
      alert(jsonData.details);
      grecaptcha.reset();
      return;
    }
    //alert(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    alert("Oops! Something went wrong.");
    grecaptcha.reset();
  });

  // Set up our request
  XHR.open("POST", "https://api.discord.repair/v1/user/token", true);
  XHR.setRequestHeader("Content-Type", "application/json");
  var json = JSON.stringify(Object.fromEntries(FD));
  var jsonRequest = JSON.parse(json);
  var byteArr = str2ByteArr(jsonRequest.password);
  jsonRequest.password = arrayBufferToBase64(byteArr);
  // The data sent is what the user provided in the form
  XHR.send(JSON.stringify(jsonRequest));
}

async function getUserInfo(authToken) {
  var XHR = new XMLHttpRequest();
  //var authToken = window.sessionStorage.getItem("Authorization");
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    window.sessionStorage.setItem("PFP", jsonData.pfp);
    window.sessionStorage.setItem("AccountType", jsonData.accountType);
    window.location.replace("https://discord.repair/dashboard/index.html");
  });
  XHR.addEventListener("error", (event) => {
    console.log(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader("Authorization", authToken);
  XHR.send();
}
function str2ByteArr(str) {
  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
    bytes.push(0);
  }
  return bytes;
}
function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
