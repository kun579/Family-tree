document.addEventListener('DOMContentLoaded', () => {
    const familyTreeContainer = document.getElementById('family-tree-container');
    const addMemberForm = document.getElementById('add-member-form');

    // Load the family tree from the data.json file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayFamilyTree(data.family);
        });

    addMemberForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = event.target.name.value;
        const parent = event.target.parent.value;
        
        // Fetch the current family tree, update it, and save it
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                addFamilyMember(data.family, name, parent);
                saveFamilyTree(data.family);
            });
    });

    function displayFamilyTree(family) {
        familyTreeContainer.innerHTML = generateFamilyTreeHTML(family);
    }

    function generateFamilyTreeHTML(family, parent = '') {
        let html = '<ul>';
        family.filter(member => member.parent === parent).forEach(member => {
            html += `<li>${member.name}`;
            html += generateFamilyTreeHTML(family, member.name);
            html += '</li>';
        });
        html += '</ul>';
        return html;
    }

    function addFamilyMember(family, name, parent) {
        family.push({ name, parent });
    }

    function saveFamilyTree(family) {
        // This part requires a backend to actually save the data
        // Here we just log it to the console for demonstration purposes
        console.log('Saving family tree:', family);
        // You would typically send a POST request to your server here
    }
});
