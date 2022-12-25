window.addEventListener("load", async () => {
  getServers();
});

async function createServer() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["createServerForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      document.forms["createServerForm"].reset();
      await getServers();
      alert("successfully created server.");
      return;
    }
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["createServerForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open("PUT", "https://api.discord.repair/v1/server");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  if (FD.get("vpnCheck") == "") {
    FD.delete("vpnCheck");
  }
  if (FD.get("captchaCheck") == "") {
    FD.delete("captchaCheck");
  }
  if (FD.get("verifyBGImage") == "") {
    FD.delete("verifyBGImage");
  }
  if (FD.get("webhook") == "") {
    FD.delete("webhook");
  }
  if (FD.get("roleId") == "") {
    FD.delete("roleId");
  }
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function modifyServer() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyServerForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await getServers();
    }
    document.forms["modifyServerForm"].reset();
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyServerForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/server/" + FD.get("name"));
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
  FD.delete("vanityURL");
  if (FD.get("vpnCheck") == "") {
    FD.delete("vpnCheck");
  }
  if (FD.get("captchaCheck") == "") {
    FD.delete("captchaCheck");
  }
  if (FD.get("webhook") == "") {
    FD.delete("webhook");
  }
  if (FD.get("verifyBGImage") == "") {
    FD.delete("verifyBGImage");
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
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function deleteServer() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["deleteServerForm"]["name"].value;

  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await getServers();
    }
    document.forms["deleteServerForm"].reset();
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["deleteServerForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
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
  let form = document.forms["modifyServerForm"]["name"].value;
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      document.forms["modifyServerForm"].reset();
      document.forms["modifyServerForm"]["name"].value = jsonData.name;
      document.forms["modifyServerForm"]["key"].value = jsonData.key;
      document.forms["modifyServerForm"]["guildId"].value = jsonData.guildId;
      document.forms["modifyServerForm"]["webhook"].value = jsonData.webhook;
      document.forms["modifyServerForm"]["roleId"].value = jsonData.roleId;
      document.forms["modifyServerForm"]["vpnCheck"].value = jsonData.vpnCheck;
      document.forms["modifyServerForm"]["mainbot"].value =
        jsonData.mainBotName;
      document.forms["modifyServerForm"]["captchaCheck"].value =
        jsonData.captcha;
      document.forms["modifyServerForm"]["verifyBGImage"].value =
        jsonData.backgroundImage;
      document.forms["modifyServerForm"]["vanityURL"].value =
        jsonData.vanityUrl;
      return;
    }
    document.forms["modifyServerForm"].reset();
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyServerForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open("GET", "https://api.discord.repair/v1/server/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getServers() {
  document.getElementById("allServers").innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let servers = JSON.parse(event.target.responseText);
    if (servers.success == null) {
      servers.forEach(AddServerInfo);
      function AddServerInfo(server, index) {
        let table = document.getElementById("allServers");
        let row = table.insertRow(index);

        let name = row.insertCell(0);
        name.innerHTML = server.name;
        let guildId = row.insertCell(1);
        guildId.innerHTML = server.guildId;
        let roleId = row.insertCell(2);
        roleId.innerHTML = server.roleId;
        let customBot = row.insertCell(3);
        customBot.innerHTML = server.mainBotName;
        let vpnCheck = row.insertCell(4);
        vpnCheck.innerHTML = server.vpnCheck;
        let captchaCheck = row.insertCell(5);
        captchaCheck.innerHTML = server.captcha;
        let vanityUrl = row.insertCell(6);
        vanityUrl.innerHTML = server.vanityUrl;
        name.classList.add("text-left", "py-3", "px-4");
        guildId.classList.add("text-left", "py-3", "px-4");
        roleId.classList.add("text-left", "py-3", "px-4");
        customBot.classList.add("text-left", "py-3", "px-4");
        vpnCheck.classList.add("text-left", "py-3", "px-4");
        captchaCheck.classList.add("text-left", "py-3", "px-4");
        vanityUrl.classList.add("text-left", "py-3", "px-4");
      }
      return;
    }
    alert.details(servers.details);
  });
  XHR.addEventListener("error", (event) => {
    alert(
      "An error occurred while trying to fetch all of your servers, if this continues to occur please contact an admin."
    );
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
  let form = document.forms["verifyMessageForm"];
  let formData = new FormData(form);

  XHR.addEventListener("load", (event) => {
    let json = JSON.parse(event.target.responseText);
    alert(json.details);
  });

  XHR.addEventListener("error", (event) => {
    document.forms["verifyMessageForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
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
      title: formData.get("title"),
      footerText: formData.get("footerText"),
      footerIconUrl: formData.get("footerIconUrl"),
    },
    isTts: false,
  };

  XHR.send(JSON.stringify(json));
}
