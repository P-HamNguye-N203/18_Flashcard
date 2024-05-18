document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');

    // Hiển thị thông báo lỗi
    function showError(input, message) {
        const formControl = input.parentElement;
        formControl.className = 'form-control error';
        const small = formControl.querySelector('small');
        small.innerText = message;
    }

    // Hiển thị thành công
    function showSuccess(input) {
        const formControl = input.parentElement;
        formControl.className = 'form-control success';
        const small = formControl.querySelector('small');
        small.innerText = '';
    }

    // Kiểm tra email hợp lệ
    function checkEmail(input) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(input.value.trim())) {
            showSuccess(input);
        } else {
            showError(input, 'Email không hợp lệ');
        }
    }

    // Kiểm tra các trường bắt buộc
    function checkRequired(inputArr) {
        let isRequired = false;
        inputArr.forEach(function (input) {
            if (input.value.trim() === '') {
                showError(input, `${getFieldName(input)} là bắt buộc`);
                isRequired = true;
            } else {
                showSuccess(input);
            }
        });

        return isRequired;
    }

    // Kiểm tra độ dài của input
    function checkLength(input, min, max) {
        if (input.value.length < min) {
            showError(input, `${getFieldName(input)} phải có ít nhất ${min} ký tự`);
        } else if (input.value.length > max) {
            showError(input, `${getFieldName(input)} phải ít hơn ${max} ký tự`);
        } else {
            showSuccess(input);
        }
    }

    // Kiểm tra mật khẩu trùng khớp
    function checkPasswordsMatch(input1, input2) {
        if (input1.value !== input2.value) {
            showError(input2, 'Mật khẩu không khớp');
            return false;
        } else {
            showSuccess(input2);
            return true;
        }
    }

    // Lấy tên trường
    function getFieldName(input) {
        return input.id.charAt(0).toUpperCase() + input.id.slice(1);
    }

    // Gửi dữ liệu form đến API
    async function submitFormData() {
        const userData = {
            Name: username.value.trim(),
            Mail: email.value.trim(),
            Password: password.value.trim()
        };

        console.log('Submitting user data:', userData); // Debug statement

        try {
            const response = await fetch('http://127.0.0.1:8000/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Tạo người dùng thành công');
                // Tùy chọn, chuyển hướng đến trang khác
                // window.location.href = 'your-redirect-url.html';
            } else {
                const data = await response.json();
                console.error('Response error data:', data); // Debug statement
                alert('Tạo người dùng thất bại: ' + data.detail);
            }
        } catch (error) {
            console.error('Error:', error); // Debug statement
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    }

    // Event listeners
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        console.log('Form submitted'); // Debug statement

        if (!checkRequired([username, email, password, password2])) {
            checkLength(username, 3, 15);
            checkLength(password, 6, 25);
            checkEmail(email);
            if (checkPasswordsMatch(password, password2)) {
                submitFormData();
            }
        }
    });
});
