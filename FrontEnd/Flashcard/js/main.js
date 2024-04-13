document.addEventListener("DOMContentLoaded", function() {
    const homeButton = document.querySelector(".united-states");
    const subjectAreasButton = document.querySelector(".subject-areas");
    const searchButton = document.querySelector(".img-search");
    const loginButton = document.querySelector(".button-log-in");
    const signUpButton = document.querySelector(".button-sign-up");
    const signUpNowButton = document.querySelector(".button-sign-up-now");
  
    if (homeButton) {
      homeButton.addEventListener("click", function() {
        window.location.href = "http://127.0.0.1:5500/Flashcard/main.html";
      });
    }
  
    if (subjectAreasButton) {
      subjectAreasButton.addEventListener("click", function() {
        window.location.href = "https://quizlet.com/subject-areas";
      });
    }
  
    if (searchButton) {
      searchButton.addEventListener("click", function() {
        // Thực hiện hành động tương ứng với nút Search
        alert("Perform search action");
      });
    }
  
    if (loginButton) {
      loginButton.addEventListener("click", function() {
        window.location.href = "https://quizlet.com/login";
      });
    }
  
    if (signUpButton) {
      signUpButton.addEventListener("click", function() {
        window.location.href = "https://quizlet.com/signup";
      });
    }
  
    if (signUpNowButton) {
      signUpNowButton.addEventListener("click", function() {
        window.location.href = "https://quizlet.com/signup";
      });
    }
  });