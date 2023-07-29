document.addEventListener('DOMContentLoaded', () => {

    // Fetch JSON data
    fetch('terrain.json')  
      .then(response => response.json())
      .then(data => {
  
        // Get unique territory types  
        let territoryTypes = new Set();
        for (let terrain in data) {
          let terrainObj = data[terrain];
          for (let type of terrainObj.territory_types) {
            territoryTypes.add(type);
          }
        }
  
        // Create filter buttons
        let buttons = '';
        for (let type of territoryTypes) {
          if (type !== 'any') {
            buttons += `<button class="filter-btn" data-type="${type}">${type}</button>`;
          }
        }
        document.getElementById('filter-buttons').innerHTML = buttons;
        
        // Display all terrain initially
        displayTerrain(data);
        
        // Filter on button click
        document.querySelectorAll('.filter-btn').forEach(button => {
          button.addEventListener('click', () => {
            
            // Make copy of data
            let filtered = Object.assign({}, data);
            
            // Filter the copy
            filtered = filterTerrain(filtered, button.dataset.type);
            
            // Display copied filtered data
            displayTerrain(filtered);
          });
        });
        
      });
  
      function filterTerrain(data, type) {

        // Filtered data
        let filtered = {};
      
        // First add 'any' terrain
        for (let terrain in data) {
          if (data[terrain].territory_types.includes('any')) {
            filtered[terrain] = data[terrain];
          }
        }
      
        // Then add matched terrain
        for (let terrain in data) {
          if (data[terrain].territory_types.includes(type)) {
            filtered[terrain] = data[terrain];
          } 
        }
      
        return filtered;
      
      }

      function displayTerrain(filtered) {

        let terrainHTML = `
          <table>
            <tr>
              <th>Name</th>
              <th>Territory Types</th>
              <th>Movement</th>
              <th>Description</th>
              <th>Visibility</th>
              <th>Cover</th>
              <th>Special Rules</th>
            </tr>
        `;
      
        for (let terrain in filtered) {
      
          let movement = filtered[terrain].movement;
          let rowColor;
      
          if (movement === 'good going') {
            rowColor = '#629D84';
          } else if (movement === 'rough') {
            rowColor = '#FFF799'; 
          } else if (movement === 'difficult') {
            rowColor = '#E69279';
          }
      
          terrainHTML += `
            <tr style="background-color: ${rowColor}">
              <td>${filtered[terrain].name}</td>
              <td>${filtered[terrain].territory_types}</td>
              <td>${filtered[terrain].movement}</td>
              <td>${filtered[terrain].description}</td>
              <td>${filtered[terrain].visibility}</td>
              <td>${filtered[terrain].cover}</td>
              <td>${filtered[terrain].special_rules}</td>
            </tr>
          `;
      
        }
      
        terrainHTML += `</table>`;
      
        document.getElementById('terrain-data').innerHTML = terrainHTML;
      
      }
  
  });