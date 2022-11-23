async function migrateViaServerUsers() {
  const XHR = new xmlHttpRequest();
  var form = document.forms["migrateViaServerForm"];
  var formData = new FormData(form);

  XHR.addEventListener("load", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json);
  });

  XHR.addEventListener("error", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json.details);
  });
  var url =
    "https://api.discord.repair/v1/server/" +
    formData.get("name") +
    "/migrate/" +
    formData.get("guildId");
  if (formData.get("userId") != null) {
    url += "?userId=" + formData.get("userId");
  }
  if (formData.get("verifyRoleId") != null) {
    if (formData.get("userId") != null) {
      url += "&verifyRoleId=" + formData.get("verifyRoleId");
    } else {
      url += "?verifyRoleId=" + formData.get("verifyRoleId");
    }
  }
  XHR.open("POST", url);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function migrateViaBotUsers() {
  const XHR = new xmlHttpRequest();
  var form = document.forms["migrateViaBotForm"];
  var formData = new FormData(form);

  XHR.addEventListener("load", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json);
  });

  XHR.addEventListener("error", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json.details);
  });
  var url =
    "https://api.discord.repair/v1/server/" +
    formData.get("name") +
    "/migrate/" +
    formData.get("guildId");
  if (formData.get("userId") != null) {
    url += "?userId=" + formData.get("userId");
  }
  if (formData.get("verifyRoleId") != null) {
    if (formData.get("userId") != null) {
      url += "&verifyRoleId=" + formData.get("verifyRoleId");
    } else {
      url += "?verifyRoleId=" + formData.get("verifyRoleId");
    }
  }
  XHR.open("POST", url);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
