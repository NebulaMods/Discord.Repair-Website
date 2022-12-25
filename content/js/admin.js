document.addEventListener("DOMContentLoaded", async () => {
  await CheckAccountType();
  await getUsers();
});

async function CheckAccountType() {
  let accountType = window.sessionStorage.getItem("AccountType");
  if (accountType != "Staff") {
    window.location.replace("https://discord.repair/dashboard/index.html");
  }
}

//not done
async function modifyUser() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyUserForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("PATCH", "https://api.discord.repair/v1/user/" + FD.get("user"));
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
//not done

async function deleteUser() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["deleteUserForm"]["user"].value;
  if (form == null || form.length == 0) {
    return;
  }
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("DELETE", "https://api.discord.repair/v1/user/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getUser() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyUserForm"]["username"].value;
  if (form == null || form.length == 0) {
    form = document.forms["modifyUserForm"]["email"].value;
    if (form == null || form.length == 0) {
      return;
    }
  }
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    document.forms["modifyUserForm"]["username"].value = jsonData.username;
    document.forms["modifyUserForm"]["email"].value = jsonData.email;
    document.forms["modifyUserForm"]["discordId"].value = jsonData.discordId;
    document.forms["modifyUserForm"]["pfp"].value = jsonData.pfp;
    document.forms["modifyUserForm"]["lastIp"].value = jsonData.lastIp;
    document.forms["modifyUserForm"]["accountType"].value =
      jsonData.accountType;
    document.forms["modifyUserForm"]["expiry"].value = jsonData.expiry;
    document.forms["modifyUserForm"]["banned"].value = jsonData.banned;
    document.forms["modifyUserForm"]["apiToken"].value = jsonData.apiToken;
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/" + form);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function getUsers() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let users = JSON.parse(event.target.responseText);
    users.forEach(AddUserInfo);
    function AddUserInfo(user, index) {
      let table = document.getElementById("allUsers");
      let row = table.insertRow(index);

      let username = row.insertCell(0);
      username.innerHTML = user.username;
      let email = row.insertCell(1);
      email.innerHTML = user.email;
      let accountType = row.insertCell(2);
      accountType.innerHTML = user.accountType;
      let expiry = row.insertCell(3);
      expiry.innerHTML = user.expiry;
      let creationDate = row.insertCell(4);
      creationDate.innerHTML = user.creationDate;
      let lastIp = row.insertCell(5);
      lastIp.innerHTML = user.lastIp;
      username.classList.add("text-left", "py-3", "px-4");
      email.classList.add("text-left", "py-3", "px-4");
      accountType.classList.add("text-left", "py-3", "px-4");
      expiry.classList.add("text-left", "py-3", "px-4");
      creationDate.classList.add("text-left", "py-3", "px-4");
      lastIp.classList.add("text-left", "py-3", "px-4");
    }
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
