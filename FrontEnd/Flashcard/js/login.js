document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/users/login', { // Adjust the URL if needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Mail: username, Password: password }) // Updated field names
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json(); // Parse the response as JSON if login is successful
    })
    .then(data => {
        localStorage.setItem('user_id', data.id); // Save user_id to localStorage
        window.location.href = 'main_1.html'; // Redirect to main_1.html
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
