window.addEventListener("load", async () => {
  getBots();
});

async function createBot() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["createBotForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      document.forms["createBotForm"].reset();
      await getBots();
      alert("successfully created bot.");
      return;
    }
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["createBotForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open("PUT", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  FD.delete("key");
  //FD.get("botType") = "EVERYTHING";
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function modifyBot() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyBotForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await getBots();
    }
    document.forms["modifyBotForm"].reset();
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyBotForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open(
    "PATCH",
    "https://api.discord.repair/v1/custom-bot/" + FD.get("name")
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
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function deleteBot() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["deleteBotForm"]["name"].value;

  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == true) {
      await getBots();
    }
    document.forms["deleteBotForm"].reset();
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["deleteBotForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
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
  let form = document.forms["modifyBotForm"]["name"].value;
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
      document.forms["modifyBotForm"]["botType"].value = jsonData.botType;
      return;
    }
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    document.forms["modifyBotForm"].reset();
    alert(
      "An error occurred, if this continues to occur please contact an admin."
    );
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getBots() {
  document.getElementById("allBots").innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let bots = JSON.parse(event.target.responseText);
    if (bots.success == null) {
      bots.forEach(AddBotInfo);
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
      }
      return;
    }
    alert(bots.details);
  });
  XHR.addEventListener("error", (event) => {
    alert(
      "An error occurred while trying to fetch all your bots, if this continues to occur please contact an admin."
    );
  });
  XHR.open("GET", "https://api.discord.repair/v1/custom-bot");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
