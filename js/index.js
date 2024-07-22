document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formMonsters");
    const monsterList = document.querySelector("#monster-list");
    const loadMoreButton = document.querySelector("#load-more");

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
            age: formData.get('age'),
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
});

    // Function to fetch monsters from the API
    function loadMonsters(page) {
        const url = `http://localhost:3000/monsters?_page=${page}&_limit=${monstersPerPage}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                renderMonsters(data);
            })
            .catch(error => {
                console.error("Error fetching monsters:", error);
                alert("Failed to fetch monsters. Please try again later.");
            });
    }

function renderMonsters(monsters) {
    const monsterContainer = document.querySelector("#monster-container");

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

function getMonsters() {
    fetch("http://localhost:3000/monsters")
        .then(response =>response.json())
        .then(data => {
            renderMonsters(data);
        })
        .catch(error => {
            console.error("Error fetching monsters:", error);
            alert("Failed to fetch monsters. Please try again later.");
        });
}

function addMonster(newMonster) {
    fetch("http://localhost:3000/monsters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newMonster)
    })
        .then(response =>response.json())
        .then(data => {
            console.log("Monster added successfully:", data);
            // Optionally, you can fetch all monsters again to refresh the list
            getMonsters();
        })
        .catch(error => {
            console.error("Error adding monster:", error);
            alert("Failed to add monster. Please try again later.");
        });
}