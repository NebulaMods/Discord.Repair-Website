window.addEventListener("load", async () => {
  await GetServersAsync();
  await GetBotsAsync();
});

async function CreateServerAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["createServerForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      document.forms["createServerForm"].reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["createServerForm"].reset();
    await GetServersAsync();
    ToggleSuccessModal("Successfully created server.");
  });
  XHR.addEventListener("error", (event) => {
    document.forms["createServerForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("PUT", "https://api.discord.repair/v1/server");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  if (FD.get("vanityURL") == "") {
    FD.delete("vanityURL");
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
  const vpnCheck = document.getElementById("cus_createVpnCheck").checked;
  if (vpnCheck) {
    FD.set("vpnCheck", "true");
  } else {
    FD.set("vpnCheck", "false");
  }
  const captchaCheck = document.getElementById(
    "cus_createCaptchaCheck"
  ).checked;
  if (captchaCheck) {
    FD.set("captchaCheck", "true");
  } else {
    FD.set("captchaCheck", "false");
  }
  const comboBox = document.getElementById("createServerSelectBot");
  const selectedOption = comboBox.options[comboBox.selectedIndex].text;
  if (
    selectedOption == "" ||
    selectedOption == null ||
    selectedOption == "undefined"
  ) {
    ToggleErrorModal("Please select a valid bot in order to create a server.");
  }
  FD.set("mainBot", selectedOption);
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function ModifyServerAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyServerForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await GetServersAsync();
      ToggleModifyModal("");
      ToggleSuccessModal(jsonData.details);
      return;
    }
    document.forms["modifyServerForm"].reset();
    ToggleModifyModal("");
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyServerForm"].reset();
    ToggleModifyModal("");
    ToggleErrorModal(event.target.responseText);
  });
  const serverKey = document.getElementById("cus_modifyKey");
  XHR.open("PATCH", "https://api.discord.repair/v1/server/" + serverKey.value);
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  // if (FD.get("vanityURL") == "") {
  FD.delete("vanityURL");
  // }
  const vpnCheck = document.getElementById("cus_modifyVpnCheck").checked;
  if (vpnCheck) {
    FD.set("vpnCheck", "true");
  } else {
    FD.set("vpnCheck", "false");
  }
  const captchaCheck = document.getElementById(
    "cus_modifyCaptchaCheck"
  ).checked;
  if (captchaCheck) {
    FD.set("captchaCheck", "true");
  } else {
    FD.set("captchaCheck", "false");
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
  const comboBox = document.getElementById("modifyServerSelectBot");
  const selectedOption = comboBox.options[comboBox.selectedIndex].text;
  if (
    selectedOption == "" ||
    selectedOption == null ||
    selectedOption == "undefined"
  ) {
    ToggleErrorModal("Please select a valid bot in order to modify a server.");
  }
  FD.set("mainBot", selectedOption);
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function DeleteServerAsync(server) {
  const XHR = new XMLHttpRequest();

  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await GetServersAsync();
      ToggleDeleteModal("");
      return;
    }
    ToggleDeleteModal("");
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleDeleteModal("");
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("DELETE", "https://api.discord.repair/v1/server/" + server);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetServerAsync(server) {
  const modifyComboBox = document.getElementById("modifyServerSelectBot");
  const createComboBox = document.getElementById("createServerSelectBot");
  modifyComboBox.innerHTML = createComboBox.innerHTML;
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      document.forms["modifyServerForm"].reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["modifyServerForm"].reset();
    document.forms["modifyServerForm"]["name"].value = jsonData.name;
    document.forms["modifyServerForm"]["key"].value = jsonData.key;
    document.forms["modifyServerForm"]["guildId"].value = jsonData.guildId;
    document.forms["modifyServerForm"]["webhook"].value = jsonData.webhook;
    document.forms["modifyServerForm"]["roleId"].value = jsonData.roleId;
    document.forms["modifyServerForm"]["vpnCheck"].checked = jsonData.vpnCheck;
    //
    document.forms["modifyServerForm"]["captchaCheck"].checked =
      jsonData.captcha;
    //
    document.forms["modifyServerForm"]["verifyBGImage"].value =
      jsonData.backgroundImage;
    document.forms["modifyServerForm"]["vanityURL"].value = jsonData.vanityUrl;
    for (var i = 0; i < modifyComboBox.options.length; i++) {
      if (modifyComboBox.options[i].textContent === jsonData.mainBotName) {
        modifyComboBox.selectedIndex = i;
        break;
      }
    }
    //modifyComboBox.value = jsonData.mainBotName;
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyServerForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/server/" + server);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetServersAsync() {
  document.getElementById("allServers").innerHTML = "";
  const serverCombobox = document.getElementById("verifyMessageSelectServer");
  serverCombobox.innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      if (jsonData.details == "no servers exist, please try again.") return;
      console.log(jsonData);
      ToggleErrorModal(jsonData.details);
      return;
    }
    jsonData.forEach(AddServerInfo);
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
      let options = row.insertCell(7);
      let modifyLink = document.createElement("a");
      let deleteLink = document.createElement("a");
      let modifyIcon = document.createElement("i");
      let deleteIcon = document.createElement("i");
      //
      deleteLink.href = `javascript:ToggleDeleteModal('${server.name}');`;
      //
      modifyLink.href = `javascript:ToggleModifyModal('${server.name}');`;
      //
      deleteIcon.classList.add(
        "cursor-pointer",
        "fas",
        "fa-trash-alt",
        "text-red-600",
        "mx-2"
      );
      //
      modifyIcon.classList.add(
        "cursor-pointer",
        "fas",
        "fa-pencil-alt",
        "text-slate-700",
        "mx-2"
      );
      //
      options.classList.add("text-center");
      //
      deleteLink.appendChild(deleteIcon);
      modifyLink.appendChild(modifyIcon);
      options.appendChild(deleteLink);
      options.appendChild(modifyLink);
      const newOption = document.createElement("option");
      newOption.innerText = server.name;
      serverCombobox.appendChild(newOption);
    }
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
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
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    ToggleSuccessModal(jsonData.details);
  });

  XHR.addEventListener("error", (event) => {
    document.forms["verifyMessageForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  const comboBox = document.getElementById("verifyMessageSelectServer");
  const selectedOption = comboBox.options[comboBox.selectedIndex].text;
  if (
    selectedOption == "" ||
    selectedOption == null ||
    selectedOption == "undefined"
  ) {
    ToggleErrorModal(
      "Please select a valid server in order to send a message."
    );
  }
  formData.set("server", selectedOption);
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

function ToggleErrorModal(error) {
  const modal = document.getElementById("errorModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  const errorText = document.getElementById("errorModalText");
  errorText.innerText = error;
}

function ToggleSuccessModal(message) {
  const modal = document.getElementById("successModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  const successText = document.getElementById("successModalText");
  successText.innerText = message;
}

function ToggleDeleteModal(server) {
  const modal = document.getElementById("deleteModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (server == null || server == "" || server == "undefined") {
    return;
  }
  const deleteButton = document.getElementById("deleteServerButton");
  const deleteText = document.getElementById("deleteModalText");
  deleteText.innerText = `Are you sure you want to delete: ${server}`;
  deleteButton.setAttribute(
    "onclick",
    `javascript:DeleteServerAsync('${server}');`
  );
}

function ToggleModifyModal(server) {
  const modal = document.getElementById("modifyModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (server == null || server == "" || server == "undefined") {
    return;
  }
  GetServerAsync(server);

  const modifyButton = document.getElementById("modifyServerButton");
  modifyButton.setAttribute(
    "onclick",
    `javascript:ModifyServerAsync('${server}');`
  );
}

async function GetBotsAsync() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      const createComboBox = document.getElementById("createServerSelectBot");
      jsonData.forEach(AddBotInfo);
      function AddBotInfo(bot) {
        const newOption = document.createElement("option");
        newOption.innerText = bot.name;
        createComboBox.appendChild(newOption);
      }
      return;
    }
    if (jsonData.details == "no bots exist, please try again.") {
      ToggleErrorModal("No bots exist, please go make one first.");
      setTimeout(() => {
        window.location.replace(
          `${location.protocol}//${window.location.hostname}/dashboard/bots.html`
        );
      }, 3000);
      return;
    }
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
