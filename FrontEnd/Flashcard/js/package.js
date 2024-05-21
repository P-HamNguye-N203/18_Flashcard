document.addEventListener('DOMContentLoaded', function() {
  const userButton = document.getElementById('userButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  const logoutButton = document.getElementById('logoutButton');
  const searchInput = document.querySelector('.combobox-listbox-search-la');
  const searchButton = document.getElementById('searchButton');
  const dataContainer = document.getElementById('dataContainer');
  const createCardForm = document.getElementById('createCardForm');
  const cardNameInput = document.getElementById('cardName');
  const cardDescriptionInput = document.getElementById('cardDescription'); // Thêm phần tử mô tả thẻ

  userButton.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '/FrontEnd/Flashcard/main_1.html'; // Update with correct path
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

  createCardForm.addEventListener('submit', function(event) {
    event.preventDefault();
    createCard(cardNameInput.value.trim(), cardDescriptionInput.value.trim());
  });

  // Function to perform search for cards
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
      .then(packages => {
        if (packages.length > 0) {
          const packageId = localStorage.getItem('package_id'); // Đảm bảo bạn đang lưu package_id vào localStorage
          if (!packageId) {
            console.error('Package ID not found. Please select a package.');
            return;
          }
          fetch(`http://127.0.0.1:8000/cards/listcard?package_id=${packageId}`)
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
                filteredRecords = data.filter(record => record.Info.toLowerCase().includes(searchTerm.toLowerCase()));
              } else {
                filteredRecords = data;
              }

              displayData(filteredRecords);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        } else {
          console.log('No packages found for the user.');
        }
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
      });
  }

  // Function to create a new card
  function createCard(cardName, cardDescription) {
    const packageId = localStorage.getItem('package_id');
    if (!packageId) {
      console.error('Package ID not found. Please select a package.');
      return;
    }

    const requestData = {
      ListCards: [
        {
          id: 0, // Đặt ID là 0 để API tự sinh ra
          Info: cardName, // Thông tin thẻ là tên đã nhập
          Descrip: cardDescription // Mô tả thẻ là mô tả đã nhập
        }
      ],
      PackageId: packageId // PackageId từ localStorage
    };

    fetch('http://127.0.0.1:8000/cards/create', {
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
          throw new Error(`Failed to create card: ${JSON.stringify(errorData)}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Card created:', data);
      performSearch(''); // Làm mới danh sách thẻ
    })
    .catch(error => {
      console.error('Error creating card:', error);
    });
  }

  // Function to display card data
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
        const name = record.Info;
        const description = record.Descrip;

        const nameBox = document.createElement('div');
        nameBox.classList.add('nameBox');

        const nameElement = document.createElement('p');
        nameElement.textContent = name;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;

        nameBox.appendChild(nameElement);
        nameBox.appendChild(descriptionElement);
        dataContainer.appendChild(nameBox);
      });
    }
  }
      performSearch('');
    });
