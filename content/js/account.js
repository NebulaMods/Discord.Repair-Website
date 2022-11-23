window.addEventListener("load", () => {
  getUser();
});

async function updateUser() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["accountSettingsForm"];
  var formData = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  var jsonData = JSON.stringify(formData);
  XHR.send(jsonData);
}

async function updateUserPassword() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["passwordSettingsForm"];
  var formData = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/user/@me/password");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  if (formData.get("newPassword") != formData.get("newPasswordCheck")) {
    alert("Passwords do not match, please try again.");
  }
  formData.delete("newPasswordCheck");
  //base64 password
  formData.set("newPassword", str2ByteArr(formData.get("newPassword")));
  var jsonData = JSON.stringify(formData);
  XHR.send(jsonData);
}

async function getUser() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
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
    console.log(jsonData);
    //expiry
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/@me");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
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
