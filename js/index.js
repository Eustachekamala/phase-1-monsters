document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formMonsters");
    const monsterContainer = document.querySelector("#monster-container");
    const loadMoreButton = document.querySelector("#forward");
    const backLoadButton = document.querySelector("#back");

    let currentPage = 1;
    const monstersPerPage = 50;

    // Load first 50 monsters on page load
    loadMonsters(currentPage);

    // Form submission to add a new monster
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newMonster = {
            name: formData.get('name'),
            age: parseInt(formData.get('age')), // Parse age to ensure it's a number
            description: formData.get('description')
        };

        addMonster(newMonster)
            .then(() => {
                // Clear form fields after successfully adding monster
                form.reset();
                // Reload current page of monsters to reflect the new addition
                loadMonsters(currentPage);
            })
            .catch(error => {
                console.error("Error adding monster:", error);
                alert("Failed to add monster. Please try again later.");
            });
    });

    // Load more monsters when "Load More" button is clicked
    loadMoreButton.addEventListener("click", () => {
        currentPage++;
        loadMonsters(currentPage);
    });

    // Load previous page of monsters when "Back" button is clicked
    backLoadButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadMonsters(currentPage);
        }
    });

    // Function to fetch monsters from the API
    function loadMonsters(page) {
        const url = `http://localhost:3000/monsters?_page=${page}&_limit=${monstersPerPage}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                renderMonsters(data);
                // Enable or disable "Back" button based on current page
                backLoadButton.disabled = (currentPage === 1);
            })
            .catch(error => {
                console.error("Error fetching monsters:", error);
                alert("Failed to fetch monsters. Please try again later.");
            });
    }

    // Function to render monsters in the UI
    function renderMonsters(monsters) {
        // Clear existing content in monsterContainer
        monsterContainer.innerHTML = '';

        monsters.forEach(monster => {
            const monsterElement = document.createElement("div");
            monsterElement.classList.add("monster-card");
            monsterElement.innerHTML = `
                <p>Name: ${monster.name}</p>
                <p>Age: ${monster.age}</p>
                <p>Description: ${monster.description}</p>
            `;
            monsterContainer.appendChild(monsterElement);
        });
    }

    // Function to add a new monster via POST request
    function addMonster(newMonster) {
        return fetch("http://localhost:3000/monsters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMonster)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add monster");
                }
                return response.json();
            });
    }
});
