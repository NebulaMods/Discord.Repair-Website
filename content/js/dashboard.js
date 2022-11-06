window.addEventListener("load", () => {
  function getUserInfo() {
    const XHR = new XMLHttpRequest();
    var authToken = window.sessionStorage.getItem("Authorization");
    XHR.addEventListener("load", (event) => {
      var jsonData = JSON.parse(event.target.responseText);
      window.sessionStorage.setItem("PFP", jsonData.pfp);
      window.sessionStorage.setItem("AccountType", jsonData.accountType);
    });
    XHR.addEventListener("error", (event) => {
      console.log(event.target.responseText);
    });
    XHR.open("GET", "https://api.discord.repair/v1/user/@me");
    XHR.setRequestHeader("Authorization", authToken);
    XHR.send();
  }
  function setPfp() {
    var imgTag = document.getElementById("pfp-img");
    imgTag.setAttribute("src", window.sessionStorage.getItem("PFP"));
  }
  function removeUpgradeLink() {
    var accountType = window.sessionStorage.getItem("AccountType");
    if (accountType == "Staff" || accountType == "Paid") {
      var upgradeTag = document.getElementById("upgrade-link");
      upgradeTag.style.display = "none";
    }
  }
  getUserInfo();
  setPfp();
  removeUpgradeLink();
});
