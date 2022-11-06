function signOut() {
    window.sessionStorage.removeItem("Authorization");
    window.location.replace("http://localhost:5500/login.html");
}