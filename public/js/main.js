/*-------------------------------------------*/

// Contact Form Section

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
  
            if (!name || !email || !message) {
                alert("All fields are required!");
                return;
            }
  
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address!");
                return;
            }

            // Submit the form after validation
            form.submit();
        });
    }
});




/*-------------------------------------------*/

// Search Section
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    searchInput.addEventListener('input', function () {
        const query = this.value;
        if (query.length > 2) { 
            fetch(`/search?q=${encodeURIComponent(query)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Processed data:', data);

                    if (data.length > 0) {
                        searchDropdown.innerHTML = data.map(item => 
                            `<div class="dropdown-item" data-ride-name="${item.name}">
                                ${item.name}
                            </div>`).join('');

                        // Add click event to each dropdown item
                        document.querySelectorAll('.dropdown-item').forEach(item => {
                            item.addEventListener('click', function () {
                                const rideName = this.getAttribute('data-ride-name');
                                window.location.href = `/rides?name=${encodeURIComponent(rideName)}`;
                            });
                        });

                        searchDropdown.classList.add('active'); // Show dropdown
                    } else {
                        searchDropdown.classList.remove('active'); // Hide dropdown if no results
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                    searchDropdown.classList.remove('active'); // Hide dropdown on error
                });
        } else {
            searchDropdown.classList.remove('active'); // Hide dropdown if input is too short
        }
    });
});



/*-------------------------------------------*/

/* Hamburger Menu */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const searchBar = document.querySelector('.search-container');
    const contactBtn = document.querySelector('.contact-button-container');
    const logoContainer = document.querySelector('.logo-container');

    hamburger.addEventListener('click', function() {
        // Toggle the active class for the hamburger and mobile-active class for other elements
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        searchBar.classList.toggle('mobile-active');
        contactBtn.classList.toggle('mobile-active');
        logoContainer.classList.toggle('mobile-active'); // Apply mobile-active to logo container as well
    });
});

/*-------------------------------------------*/

/* Nav-links Active */

const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');   


        // Store the active page in local storage
        localStorage.setItem('activePage', link.href);

        // Navigate to the link's href attribute
        window.location.href = link.href;
    });
});

const activePage = localStorage.getItem('activePage');

navLinks.forEach(link => {
    if (link.href === activePage) {
        link.classList.add('active');
    }
});



/*-------------------------------------------*/

/* Memory Game */

document.addEventListener("DOMContentLoaded", () => {
    const memoryGameContainer = document.getElementById('memory-game');
    
    const images = [
        '/images/ferris-wheel-icon.png',
        '/images/roller-coaster-icon.png',
        '/images/water-slide-icon.png'
    ];

    const cardsArray = [...images, ...images]; // Duplicate array to create pairs

    // Shuffle cards
    const shuffledCards = cardsArray.sort(() => 0.5 - Math.random());

    // Create the cards and append to memory game container
    shuffledCards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.image = image;
        
        // Create front (black) and back (image) faces
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        const imgElement = document.createElement('img');
        imgElement.src = image;
        backFace.appendChild(imgElement);
        
        card.appendChild(frontFace);
        card.appendChild(backFace);
        
        memoryGameContainer.appendChild(card);

        // Add event listeners to the cards after adding them to the DOM
        card.addEventListener('click', flipCard);
    });

    // Game logic
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;
    let matchesFound = 0; // Keep track of matched pairs

    function flipCard() {
        if (lockBoard) return; // Prevent flipping more than two cards
        if (this === firstCard) return; // Prevent flipping the same card twice

        this.classList.add('flip'); // Add flip class to show image

        if (!hasFlippedCard) {
            // First card flip
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Second card flip
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            // Cards match
            disableCards();
            matchesFound++; // Increment matches counter

            if (matchesFound === images.length) {
                // If all pairs are matched, display "Well done!"
                displayEndMessage();
            }
        } else {
            // Cards don't match
            unflipCards();
        }
    }

    function disableCards() {
        // Disable click on matched cards
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true; // Lock the board to prevent more flipping
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function displayEndMessage() {
        const endMessage = document.createElement('h3');
        endMessage.textContent = "Bravo!";
        endMessage.classList.add('game-end-message'); // Add the class
        memoryGameContainer.parentNode.insertBefore(endMessage, memoryGameContainer.nextSibling); // Insert after the game container
    
        // Show the reset button
        const resetButton = document.getElementById('reset-game');
        resetButton.style.display = 'block';
        resetButton.addEventListener('click', resetGame);
    }

    function resetGame() {
        // Remove the "Bravo!" message and hide the button
        const endMessage = document.querySelector('.game-end-message');
        if (endMessage) {
            endMessage.remove();
        }
    
        const resetButton = document.getElementById('reset-game');
        resetButton.style.display = 'none'; // Hide the reset button
    
        // Reset game without reloading the page
        memoryGameContainer.innerHTML = ''; // Clear the container
        matchesFound = 0; // Reset match count
        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.image = image;
    
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
    
            const backFace = document.createElement('div');
            backFace.classList.add('back-face');
            const imgElement = document.createElement('img');
            imgElement.src = image;
            backFace.appendChild(imgElement);
    
            card.appendChild(frontFace);
            card.appendChild(backFace);
    
            memoryGameContainer.appendChild(card);
            card.addEventListener('click', flipCard); // Reattach event listener
        });
    }
});




