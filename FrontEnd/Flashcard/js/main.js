document.addEventListener('DOMContentLoaded', function() {
  const subjectAreas = document.querySelector('.subject-areas');
  const subjectList = document.querySelector('.subject-list');
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');
  const signupNowButton = document.getElementById('signupNowButton');

  // Xử lý sự kiện khi nhấp vào "Subject areas"
  subjectAreas.addEventListener('click', function() {
    // Toggle hiển thị/ẩn danh sách môn học
    if (subjectList.style.display === 'none') {
      subjectList.style.display = 'block';
    } else {
      subjectList.style.display = 'none';
    }
  });

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

  // Xử lý sự kiện click bên ngoài để ẩn danh sách môn học khi không được click vào "Subject areas"
  document.addEventListener('click', function(event) {
    const targetElement = event.target;
    const isSubjectAreasClicked = subjectAreas.contains(targetElement);
    if (!isSubjectAreasClicked && subjectList && subjectList.style.display === 'block') {
      subjectList.style.display = 'none';
    }
  });
});