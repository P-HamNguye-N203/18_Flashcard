document.addEventListener('DOMContentLoaded', function() {
    const flashcardContainer = document.getElementById('flashcard-container');
    const startGameButton = document.getElementById('startGameButton');
    const endMessage = document.getElementById('endMessage');
    const packageId = localStorage.getItem('package_id'); // Lấy package_id từ localStorage

    startGameButton.addEventListener('click', function() {
        startGameButton.classList.add('hidden');
        startGame();
    });

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.location.href = '/FrontEnd/Flashcard/package.html'; // Chuyển hướng về trang package.html
    });

    async function startGame() {
        flashcardContainer.innerHTML = '';
        endMessage.classList.add('hidden');
        const flashcards = await fetchFlashcards();

        if (flashcards.length === 0) {
            alert('Không có thẻ nào trong gói này.');
            return;
        }

        shuffleArray(flashcards);
        displayFlashcards(flashcards);
    }

    async function fetchFlashcards() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/cards/listcard?package_id=${packageId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.flatMap(card => [
                { id: card.id, type: 'question', content: card.Info },
                { id: card.id, type: 'answer', content: card.Descrip }
            ]);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            return [];
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayFlashcards(flashcards) {
        flashcards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('flashcard');
            cardElement.textContent = card.content;
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;
            flashcardContainer.appendChild(cardElement);
        });

        const flashcardElements = document.querySelectorAll('.flashcard');
        flashcardElements.forEach(card => {
            card.addEventListener('click', function() {
                handleCardClick(card);
            });
        });
    }

    let firstCard = null;
    let secondCard = null;

    function handleCardClick(card) {
        if (firstCard === null) {
            firstCard = card;
            card.style.backgroundColor = '#cccccc';
        } else if (secondCard === null) {
            secondCard = card;
            card.style.backgroundColor = '#cccccc';
    
            if (firstCard.dataset.id === secondCard.dataset.id &&
                firstCard.dataset.type !== secondCard.dataset.type) {
                checkMatch();
            } else {
                setTimeout(() => {
                    firstCard.style.backgroundColor = '#FF0000'; // Màu đỏ cho thẻ sai
                    secondCard.style.backgroundColor = '#FF0000'; // Màu đỏ cho thẻ sai
                    setTimeout(() => {
                        firstCard.style.backgroundColor = '#e0e0e0'; // Trở lại màu gốc sau 1s
                        secondCard.style.backgroundColor = '#e0e0e0'; // Trở lại màu gốc sau 1s
                        resetCards(); // Reset các thẻ sau khi thiết lập màu
                    }, 1000);
                }, 500);
            }
        }
    }
    
    function checkMatch() {
        setTimeout(() => {
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
            checkGameEnd();
            resetCards();
        }, 500);
    }

    function resetCards() {
        firstCard = null;
        secondCard = null;
    }

    function checkGameEnd() {
        const remainingCards = document.querySelectorAll('.flashcard:not(.hidden)');
        if (remainingCards.length === 0) {
            endMessage.classList.remove('hidden');
        }
    }
});
