let data = [];
let currentFilters = {
    column: '',
    color: '',
    phase: '',
    visibleColumns: ['Phase', 'Action', 'Description', 'SUG', 'DRILLED', 'FORMED', 'TRIBAL', 'Notes'],
    generals: false, // new property
    word: ''
};


fetch('MEG_prompted_actions.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        buildTable(data);
    });

function buildTable(data) {
    let table = document.getElementById('dataTable');
    table.innerHTML = '';
    let tHead = table.createTHead();
    let row = tHead.insertRow();
    for (let key of Object.keys(data[0])) {
        if (currentFilters.visibleColumns.includes(key)) {
            let th = document.createElement('th');
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            if (currentFilters.visibleColumns.includes(key)) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
                if (key === 'SUG' || key === 'DRILLED' || key === 'FORMED' || key === 'TRIBAL') {
                    cell.classList.add(element[key]);
                }
                if (element[key] === 'WHITE' || element[key] === 'GREEN' || element[key] === 'YELLOW' || element[key] === 'RED') {
                    cell.style.backgroundColor = element[key];
                }
                if (element[key] === 'NA') {
                    cell.style.backgroundColor = 'grey';
                }
            }
        }
    }
}

function filterGenerals() {
    currentFilters.generals = !currentFilters.generals;
    let generalsButton = document.getElementById('btn-Generals');
    if (currentFilters.generals) {
        generalsButton.classList.add('selected');
    } else {
        generalsButton.classList.remove('selected');
    }
    applyFilters();
}

function filterByWord(word) {
    word = word.replace(/_/g, ' ');  // replace underscores with spaces
    if (currentFilters.word === word) {
        currentFilters.word = '';
        document.getElementById(`btn-${word.replace(/\s/g, '_')}`).classList.remove('selected');
    } else {
        let previousSelectedButton = document.getElementById(`btn-${currentFilters.word.replace(/\s/g, '_')}`);
        if (previousSelectedButton) previousSelectedButton.classList.remove('selected');
        currentFilters.word = word;
        document.getElementById(`btn-${word.replace(/\s/g, '_')}`).classList.add('selected');
    }
    applyFilters();
}


function filterColumn(column) {
    if (currentFilters.column === column) {
        currentFilters.column = '';
        document.getElementById(`btn-${column}`).classList.remove('selected');
        currentFilters.visibleColumns = ['Phase', 'Action', 'Description', 'SUG', 'DRILLED', 'FORMED', 'TRIBAL', 'Notes'];
    } else {
        let previousSelectedButton = document.getElementById(`btn-${currentFilters.column}`);
        if (previousSelectedButton) previousSelectedButton.classList.remove('selected');
        currentFilters.column = column;
        document.getElementById(`btn-${column}`).classList.add('selected');
        currentFilters.visibleColumns = ['Phase', 'Action', 'Description', column, 'Notes'];
    }
    applyFilters();
}


function filterColor(color) {
    if (currentFilters.color === color) {
        currentFilters.color = '';
        document.getElementById(`btn-${color}`).classList.remove('selected');
    } else {
        let previousSelectedButton = document.getElementById(`btn-${currentFilters.color}`);
        if (previousSelectedButton) previousSelectedButton.classList.remove('selected');
        currentFilters.color = color;
        document.getElementById(`btn-${color}`).classList.add('selected');
    }
    applyFilters();
}

function filterByPhase(phase) {
    let phaseId = phase.replace(/ /g, '_');
    if (currentFilters.phase === phaseId) {
        currentFilters.phase = '';
        document.getElementById(`btn-${phaseId}`).classList.remove('selected');
    } else {
        let previousSelectedButton = document.getElementById(`btn-${currentFilters.phase}`);
        if (previousSelectedButton) previousSelectedButton.classList.remove('selected');
        currentFilters.phase = phaseId;
        document.getElementById(`btn-${phaseId}`).classList.add('selected');
    }
    applyFilters();
}

function applyFilters() {
    let filteredData = data.filter(item => {
        let colorFilterPassed = true;
        if (currentFilters.color) {
            let colorsToInclude = [];
            if (currentFilters.color === 'RED') {
                colorsToInclude = ['WHITE', 'GREEN', 'YELLOW', 'RED'];
            }
            if (currentFilters.color === 'YELLOW') {
                colorsToInclude = ['WHITE', 'GREEN', 'YELLOW'];
            }
            if (currentFilters.color === 'GREEN') {
                colorsToInclude = ['WHITE', 'GREEN'];
            }
            if (currentFilters.color === 'WHITE') {
                colorsToInclude = ['WHITE'];
            }
            if (!currentFilters.column) {
                colorFilterPassed = colorsToInclude.includes(item['SUG']) ||
                                    colorsToInclude.includes(item['DRILLED']) ||
                                    colorsToInclude.includes(item['FORMED']) ||
                                    colorsToInclude.includes(item['TRIBAL']);
            } else {
                colorFilterPassed = colorsToInclude.includes(item[currentFilters.column]);
            }
        }

        let phaseFilterPassed = !currentFilters.phase || item.Phase === currentFilters.phase.replace(/_/g, ' ');
        let generalsFilterPassed = !currentFilters.generals || ['E1', 'CM1', 'CM2'].includes(item.Action);
        let wordFilterPassed = !currentFilters.word || item.Description.toLowerCase().includes(currentFilters.word.toLowerCase());
        
        return colorFilterPassed && phaseFilterPassed && generalsFilterPassed && wordFilterPassed;
    });
    buildTable(filteredData);
}




function clearFilters() {
    let previousSelectedColumnButton = document.getElementById(`btn-${currentFilters.column}`);
    if (previousSelectedColumnButton) previousSelectedColumnButton.classList.remove('selected');
    let previousSelectedColorButton = document.getElementById(`btn-${currentFilters.color}`);
    if (previousSelectedColorButton) previousSelectedColorButton.classList.remove('selected');
    let previousSelectedPhaseButton = document.getElementById(`btn-${currentFilters.phase.replace(/ /g, '_')}`);
    if (previousSelectedPhaseButton) previousSelectedPhaseButton.classList.remove('selected');
    let previousSelectedWordButton = document.getElementById(`btn-${currentFilters.word}`);
    if (previousSelectedWordButton) previousSelectedWordButton.classList.remove('selected');
    currentFilters = {
        column: '',
        color: '',
        phase: '',
        visibleColumns: ['Phase', 'Action', 'Description', 'SUG', 'DRILLED', 'FORMED', 'TRIBAL', 'Notes'],
        word: ''
    };
    buildTable(data);
}

