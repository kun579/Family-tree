document.addEventListener('DOMContentLoaded', () => {
    const familyTreeContainer = document.getElementById('family-tree-container');
    const addMemberForm = document.getElementById('add-member-form');
    const downloadPngButton = document.getElementById('download-png');

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

    downloadPngButton.addEventListener('click', () => {
        domtoimage.toPng(document.getElementById('family-tree-container'))
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'family-tree.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('Error generating PNG:', error);
            });
    });

    function createFamilyTree(family) {
        familyTreeContainer.innerHTML = ''; // Clear existing tree

        const width = 960;
        const height = 500;

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

        node.append('rect')
            .attr('width', 100)
            .attr('height', 50)
            .attr('x', -50)
            .attr('y', -25)
            .attr('rx', 10)
            .attr('ry', 10);

        node.append('text')
            .attr('dy', 3)
            .attr('x', 0)
            .style('text-anchor', 'middle')
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
