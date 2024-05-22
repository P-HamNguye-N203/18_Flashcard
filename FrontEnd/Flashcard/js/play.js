document.addEventListener('DOMContentLoaded', () => {
    const packageId = localStorage.getItem('package_id');
    const apiUrl = `http://127.0.0.1:8000/cards/listcard?package_id=${packageId}`;
    
    let cards = [];
    let curCardId = 1;
    const cardElement = document.getElementById('card');
    const frontNumberElement = document.getElementById('front-number');
    const frontTextElement = document.getElementById('front-text');
    const backTextElement = document.getElementById('back-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn'); // Nút Back
  
    function updateCard(id) {
      const card = cards.find(card => card.id === id);
      frontNumberElement.textContent = id;
      frontTextElement.textContent = card.Info;
      backTextElement.textContent = card.Descrip;
    }
  
    function goToPrev() {
      curCardId = (curCardId - 1 + cards.length - 1) % cards.length + 1;
      updateCard(curCardId);
    }
  
    function goToNext() {
      curCardId = (curCardId % cards.length) + 1;
      updateCard(curCardId);
    }
  
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);

    backBtn.addEventListener('click', () => {
      window.location.href = '/FrontEnd/Flashcard/package.html'; // Điều hướng trở lại trang package.html
    });
  
    cardElement.addEventListener('click', () => {
      cardElement.classList.toggle('flipped');
    });
  
    // Fetch cards from the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          cards = data.map((card, index) => ({
            id: index + 1,
            Info: card.Info,
            Descrip: card.Descrip
          }));
          if (cards.length > 0) {
            updateCard(curCardId);
          } else {
            console.error('No cards found for the package.');
          }
        } else {
          console.error('Invalid response format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  });
