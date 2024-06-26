document.addEventListener('DOMContentLoaded', function() {
  const userButton = document.getElementById('userButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  const logoutButton = document.getElementById('logoutButton');
  const changePasswordButton = document.getElementById('changePasswordButton');
  const searchInput = document.querySelector('.combobox-listbox-search-la');
  const searchButton = document.getElementById('searchButton');
  const dataContainer = document.getElementById('dataContainer');
  const createCardForm = document.getElementById('createCardForm');
  const cardNameInput = document.getElementById('cardName');
  const cardDescriptionInput = document.getElementById('cardDescription');
  const deleteAllButton = document.getElementById('deleteAllButton');
  const playButton = document.getElementById('playButton'); // New Play button

  userButton.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '/FrontEnd/Flashcard/main_1.html';
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

  deleteAllButton.addEventListener('click', function() {
    deleteAllCards();
  });

  playButton.addEventListener('click', function() { // Event listener for Play button
    window.location.href = '/FrontEnd/Flashcard/play.html';
  });

  playButton_1.addEventListener('click', function() { // Event listener for Play button
    window.location.href = '/FrontEnd/Flashcard/game.html';
  });


// Đổi mật khẩu
changePasswordButton.addEventListener('click', function(event) {
  event.preventDefault(); 
  const newPassword = prompt('Enter your new password:');
  if (newPassword) {
      const confirmPassword = prompt('Confirm your new password:');
      if (confirmPassword) {
          // Check if the passwords match
          if (newPassword !== confirmPassword) {
              alert('Passwords do not match. Please try again.');
              return;
          }
          if (!isPasswordValid(newPassword)) {
              alert('Password does not meet the common requirements. Please try again.');
              return; 
          }
          const userId = localStorage.getItem('user_id');
          if (!userId) {
              console.error('User ID not found. Please log in.');
              return;
          }
          fetch(`http://127.0.0.1:8000/users/update?user_id=${userId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ Password: newPassword })
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Failed to change password: ${response.statusText}`);
              }
              console.log('Password changed successfully.');
              alert('Password changed successfully.');
          })
          .catch(error => {
              console.error('Error changing password:', error);
              alert('Error changing password. Please try again.');
          });
      }
  }
});

function isPasswordValid(password) {
  return password.length >= 8;
}

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
          const packageId = localStorage.getItem('package_id');
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

  function createCard(cardName, cardDescription) {
    const packageId = localStorage.getItem('package_id');
    if (!packageId) {
      console.error('Package ID not found. Please select a package.');
      return;
    }

    const requestData = {
      ListCards: [
        {
          id: 0,
          Info: cardName,
          Descrip: cardDescription
        }
      ],
      PackageId: packageId
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
      performSearch('');
    })
    .catch(error => {
      console.error('Error creating card:', error);
    });
  }

  function deleteAllCards() {
    const packageId = localStorage.getItem('package_id');
    if (!packageId) {
      console.error('Package ID not found. Please select a package.');
      return;
    }

    fetch(`http://127.0.0.1:8000/cards/delete-all?package_id=${packageId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`All cards in package ${packageId} deleted.`);
      performSearch('');
    })
    .catch(error => {
      console.error('Error deleting all cards:', error);
    });
  }

  function deleteCard(cardId) {
    fetch(`http://127.0.0.1:8000/cards/delete?card_id=${cardId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Card with ID ${cardId} deleted.`);
      performSearch('');
    })
    .catch(error => {
      console.error('Error deleting card:', error);
    });
  }

  function updateCard(cardId, newCardName, newCardDescription, nameElement, descriptionElement) {
    fetch(`http://127.0.0.1:8000/cards/update?card_id=${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Info: newCardName, Descrip: newCardDescription })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Update response:', data);
      nameElement.textContent = newCardName;
      descriptionElement.textContent = newCardDescription;
    })
    .catch(error => console.error('Failed to update card:', error));
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
        const name = record.Info;
        const description = record.Descrip;
        const cardId = record.id; // Lấy card_id từ dữ liệu

        const nameBox = document.createElement('div');
        nameBox.classList.add('nameBox');

        const nameElement = document.createElement('p');
        nameElement.textContent = name;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;

        // Tạo nút xóa card và gắn sự kiện click
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          deleteCard(cardId); // Gọi hàm xóa card khi nút được click
        });

        // Tạo nút edit card và gắn sự kiện click
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
          if (editButton.textContent === 'Edit') {
            nameElement.innerHTML = `<input type='text' value='${nameElement.textContent}' class='edit-input'>`;
            descriptionElement.innerHTML = `<input type='text' value='${descriptionElement.textContent}' class='edit-input'>`;
            editButton.textContent = 'Save';
          } else {
            const newName = nameElement.querySelector('input').value;
            const newDescription = descriptionElement.querySelector('input').value;
            updateCard(cardId, newName, newDescription, nameElement, descriptionElement);
            editButton.textContent = 'Edit';
          }
        });

        nameBox.appendChild(nameElement);
        nameBox.appendChild(descriptionElement);
        nameBox.appendChild(editButton); // Thêm nút edit vào nameBox
        nameBox.appendChild(deleteButton); // Thêm nút xóa vào nameBox
        dataContainer.appendChild(nameBox);
      });
    }
  }

  performSearch('');
});
