async function createBot() {
  const XHR = new XMLHttpRequest();
  var form = document.forms["botForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["botForm"]["name"].value = jsonData.name;
    document.forms["botForm"]["key"].value = jsonData.key;
    document.forms["botForm"]["token"].value = jsonData.token;
    document.forms["botForm"]["clientSecret"].value = jsonData.clientSecret;
    document.forms["botForm"]["clientId"].value = jsonData.clientId;
    document.forms["botForm"]["botType"].value = jsonData.botType;
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
  var form = document.forms["botForm"];
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
  var form = document.forms["botForm"]["name"].value;
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
  var form = document.forms["botForm"]["name"].value;
  if (form == null || form.length == 0) {
    form = document.forms["botForm"]["key"].value;
    if (form == null || form.length == 0) {
      return;
    }
  }
  XHR.addEventListener("load", (event) => {
    var jsonData = JSON.parse(event.target.responseText);
    document.forms["botForm"]["name"].value = jsonData.name;
    document.forms["botForm"]["key"].value = jsonData.key;
    document.forms["botForm"]["token"].value = jsonData.token;
    document.forms["botForm"]["clientSecret"].value = jsonData.clientSecret;
    document.forms["botForm"]["clientId"].value = jsonData.clientId;
    document.forms["botForm"]["botType"].value = jsonData.botType;
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
  var form = document.forms["botForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    var display = "";
    var bots = JSON.parse(event.target.responseText);
    bots.forEach(AddBotInfo);
    function AddBotInfo(bot) {
      display += bot.name + " : " + bot.key + "\n";
    }
    if (display == "") {
      alert("No bots found");
    } else {
      navigator.clipboard.writeText(display);
      alert(
        "Open a text editor and paste the text to view a full list of your bots."
      );
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
  var json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}
