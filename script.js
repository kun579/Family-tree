document.addEventListener('DOMContentLoaded', () => {
    const familyTreeContainer = document.getElementById('family-tree-container');
    const addMemberForm = document.getElementById('add-member-form');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            createFamilyTree(data.family);
        });

    addMemberForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = event.target.name.value;
        const parent = event.target.parent.value;

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                addFamilyMember(data.family, name, parent);
                saveFamilyTree(data.family);
                createFamilyTree(data.family); // Update the tree
            });
    });

    function createFamilyTree(family) {
        familyTreeContainer.innerHTML = ''; // Clear existing tree

        const width = 800;
        const height = 600;

        const treeData = convertToTreeData(family);
        const root = d3.hierarchy(treeData);

        const treeLayout = d3.tree().size([height, width - 160]);
        treeLayout(root);

        const svg = d3.select('#family-tree-container').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(80,0)');

        const link = svg.selectAll('.link')
            .data(root.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = svg.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('r', 5);

        node.append('text')
            .attr('dy', 3)
            .attr('x', d => d.children ? -8 : 8)
            .style('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name);
    }

    function convertToTreeData(family) {
        const root = { name: "Root", children: [] };
        const map = { "": root };

        family.forEach(member => {
            map[member.name] = map[member.name] || { name: member.name, children: [] };
            if (member.parent === "") {
                root.children.push(map[member.name]);
            } else {
                map[member.parent] = map[member.parent] || { name: member.parent, children: [] };
                map[member.parent].children.push(map[member.name]);
            }
        });

        return root;
    }

    function addFamilyMember(family, name, parent) {
        family.push({ name, parent });
    }

    function saveFamilyTree(family) {
        console.log('Saving family tree:', family);
    }
});
