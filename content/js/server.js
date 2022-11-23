window.addEventListener("load", () => {
  getServers();
});

async function createServer() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["createServerForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["createServerForm"]["name"].value = jsonData.name;
    document.forms["createServerForm"]["key"].value = jsonData.key;
    document.forms["createServerForm"]["guildId"].value = jsonData.guildId;
    document.forms["createServerForm"]["roleId"].value = jsonData.roleId;
    document.forms["createServerForm"]["mainbot"].value = jsonData.botName;
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
  var form = document.forms["modifyServerForm"];
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
  var form = document.forms["deleteServerForm"]["name"].value;
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
  var form = document.forms["modifyServerForm"]["name"].value;
  if (form == null || form.length == 0) {
    form = document.forms["modifyServerForm"]["key"].value;
    if (form == null || form.length == 0) {
      return;
    }
  }
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["modifyServerForm"]["name"].value = jsonData.name;
    document.forms["modifyServerForm"]["key"].value = jsonData.key;
    document.forms["modifyServerForm"]["guildId"].value = jsonData.guildId;
    document.forms["modifyServerForm"]["webhook"].value = jsonData.webhook;
    document.forms["modifyServerForm"]["roleId"].value = jsonData.roleId;
    document.forms["modifyServerForm"]["vpnCheck"].value = jsonData.vpnCheck;
    document.forms["modifyServerForm"]["mainbot"].value = jsonData.mainBotName;
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
  XHR.addEventListener("load", (event) => {
    var servers = JSON.parse(event.target.responseText);
    servers.forEach(AddServerInfo);
    function AddServerInfo(server, index) {
      var table = document.getElementById("allServers");
      var row = table.insertRow(index);

      var name = row.insertCell(0);
      name.innerHTML = server.name;
      var guildId = row.insertCell(1);
      guildId.innerHTML = server.guildId;
      var roleId = row.insertCell(2);
      roleId.innerHTML = server.roleId;
      var customBot = row.insertCell(3);
      customBot.innerHTML = server.mainBotName;
      var vpnCheck = row.insertCell(4);
      vpnCheck.innerHTML = server.vpnCheck;
      var webhook = row.insertCell(5);
      webhook.innerHTML = server.webhook;
      var key = row.insertCell(6);
      key.innerHTML = server.key;
      name.classList.add("w-1/3", "text-left", "py-3", "px-4");
      guildId.classList.add("w-1/3", "text-left", "py-3", "px-4");
      roleId.classList.add("w-1/3", "text-left", "py-3", "px-4");
      customBot.classList.add("w-1/3", "text-left", "py-3", "px-4");
      vpnCheck.classList.add("w-1/3", "text-left", "py-3", "px-4");
      webhook.classList.add("w-1/3", "text-left", "py-3", "px-4");
      key.classList.add("w-1/3", "text-left", "py-3", "px-4");
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
  XHR.send();
}

async function sendVerifyMessage() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["verifyMessageForm"];
  var formData = new FormData(form);

  XHR.addEventListener("load", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json.details);
  });

  XHR.addEventListener("error", (event) => {
    var json = JSON.parse(event.target.responseText);
    alert(json.details);
  });

  XHR.open(
    "POST",
    "https://api.discord.repair/v1/server/" +
      formData.get("server") +
      "/" +
      formData.get("channelId") +
      "/message"
  );
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.setRequestHeader("Content-Type", "application/json");
  let json = {
    text: formData.get("text"),
    verifyMessage: {
      embedColour: formData.get("embedColour"),
      imageUrl: formData.get("imageUrl"),
      embedDescription: formData.get("embedDescription"),
    },
    isTts: false,
  };

  XHR.send(JSON.stringify(json));
}
