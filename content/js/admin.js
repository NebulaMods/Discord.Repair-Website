document.addEventListener("DOMContentLoaded", async () => {
  await CheckAccountType();
  await GetUsersAsync();
});

async function CheckAccountType() {
  let accountType = window.sessionStorage.getItem("AccountType");
  if (accountType != "Staff") {
    window.location.replace(
      `${location.protocol}//${window.location.hostname}/dashboard/index.html`
    );
  }
}

//not done
async function ModifyUserAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["modifyUserForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    ToggleSuccessModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
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

async function DeleteUserAsync(user) {
  const XHR = new XMLHttpRequest();
  if (user == null || user.length == 0 || user == "undefined") {
    ToggleErrorModal("No user specified");
    return;
  }
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    ToggleSuccessModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("DELETE", "https://api.discord.repair/v1/user/" + user);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetUserAsync(user) {
  const XHR = new XMLHttpRequest();
  if (user == null || user.length == 0 || user == "undefined") {
    ToggleErrorModal("No user specified");
    return;
  }
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["modifyUserForm"]["username"].value = jsonData.username;
    document.forms["modifyUserForm"]["email"].value = jsonData.email;
    document.forms["modifyUserForm"]["discordId"].value = jsonData.discordId;
    document.forms["modifyUserForm"]["pfp"].value = jsonData.pfp;
    if (
      jsonData.lastIp == "undefined" ||
      jsonData.lastIp == null ||
      jsonData.lastIp == ""
    )
      jsonData.lastIp = "N/A";
    document.forms["modifyUserForm"]["lastIp"].value = jsonData.lastIp;
    document.forms["modifyUserForm"]["accountType"].value =
      jsonData.accountType;
    document.forms["modifyUserForm"]["expiry"].value = jsonData.expiry;
    document.forms["modifyUserForm"]["banned"].value = jsonData.banned;
    document.forms["modifyUserForm"]["apiToken"].value = jsonData.apiToken;
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user/" + user);
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function GetUsersAsync() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      ToggleErrorModal(jsonData.details);
      return;
    }
    jsonData.forEach(AddUserInfo);
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
      if (user.expiry == "" || user.expiry == null) expiry.innerHTML = "N/A";
      else expiry.innerHTML = user.expiry;
      let creationDate = row.insertCell(4);
      creationDate.innerHTML = user.creationDate;
      let lastIp = row.insertCell(5);
      if (user.lastIp == "" || user.lastIp == null) lastIp.innerHTML = "N/A";
      else
        lastIp.innerHTML = `<a target='_blank' href='https://nebulamods.ca/geolocation?ip=${user.lastIp}'>${user.lastIp}</a>`;
      username.classList.add("text-left", "py-3", "px-4");
      email.classList.add("text-left", "py-3", "px-4");
      accountType.classList.add("text-left", "py-3", "px-4");
      expiry.classList.add("text-left", "py-3", "px-4");
      creationDate.classList.add("text-left", "py-3", "px-4");
      lastIp.classList.add("text-left", "py-3", "px-4");
      let options = row.insertCell(6);
      let modifyLink = document.createElement("a");
      let deleteLink = document.createElement("a");
      let modifyIcon = document.createElement("i");
      let deleteIcon = document.createElement("i");
      //
      deleteLink.href = `javascript:ToggleDeleteModal('${user.username}');`;
      //
      modifyLink.href = `javascript:ToggleModifyModal('${user.username}');`;
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
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    ToggleErrorModal(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/user");
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

function ToggleDeleteModal(user) {
  const modal = document.getElementById("deleteModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (user == null || user == "" || user == "undefined") {
    return;
  }
  const deleteButton = document.getElementById("DeleteUserAsyncButton");
  const deleteText = document.getElementById("deleteModalText");
  deleteText.innerText = `Are you sure you want to delete: ${user}`;
  deleteButton.setAttribute(
    "onclick",
    `javascript:DeleteUserAsyncAsync('${user}');`
  );
}

function ToggleModifyModal(user) {
  const modal = document.getElementById("modifyModal");
  modal.classList.toggle("hidden");
  const body = document.querySelector("body");
  body.classList.toggle("overflow-hidden");
  if (user == null || user == "" || user == "undefined") {
    return;
  }
  GetUserAsync(user);

  const modifyButton = document.getElementById("modifyUserButton");
  modifyButton.setAttribute(
    "onclick",
    `javascript:ModifyUserAsync('${user}');`
  );
}
