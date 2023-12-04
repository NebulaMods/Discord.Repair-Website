window.addEventListener("load", async () => {
  getUser();
});

async function updateUser() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["accountSettingsForm"];
  let formData = new FormData(form);
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    //profile picture
    ToggleSuccessModal("successfully updated your account.");
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.setRequestHeader("Content-Type", "application/json");
  formData.delete("membershipExpiry");
  formData.delete("accountType");
  formData.delete("apiToken");
  let jsonData = JSON.stringify(formData);
  XHR.send(jsonData);
}

async function changeUserPassword() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["passwordSettingsForm"];
  let formData = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    window.sessionStorage.removeItem("Authorization");
    window.sessionStorage.setItem("Authorization", jsonData.details);
    await getUser();
    ToggleSuccessModal("successfully updated your password.");
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.setRequestHeader("Content-Type", "application/json");
  if (formData.get("newPassword") != formData.get("newPasswordCheck")) {
    ToggleErrorModal("Passwords do not match, please try again.");
  }
  formData.delete("newPasswordCheck");
  //base64 password
  formData.set("newPassword", str2ByteArr(formData.get("newPassword")));
  let jsonData = JSON.stringify(formData);
  XHR.send(jsonData);
}

async function getUser() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["accountSettingsForm"]["username"].value = jsonData.username;
    document.forms["accountSettingsForm"]["email"].value = jsonData.email;
    document.forms["accountSettingsForm"]["accountType"].value =
      jsonData.accountType;
    document.forms["accountSettingsForm"]["apiToken"].value = jsonData.apiToken;
    document.forms["accountSettingsForm"]["discordId"].value =
      jsonData.discordId;
    document.forms["accountSettingsForm"]["pfp"].value = jsonData.pfp;
    document.forms["accountSettingsForm"]["membershipExpiry"].value =
      jsonData.expiry;
    //expiry
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
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
  if (error || error !== null || error !== "" || error !== "undefined") {
    const errorText = document.getElementById("errorModalText");
    errorText.innerText = error;
  }
}

function ToggleSuccessModal(message) {
  const modal = document.getElementById("successModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (
    message ||
    message !== null ||
    message !== "" ||
    message !== "undefined"
  ) {
    const successText = document.getElementById("successModalText");
    successText.innerText = message;
  }
}
