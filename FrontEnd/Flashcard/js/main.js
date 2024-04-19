document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');
  const signupNowButton = document.getElementById('signupNowButton');

  // Xử lý sự kiện khi click vào nút Log in
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      window.location.href = 'login.html'; // Chuyển hướng đến trang login.html
    });
  }

  // Xử lý sự kiện khi click vào nút Sign up
  if (signupButton) {
    signupButton.addEventListener('click', function() {
      window.location.href = 'signup.html'; // Chuyển hướng đến trang signup.html
    });
  }

  // Xử lý sự kiện khi click vào nút Sign up now
  if (signupNowButton) {
    signupNowButton.addEventListener('click', function() {
      window.location.href = 'signup.html'; // Chuyển hướng đến trang signup.html
    });
  }
});