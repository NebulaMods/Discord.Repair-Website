window.addEventListener("DOMContentLoaded", async () => {
  await GetBackupsAsync();
  await GetBotsAsync();
  await GetServersAsync();
});

async function GetBackupsAsync() {
  document.getElementById("allBackups").innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      jsonData.forEach(AddBackupInfo);
      function AddBackupInfo(backup, index) {
        let table = document.getElementById("allBackups");
        let row = table.insertRow(index);

        let name = row.insertCell(0);
        name.innerHTML = backup.name;
        let backupType = row.insertCell(1);
        backupType.innerHTML = backup.type;
        let creationTime = row.insertCell(2);
        creationTime.innerHTML = backup.creationTime;
        let guildId = row.insertCell(3);
        guildId.innerHTML = backup.guildId;
        let emojiCount = row.insertCell(4);
        emojiCount.innerHTML = backup.emojiCount;
        let stickerCount = row.insertCell(5);
        stickerCount.innerHTML = backup.stickerCount;
        let messageCount = row.insertCell(6);
        messageCount.innerHTML = backup.messageCount;
        let roleCount = row.insertCell(7);
        roleCount.innerHTML = backup.roleCount;
        let userRoleCount = row.insertCell(8);
        userRoleCount.innerHTML = backup.userRoleCount;
        let channelCount = row.insertCell(9);
        channelCount.innerHTML = backup.channelCount;

        name.classList.add("text-left", "py-3", "px-4");
        backupType.classList.add("text-left", "py-3", "px-4");
        creationTime.classList.add("text-left", "py-3", "px-4");
        guildId.classList.add("text-left", "py-3", "px-4");
        emojiCount.classList.add("text-left", "py-3", "px-4");
        stickerCount.classList.add("text-left", "py-3", "px-4");
        messageCount.classList.add("text-left", "py-3", "px-4");
        roleCount.classList.add("text-left", "py-3", "px-4");
        userRoleCount.classList.add("text-left", "py-3", "px-4");
        channelCount.classList.add("text-left", "py-3", "px-4");
      }
      return;
    }
    if (jsonData.details == "no backups") return;
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/backup");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function BackupAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["backupForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      document.forms["backupForm"].reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["backupForm"].reset();
    await GetBackupsAsync();
    ToggleSuccessModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["backupForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("PUT", "https://api.discord.repair/v1/backup");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  const serverComboBox = document.getElementById("backupSelectServer");
  const serverSelectedOption =
    serverComboBox.options[serverComboBox.selectedIndex].text;
  if (
    serverSelectedOption == "" ||
    serverSelectedOption == null ||
    serverSelectedOption == "undefined" ||
    serverSelectedOption == "N/A"
  ) {
    FD.delete("serverName");
  }
  const botComboBox = document.getElementById("backupSelectBot");
  const botSelectedOption = botComboBox.options[botComboBox.selectedIndex].text;
  if (
    botSelectedOption == "" ||
    botSelectedOption == null ||
    botSelectedOption == "undefined" ||
    botSelectedOption == "N/A"
  ) {
    FD.delete("botName");
  }
  const typeComboBox = document.getElementById("backupType");
  const typeSelectedOption =
    typeComboBox.options[typeComboBox.selectedIndex].text;
  if (typeSelectedOption == "User Roles *Includes Roles*") {
    FD.set("type", "USER_ROLES");
  } else if (typeSelectedOption == "Messages *Includes Channels*") {
    FD.set("type", "MESSAGES");
  }
  if (
    (FD.get("serverName") == "undefined" || FD.get("serverName") == null) &&
    (FD.get("botName") == "undefined" || FD.get("botName") == null)
  ) {
    ToggleErrorModal(
      "Please select a valid server or bot in order to start a backup."
    );
    return;
  }
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function GetServersAsync() {
  const serverCombobox = document.getElementById("backupSelectServer");
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
    const nullOption = document.createElement("option");
    nullOption.innerText = "N/A";
    serverCombobox.appendChild(nullOption);
    jsonData.forEach(AddServerInfo);
    function AddServerInfo(server) {
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

async function GetBotsAsync() {
  const botCombobox = document.getElementById("backupSelectBot");
  botCombobox.innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      if (jsonData.details == "no bots exist, please try again.") return;
      console.log(jsonData);
      ToggleErrorModal(jsonData.details);
      return;
    }
    const nullOption = document.createElement("option");
    nullOption.innerText = "N/A";
    botCombobox.appendChild(nullOption);
    jsonData.forEach(AddBotInfo);
    function AddBotInfo(bot) {
      const newOption = document.createElement("option");
      newOption.innerText = bot.name;
      botCombobox.appendChild(newOption);
    }
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
