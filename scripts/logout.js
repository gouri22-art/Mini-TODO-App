function logout() {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData == null) {
      alert("Please Login....");
      window.location.href = "login.html";
    }
  
    document.getElementById(
      "user-name"
    ).textContent = `Welcome, ${loginData.username}`;
  
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("loginData");
      alert("Redirecting to Home Page....");
      window.location.href = "index.html";
    });
  }
  
  export {logout}