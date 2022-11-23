window.addEventListener("load", () => {
  getBots();
});

async function createBot() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["createBotForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["createBotForm"]["name"].value = jsonData.name;
    document.forms["createBotForm"]["key"].value = jsonData.key;
    document.forms["createBotForm"]["token"].value = jsonData.token;
    document.forms["createBotForm"]["clientSecret"].value =
      jsonData.clientSecret;
    document.forms["createBotForm"]["clientId"].value = jsonData.clientId;
    document.forms["createBotForm"]["botType"].value = jsonData.botType;
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PUT", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
  if (FD.get("botType") == "") {
    FD.delete("botType");
  }
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function modifyBot() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["modifyBotForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open(
    "PATCH",
    "https://api.discord.repair/v1/custom-bot/" + FD.get("key")
  );
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
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
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function deleteBot() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["deleteBotForm"]["name"].value;
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
  XHR.open("DELETE", "https://api.discord.repair/v1/custom-bot/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getBot() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["modifyBotForm"]["name"].value;
  if (form == null || form.length == 0) {
    form = document.forms["modifyBotForm"]["key"].value;
    if (form == null || form.length == 0) {
      return;
    }
  }
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["modifyBotForm"]["name"].value = jsonData.name;
    document.forms["modifyBotForm"]["key"].value = jsonData.key;
    document.forms["modifyBotForm"]["token"].value = jsonData.token;
    document.forms["modifyBotForm"]["clientSecret"].value =
      jsonData.clientSecret;
    document.forms["modifyBotForm"]["clientId"].value = jsonData.clientId;
    document.forms["modifyBotForm"]["botType"].value = jsonData.botType;
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getBots() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    var bots = JSON.parse(event.target.responseText);
    bots.forEach(AddBotInfo);
    function AddBotInfo(bot, index) {
      var table = document.getElementById("allBots");
      var row = table.insertRow(index);

      var name = row.insertCell(0);
      name.innerHTML = bot.name;
      var token = row.insertCell(1);
      token.innerHTML = bot.token;
      var clientSecret = row.insertCell(2);
      clientSecret.innerHTML = bot.clientSecret;
      var clientId = row.insertCell(3);
      clientId.innerHTML = bot.clientId;
      var botType = row.insertCell(4);
      botType.innerHTML = bot.botType;
      var key = row.insertCell(5);
      key.innerHTML = bot.key;
      name.classList.add("w-1/3", "text-left", "py-3", "px-4");
      token.classList.add("w-1/3", "text-left", "py-3", "px-4");
      clientSecret.classList.add("w-1/3", "text-left", "py-3", "px-4");
      clientId.classList.add("w-1/3", "text-left", "py-3", "px-4");
      botType.classList.add("w-1/3", "text-left", "py-3", "px-4");
      key.classList.add("w-1/3", "text-left", "py-3", "px-4");
    }
  });
  XHR.addEventListener("error", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
