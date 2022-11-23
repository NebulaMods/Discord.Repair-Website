window.addEventListener("DOMContentLoaded", async () => {
  await checkLogin();
  setPfp();
  removeUpgradeLink();
});
async function setPfp() {
  try {
    let imgTag = document.getElementById("pfp-img");
    imgTag.setAttribute("src", window.sessionStorage.getItem("PFP"));
  } catch (e) {}
}
async function removeUpgradeLink() {
  let accountType = window.sessionStorage.getItem("AccountType");
  if (accountType == "Staff" || accountType == "Paid") {
    let upgradeTag = document.getElementById("upgrade-link");
    let upgradeTagMobile = document.getElementById("upgrade-link-mobile");
    upgradeTagMobile.style.display = "none";
    upgradeTag.style.display = "none";
  }
}
async function checkLogin() {
  let loggedIn = window.sessionStorage.getItem("Authorization");
  if (loggedIn == null) {
    window.location.replace("https://discord.repair/login.html");
    return;
  }
  if (loggedIn == "invalid password, please try again.") {
    window.sessionStorage.removeItem("Authorization");
    window.location.replace("https://discord.repair/login.html");
    return;
  }
}

function signOut() {
  window.sessionStorage.removeItem("Authorization");
  window.sessionStorage.removeItem("PFP");
  window.sessionStorage.removeItem("AccountType");
  window.location.replace("https://discord.repair/login.html");
}
