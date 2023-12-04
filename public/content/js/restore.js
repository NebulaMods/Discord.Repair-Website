window.addEventListener("DOMContentLoaded", async () => {
  await GetRestoresAsync();
  await GetServersAsync();
});

async function GetRestoresAsync() {
  document.getElementById("allRestores").innerHTML = "";
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == null) {
      jsonData.forEach(AddBotInfo);
      function AddBotInfo(migration, index) {
        let table = document.getElementById("allRestores");
        let row = table.insertRow(index);

        let name = row.insertCell(0);
        name.innerHTML = migration.serverName;
        let botName = row.insertCell(1);
        botName.innerHTML = migration.botName;
        let startTime = row.insertCell(2);
        startTime.innerHTML = migration.startTime;
        let completionTime = row.insertCell(3);
        completionTime.innerHTML = migration.completionTime;
        let status = row.insertCell(4);
        status.innerHTML = migration.status;
        let totalMemberAmount = row.insertCell(5);
        totalMemberAmount.innerHTML = migration.totalMemberAmount;
        let newGuildId = row.insertCell(6);
        newGuildId.innerHTML = migration.newGuildId;
        let newRoleId = row.insertCell(7);
        newRoleId.innerHTML = migration.newRoleId;
        let failedMemberAmount = row.insertCell(8);
        failedMemberAmount.innerHTML = migration.failedMemberAmount;
        let successMemberAmount = row.insertCell(9);
        successMemberAmount.innerHTML = migration.successfulMemberAmount;
        let invalidTokenAmount = row.insertCell(10);
        invalidTokenAmount.innerHTML = migration.invalidTokenAmount;
        let alreadyMigratedMemberAmount = row.insertCell(11);
        alreadyMigratedMemberAmount.innerHTML =
          migration.alreadyMigratedMemberAmount;
        let extraDetails = row.insertCell(12);
        extraDetails.innerHTML = migration.extraDetails;
        name.classList.add("text-left", "py-3", "px-4");
        botName.classList.add("text-left", "py-3", "px-4");
        startTime.classList.add("text-left", "py-3", "px-4");
        completionTime.classList.add("text-left", "py-3", "px-4");
        status.classList.add("text-left", "py-3", "px-4");
        totalMemberAmount.classList.add("text-left", "py-3", "px-4");
        newGuildId.classList.add("text-left", "py-3", "px-4");
        newRoleId.classList.add("text-left", "py-3", "px-4");
        failedMemberAmount.classList.add("text-left", "py-3", "px-4");
        successMemberAmount.classList.add("text-left", "py-3", "px-4");
        invalidTokenAmount.classList.add("text-left", "py-3", "px-4");
        alreadyMigratedMemberAmount.classList.add("text-left", "py-3", "px-4");
        extraDetails.classList.add("text-left", "py-3", "px-4");
      }
      return;
    }
    if (jsonData.details == "no migration history") return;
    ToggleErrorModal(jsonData.details);
  });
  XHR.addEventListener("error", (event) => {
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("GET", "https://api.discord.repair/v1/restore");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}

async function RestoreMembersAsync() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["restoreMembersForm"];
  const FD = new FormData(form);
  XHR.addEventListener("load", async (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success == false) {
      document.forms["restoreMembersForm"].reset();
      ToggleErrorModal(jsonData.details);
      return;
    }
    document.forms["restoreMembersForm"].reset();
    await GetRestoresAsync();
    ToggleSuccessModal("Successfully started restore.");
  });
  XHR.addEventListener("error", (event) => {
    document.forms["restoreMembersForm"].reset();
    ToggleErrorModal(event.target.responseText);
  });
  XHR.open("POST", "https://api.discord.repair/v1/restore");
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  if (FD.get("roleId") == "") {
    FD.delete("roleId");
  }
  const comboBox = document.getElementById("restoreMembersSelectServer");
  const selectedOption = comboBox.options[comboBox.selectedIndex].text;
  if (
    selectedOption == "" ||
    selectedOption == null ||
    selectedOption == "undefined"
  ) {
    ToggleErrorModal(
      "Please select a valid server in order to restore members."
    );
  }
  FD.set("serverName", selectedOption);
  let json = JSON.stringify(Object.fromEntries(FD));
  XHR.send(json);
}

async function GetServersAsync() {
  const serverCombobox = document.getElementById("restoreMembersSelectServer");
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
