async function migrateUsers() {
  const XHR = new XMLHttpRequest();
  let form = document.forms["migrateForm"];
  let formData = new FormData(form);

  XHR.addEventListener("load", (event) => {
    let json = JSON.parse(event.target.responseText);
    alert(json);
  });

  XHR.addEventListener("error", (error) => {
    console.log(error);
    let json = JSON.parse(error.target.responseText);
    alert(json.details);
  });
  XHR.open(
    "POST",
    "https://api.discord.repair/v1/" +
      formData.get("name") +
      "/migrate/" +
      formData.get("guildId")
  );
  XHR.setRequestHeader(
    "Authorization",
    window.sessionStorage.getItem("Authorization")
  );
  XHR.setRequestHeader("Content-Type", "application/json");
  formData.delete("name");
  formData.delete("guildId");
  if (formData.get("userId") == null || formData.get("userId") == "")
    formData.delete("userId");
  if (
    formData.get("verifyRoleId") == null ||
    formData.get("verifyRoleId") == ""
  )
    formData.delete("verifyRoleId");
  if (formData.get("userCount") == null || formData.get("userCount") == "")
    formData.delete("userCount");
  if (formData.entries() > 0) {
    let jsonData = JSON.stringify(Object.fromEntries(formData));
    XHR.send(jsonData);
    return;
  }
  XHR.send();
}
