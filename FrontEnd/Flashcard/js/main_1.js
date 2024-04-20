document.addEventListener('DOMContentLoaded', function() {
  const userButton = document.getElementById('userButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  const logoutButton = document.getElementById('logoutButton');
  const searchInput = document.querySelector('.combobox-listbox-search-la');
  const searchButton = document.getElementById('searchButton');
  const dataContainer = document.getElementById('dataContainer');

  userButton.addEventListener('click', function() {
    // Toggle hiển thị dropdown
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  logoutButton.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    // Chuyển hướng về trang main.html khi nhấn vào nút "Logout"
    window.location.href = '/FrontEnd/Flashcard/main.html';
  });

  // Bổ sung sự kiện click bên ngoài để ẩn dropdown
  document.addEventListener('click', function(event) {
    if (!userButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.style.display = 'none';
    }
  });

  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    performSearch(searchTerm);
  });

  function performSearch(searchTerm) {
    fetch('/FrontEnd/Flashcard/data.txt')
      .then(response => response.json()) // Đọc dữ liệu dưới dạng JSON
      .then(data => {
        let filteredRecords = [];

        if (searchTerm) {
          filteredRecords = data.data.filter(record => record.Name.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
          filteredRecords = data.data; // Hiển thị tất cả nếu không có từ khóa tìm kiếm
        }
        
        displayData(filteredRecords);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function displayData(records) {
    dataContainer.innerHTML = ''; // Xóa dữ liệu hiện tại
  
    if (records.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No results found.';
      dataContainer.appendChild(noResultsMessage);
    } else {
      records.forEach(record => {
        const name = record.Name;
  
        // Tạo một phần tử div mới cho từng tên
        const nameBox = document.createElement('div');
        nameBox.classList.add('nameBox'); // Thêm lớp CSS cho phần tử div
  
        const nameElement = document.createElement('p');
        nameElement.textContent = name;
  
        nameBox.appendChild(nameElement); // Thêm phần tử p (chứa tên) vào phần tử div
        dataContainer.appendChild(nameBox); // Thêm phần tử div vào dataContainer
      });
    }
  }
  
});
