window.addEventListener("load", () => {
  function getUserInfo() {
    const XHR = new XMLHttpRequest();
    var authToken = window.sessionStorage.getItem("Authorization");
    XHR.addEventListener("load", (event) => {
      var jsonData = JSON.parse(event.target.responseText);
      window.sessionStorage.setItem("PFP", jsonData.pfp);
    });
    XHR.addEventListener("error", (event) => {
      console.log(event.target.responseText);
    });
    XHR.open("GET", "https://api.discord.repair/v1/user/@me");
    XHR.setRequestHeader("Authorization", authToken);
    XHR.send();
  }
  getUserInfo();
});
