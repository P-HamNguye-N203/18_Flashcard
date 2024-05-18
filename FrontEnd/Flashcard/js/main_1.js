document.addEventListener('DOMContentLoaded', function() {
  const userButton = document.getElementById('userButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  const logoutButton = document.getElementById('logoutButton');
  const searchInput = document.querySelector('.combobox-listbox-search-la');
  const searchButton = document.getElementById('searchButton');
  const dataContainer = document.getElementById('dataContainer');
  const createPackageForm = document.getElementById('createPackageForm');
  const packageNameInput = document.getElementById('packageName');

  userButton.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  logoutButton.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '/FrontEnd/Flashcard/main.html';
  });

  document.addEventListener('click', function(event) {
    if (!userButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.style.display = 'none';
    }
  });

  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performSearch(searchTerm);
  });

  createPackageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    createPackage(packageNameInput.value.trim());
  });

  function performSearch(searchTerm) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found. Please log in.');
      return;
    }

    fetch(`http://127.0.0.1:8000/packages/listpackage?user_id=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        let filteredRecords = [];

        if (searchTerm) {
          filteredRecords = data.filter(record => record.Name.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
          filteredRecords = data;
        }

        displayData(filteredRecords);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function createPackage(packageName) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found. Please log in.');
      return;
    }
  
    const requestData = {
      UserId: userId, // Thêm trường UserId vào dữ liệu gửi đi
      Name: packageName
    };
  
    fetch('http://127.0.0.1:8000/packages/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Error details:', errorData);
          throw new Error(`Failed to create package: ${JSON.stringify(errorData)}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Package created:', data);
      performSearch(''); // Refresh the package list
    })
    .catch(error => {
      console.error('Error creating package:', error);
    });
  }
  

  function displayData(records) {
    dataContainer.innerHTML = '';

    if (!Array.isArray(records)) {
      console.error('Error: Data is not an array', records);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Error: Data format is incorrect.';
      dataContainer.appendChild(errorMessage);
      return;
    }

    if (records.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No results found.';
      dataContainer.appendChild(noResultsMessage);
    } else {
      records.forEach(record => {
        const name = record.Name;

        const nameBox = document.createElement('div');
        nameBox.classList.add('nameBox');

        const nameElement = document.createElement('p');
        nameElement.textContent = name;

        nameBox.appendChild(nameElement);
        dataContainer.appendChild(nameBox);
      });
    }
  }

  performSearch('');
});
