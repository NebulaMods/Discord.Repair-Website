window.addEventListener("load", async () => {
  await loadUsers();
});

async function loadUsers() {
  const XHR = new XMLHttpRequest();
  XHR.addEventListener("load", (event) => {
    let users = JSON.parse(event.target.responseText);
    users.forEach(AddUserInfo);
    function AddUserInfo(user, index) {
      let table = document.getElementById("allUsers");
      let row = table.insertRow(index);
      //
      let discordId = row.insertCell(0);
      discordId.innerHTML = user.discordId;
      let username = row.insertCell(1);
      username.innerHTML = user.username;
      let ip = row.insertCell(2);
      ip.innerHTML = `<a target='_blank' href='https://nebulamods.ca/geolocation?ip=${user.ip}'>${user.ip}</a>`;
      let server = row.insertCell(3);
      server.innerHTML = user.serverName;
      let bot = row.insertCell(4);
      bot.innerHTML = user.botName;
      //
      username.classList.add("w-1/4", "text-left", "py-3", "px-4");
      discordId.classList.add("text-left", "py-3", "px-4");
      ip.classList.add("text-left", "py-3", "px-4");
      server.classList.add("text-left", "py-3", "px-4");
      bot.classList.add("text-left", "py-3", "px-4");
    }
  });
  XHR.addEventListener("error", (event) => {
    let jsonData = JSON.parse(event.target.responseText);
    alert(jsonData.details);
  });
  XHR.open("GET", "https://api.discord.repair/v1/server/all/user");
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.send();
}
