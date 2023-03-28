window.addEventListener("load", async () => {
  await GetBotsAsync();
});

async function createBot() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["createBotForm"];
  const FD = new FormData(form);
  if (
    FD.get("name") == "" ||
    FD.get("clientSecret") == "" ||
    FD.get("clientId") == "" ||
    FD.get("token") == ""
  ) {
    ToggleErrorModal("Please fill out all the required fills.");
    return;
  }
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      document.forms["createBotForm"].reset();
      await GetBotsAsync();
      ToggleSuccessModal("successfully created bot.");
      return;
    }
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["createBotForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("PUT", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  //const botType = FD.get("botType");
  //if (botType == "undefined" || botType == null || botType == "")
  FD.set("botType", "EVERYTHING");
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function ModifyBotAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyBotForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await GetBotsAsync();
      ToggleModifyModal("");
      ToggleSuccessModal(jsonData.details);
      return;
    }
    ToggleModifyModal("");
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleModifyModal("");
    ToggleErrorModal(event.target.responseText);
  });
  const botKey = document.getElementById("cus_modifyKey");
  XHR.open("PATCH", "https://api.discord.repair/v1/custom-bot/" + botKey.value);
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  if (FD.get("name") == "") {
    FD.delete("name");
  }
  if (FD.get("token") == "") {
    FD.delete("token");
  }
  if (FD.get("clientSecret") == "") {
    FD.delete("clientSecret");
  }
  if (FD.get("clientId") == "") {
    FD.delete("clientId");
  }
  if (FD.get("botType") == "") {
    FD.delete("botType");
  }
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function DeleteBotAsync(bot) {
  if (bot == null || bot == "" || bot == "undefined") {
    ToggleErrorModal("No bot name specified");
    return;
  }
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await GetBotsAsync();
      ToggleDeleteModal();
      ToggleSuccessModal(jsonData.details);
      return;
    }
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("DELETE", "https://api.discord.repair/v1/custom-bot/" + bot);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetBotAsync(bot) {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    document.forms["modifyBotForm"].reset();
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      document.forms["modifyBotForm"]["name"].value = jsonData.name;
      document.forms["modifyBotForm"]["key"].value = jsonData.key;
      document.forms["modifyBotForm"]["token"].value = jsonData.token;
      document.forms["modifyBotForm"]["clientSecret"].value =
        jsonData.clientSecret;
      document.forms["modifyBotForm"]["clientId"].value = jsonData.clientId;
      //document.forms["modifyBotForm"]["botType"].value = jsonData.botType;
      return;
    }
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot/" + bot);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetBotsAsync() {
  document.getElementById("allBots").innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      jsonData.forEach(AddBotInfo);
      function AddBotInfo(bot, index) {
        let table = document.getElementById("allBots");
        let row = table.insertRow(index);

        let name = row.insertCell(0);
        name.innerHTML = bot.name;
        let clientSecret = row.insertCell(1);
        clientSecret.innerHTML = bot.clientSecret;
        let clientId = row.insertCell(2);
        clientId.innerHTML = bot.clientId;
        let token = row.insertCell(3);
        token.innerHTML = bot.token;
        name.classList.add("text-left", "py-3", "px-4");
        clientSecret.classList.add("text-left", "py-3", "px-4");
        clientId.classList.add("text-left", "py-3", "px-4");
        token.classList.add("text-left", "py-3", "px-4");
        let options = row.insertCell(4);
        let modifyLink = document.createElement("a");
        let deleteLink = document.createElement("a");
        let modifyIcon = document.createElement("i");
        let deleteIcon = document.createElement("i");
        //
        deleteLink.href = `javascript:ToggleDeleteModal('${bot.name}');`;
        //
        modifyLink.href = `javascript:ToggleModifyModal('${bot.name}')`;
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
      }
      return;
    }
    if (jsonData.details == "no bots exist, please try again.") return;
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

function ToggleDeleteModal(bot) {
  const modal = document.getElementById("deleteModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (bot == null || bot == "" || bot == "undefined") {
    return;
  }
  const deleteButton = document.getElementById("deleteBotButton");
  const deleteText = document.getElementById("deleteModalText");
  deleteText.innerText = `Are you sure you want to delete: ${bot}`;
  deleteButton.setAttribute("onclick", `javascript:DeleteBotAsync('${bot}');`);
}

function ToggleModifyModal(bot) {
  const modal = document.getElementById("modifyModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (bot == null || bot == "" || bot == "undefined") {
    return;
  }
  GetBotAsync(bot);

  const modifyButton = document.getElementById("modifyBotButton");
  modifyButton.setAttribute("onclick", `javascript:ModifyBotAsync('${bot}');`);
}
