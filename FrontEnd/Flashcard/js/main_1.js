document.addEventListener('DOMContentLoaded', function() {
  const userButton = document.getElementById('userButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  const logoutButton = document.getElementById('logoutButton');
  const changePasswordButton = document.getElementById('changePasswordButton');
  const searchInput = document.querySelector('.combobox-listbox-search-la');
  const searchButton = document.getElementById('searchButton');
  const dataContainer = document.getElementById('dataContainer');
  const createPackageForm = document.getElementById('createPackageForm');
  const packageNameInput = document.getElementById('packageName');

  // Chuyển đổi hiển thị menu dropdown
  userButton.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  // Chuyển hướng đến trang chính khi đăng xuất
  logoutButton.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '/FrontEnd/Flashcard/main.html';
  });

  // Đóng menu dropdown khi nhấn chuột bên ngoài
  document.addEventListener('click', function(event) {
    if (!userButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.style.display = 'none';
    }
  });

  // Đổi mật khẩu
  changePasswordButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    const newPassword = prompt('Enter your new password:');
    if (newPassword) {
        const confirmPassword = prompt('Confirm your new password:');
        if (confirmPassword) {
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
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

  // Hàm điều kiện 
  function isPasswordValid(password) {
    return password.length >= 8;
  }

  // Thực hiện tìm kiếm khi nút tìm kiếm được nhấn
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performSearch(searchTerm);
  });

  // Xử lý sự kiện khi biểu mẫu tạo gói dữ liệu được gửi đi
  createPackageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    createPackage(packageNameInput.value.trim());
  });
  // Hàm thực hiện tìm kiếm gói dữ liệu
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
      UserId: userId, 
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
      localStorage.setItem('package_id', data.id); 
      performSearch(''); 
    })
    .catch(error => {
      console.error('Error creating package:', error);
    });
  }

  function deletePackage(packageId) {
    fetch(`http://127.0.0.1:8000/packages/delete?package_id=${packageId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to delete package: ${response.statusText}`);
      }
      console.log(`Package with id ${packageId} deleted successfully.`);
      performSearch(''); // Refresh the package list
    })
    .catch(error => {
      console.error('Error deleting package:', error);
    });
  }

  function showEditForm(packageId, nameElement) {
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <input type="text" value="${nameElement.textContent}" required />
        <button type="submit">Save</button>
    `;
    editForm.onsubmit = function(event) {
        event.preventDefault();
        const newPackageName = editForm.querySelector('input').value;
        updatePackageName(packageId, newPackageName, nameElement);
    };
    nameElement.parentNode.replaceChild(editForm, nameElement);
  }

  function updatePackageName(packageId, newPackageName, nameElement) {
    fetch(`http://127.0.0.1:8000/packages/update?package_id=${packageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name: newPackageName })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update response:', data);
        nameElement.textContent = newPackageName;
        nameElement.parentNode.replaceChild(nameElement, nameElement.parentNode.querySelector('form'));
    })
    .catch(error => console.error('Failed to update package name:', error));
  }

  function displayData(records) {
    dataContainer.innerHTML = '';

    records.forEach(record => {
        const nameBox = document.createElement('div');
        nameBox.classList.add('nameBox');

        const nameElement = document.createElement('p');
        nameElement.textContent = record.Name;
        nameElement.classList.add('editableName');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.onclick = function(event) {
            event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
            if (editButton.textContent === 'Edit') {
                nameElement.innerHTML = `<input type='text' value='${nameElement.textContent}' class='edit-input'>`;
                editButton.textContent = 'Save';
            } else {
                const newName = nameElement.querySelector('input').value;
                updatePackageName(record.id, newName, nameElement);
                editButton.textContent = 'Edit';
            }
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function(event) {
            event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
            deletePackage(record.id);
        };

        const goToPackageButton = document.createElement('button');
        goToPackageButton.textContent = 'View Package'; // Thay đổi văn bản của nút
        goToPackageButton.classList.add('view-package-button');
        goToPackageButton.onclick = function(event) {
            event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
            localStorage.setItem('package_id', record.id);
            window.location.href = '/FrontEnd/Flashcard/package.html'; // Chuyển hướng đến trang mong muốn
        };

        // Thêm nút vào `nameBox`
        nameBox.appendChild(nameElement);
        nameBox.appendChild(editButton);
        nameBox.appendChild(deleteButton);
        nameBox.appendChild(goToPackageButton); // Thêm nút mới vào nameBox

        // Xóa sự kiện click trên `nameBox`
        nameBox.removeEventListener('click', nameBoxClickHandler);

        dataContainer.appendChild(nameBox);
    });
}

// Xóa hàm xử lý sự kiện click trên `nameBox`
function nameBoxClickHandler(event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
    localStorage.setItem('package_id', record.id);
    window.location.href = '/FrontEnd/Flashcard/package.html';
}
function displayData(records) {
  dataContainer.innerHTML = '';

  records.forEach(record => {
      const nameBox = document.createElement('div');
      nameBox.classList.add('nameBox');

      const nameElement = document.createElement('p');
      nameElement.textContent = record.Name;
      nameElement.classList.add('editableName');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.onclick = function(event) {
          event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
          if (editButton.textContent === 'Edit') {
              nameElement.innerHTML = `<input type='text' value='${nameElement.textContent}' class='edit-input'>`;
              editButton.textContent = 'Save';
          } else {
              const newName = nameElement.querySelector('input').value;
              updatePackageName(record.id, newName, nameElement);
              editButton.textContent = 'Edit';
          }
      };

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.onclick = function(event) {
          event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
          deletePackage(record.id);
      };

      const goToPackageButton = document.createElement('button');
      goToPackageButton.textContent = 'View Package'; // Thay đổi văn bản của nút
      goToPackageButton.classList.add('view-package-button');
      goToPackageButton.onclick = function(event) {
          event.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền ra ngoài
          localStorage.setItem('package_id', record.id);
          window.location.href = '/FrontEnd/Flashcard/package.html'; // Chuyển hướng đến trang mong muốn
      };

      // Thêm nút vào `nameBox`
      nameBox.appendChild(nameElement);
      nameBox.appendChild(editButton);
      nameBox.appendChild(deleteButton);
      nameBox.appendChild(goToPackageButton); // Thêm nút mới vào nameBox

      dataContainer.appendChild(nameBox);
  });
}

  performSearch('');
});
