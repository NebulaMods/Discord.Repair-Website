window.addEventListener("load", () => {

    var loggedIn = window.sessionStorage.getItem("Authorization");
    if (loggedIn == null) {
      window.location.replace("http://localhost:5500/login.html");
      return;
    }
});