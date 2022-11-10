async function createServer() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["serverForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["serverForm"]["name"].value = jsonData.name;
    document.forms["serverForm"]["key"].value = jsonData.key;
    document.forms["serverForm"]["guildId"].value = jsonData.guildId;
    document.forms["serverForm"]["roleId"].value = jsonData.roleId;
    document.forms["serverForm"]["mainbot"].value = jsonData.botName;
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PUT", "https://api.discord.repair/v1/server");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
  if (FD.get("vpnCheck") == "") {
    FD.delete("vpnCheck");
  }
  if (FD.get("webhook") == "") {
    FD.delete("webhook");
  }
  if (FD.get("roleId") == "") {
    FD.delete("roleId");
  }
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function modifyServer() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["serverForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/server/" + FD.get("key"));
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
  if (FD.get("vpnCheck") == "") {
    FD.delete("vpnCheck");
  }
  if (FD.get("webhook") == "") {
    FD.delete("webhook");
  }
  if (FD.get("roleId") == "") {
    FD.delete("roleId");
  }
  if (FD.get("name") == "") {
    FD.delete("name");
  }
  if (FD.get("guildId") == "") {
    FD.delete("guildId");
  }
  if (FD.get("mainbot") == "") {
    FD.delete("mainbot");
  }
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function deleteServer() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["serverForm"]["name"].value;
  console.log(form);
  if (form == null || form.length == 0) {
    return;
  }
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("DELETE", "https://api.discord.repair/v1/server/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getServer() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["serverForm"]["name"].value;
  if (form == null || form.length == 0) {
    form = document.forms["serverForm"]["key"].value;
    if (form == null || form.length == 0) {
      return;
    }
  }
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["serverForm"]["name"].value = jsonData.name;
    document.forms["serverForm"]["key"].value = jsonData.key;
    document.forms["serverForm"]["guildId"].value = jsonData.guildId;
    document.forms["serverForm"]["webhook"].value = jsonData.webhook;
    document.forms["serverForm"]["roleId"].value = jsonData.roleId;
    document.forms["serverForm"]["vpnCheck"].value = jsonData.vpnCheck;
    document.forms["serverForm"]["mainbot"].value = jsonData.mainBotName;
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/server/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getServers() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["serverForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var display = "";
    var servers = JSON.parse(event.target.responseText);
    servers.forEach(AddServerInfo);
    function AddServerInfo(server) {
      display += server.name + " : " + server.key + "\n";
    }
    if (display == "") {
      alert("No servers found");
    } else {
      navigator.clipboard.writeText(display);
      alert(
        "Open a text editor and paste the text to view a full list of your servers."
      );
    }
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/server");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}
