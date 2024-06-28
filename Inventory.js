// Inventory.js

var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');
const dataTable = document.getElementById('dataTable');
const policiesCountEl = document.getElementById('policiesCount');

dataTable.innerHTML = '';
var data;
var policiesCount;
var filteredData;
var searchData;
// var tableName = "checkov"
fetchyamldata('policies.yaml')


function getDatafromtabs(sideTabName) {
    const searchInput = document.getElementById('searchPolicy').value = "";
    var mainTabName = document.querySelector('.tab.active').getAttribute('data-table');
    const sideTabs = document.querySelectorAll('.side-tab');
    sideTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            sideTabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    });
    if (mainTabName === 'bugging') {
        renderTableForBugging(data.bugging, sideTabName);
    }
    else if (mainTabName === 'enforce') {
        renderEnforceTable(data.enforced, sideTabName)
    }
}

function fetchyamldata(policystatus) {
    dataTable.innerHTML = '';
    // document.querySelectorAll('.side-tab')[0].classList.add('active')
    // document.querySelectorAll('.side-tab')[1].classList.remove('active')
    // document.querySelectorAll('.side-tab')[2].classList.remove('active')

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    })
    if (policystatus) {

        var tabName = document.querySelector('.side-tab.active').getAttribute('data-table');
        // Fetch and process the YAML data
        fetch(policystatus)
            .then(response => response.text())
            .then(text => {
                data = jsyaml.load(text);
                getDatafromtabs(tabName)

            })
            .catch(error => console.error('Error loading YAML file:', error));
    }
}

// Function to render the table based on selected category
function renderTableForBugging(data, sideTabName) {
    dataTable.innerHTML = "";
    if (sideTabName !== 'checkov' && sideTabName !== 'docker' && sideTabName !== 'helm') return; // Only render for specified tabs
    filteredData = data.filter(item => item.namespace.includes(sideTabName));
    policiesCount = filteredData.length;
    const table = document.createElement('table');
    table.innerHTML = ""
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>Serial</th>
        <th>Namespace</th>
        <th>Priority</th>
        <th>Support Page</th>
        <th>Vulnerability Category</th>
    `;
    filteredData.forEach((item, index) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.namespace}</td>
            <td>${item.priority}</td>
            <td><a href="${item.supportPage}" target="_blank">${item.supportPage}</a></td>
            <td>${item.vulnerabilityCategory}</td>
        `;
    });

    dataTable.appendChild(table);
    policiesCountEl.innerText = "Total Policies : " + policiesCount
}


function renderEnforceTable(data, sideTabName) {
    dataTable.innerHTML = "";
    if (sideTabName === "checkov") {
        filteredData = data.filter(item => item.namespace.includes(sideTabName));
        searchData = data.filter(item => item.namespace.includes(sideTabName));

    }
    else {
        filteredData = data.filter(item => item.namespace.includes(`release.${sideTabName}`));
    }
    policiesCount = filteredData.length;
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>Serial</th>
        <th>Namespace</th>
        <th>Exceptions</th>

    `;
    filteredData.forEach((item, index) => {
        var exceptions;
        if (item.exceptions) {
            exceptions = item.exceptions.map(function (item) {
                return item['service'];
            });
        }
        else {
            exceptions = "";
        }

        const row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.namespace}</td>
            <td>${exceptions}</td>
        `;
    });

    dataTable.appendChild(table);
    policiesCountEl.innerText = "Total Policies : " + policiesCount;
}

function getIncubatingData() {
    dataTable.innerHTML = "<h3 class='work-progress'>Work in progress</h3>";
    policiesCountEl.innerText = " ";
}


const searchInput = document.getElementById('searchPolicy');
searchInput.addEventListener('input', function () {

    var tabName = document.querySelector('.tab.active').getAttribute('data-table');
    var sideTabName = document.querySelector('.side-tab.active').getAttribute('data-table');
    const searchText = this.value.toLowerCase();

    if (tabName === 'bugging') {
        var buggingData = data.bugging.filter(item => item.namespace.includes(sideTabName)).filter(item => item.namespace.includes(sideTabName))
        var filteredData = buggingData.filter(item => {
            return Object.values(item).some(val => String(val).toLowerCase().includes(searchText))
        })
        renderTableForBugging(filteredData, sideTabName)
    }
    else if (tabName === 'enforce') {
        var enforcedData = data.enforced.filter(item => item.namespace.includes(sideTabName)).filter(item => item.namespace.includes(sideTabName));
        var filteredData = enforcedData.filter(item => {
            return Object.values(item).some(val => String(val).toLowerCase().includes(searchText))
        })
        renderEnforceTable(filteredData, sideTabName)
    }
    else {
        var unEnforcedData = data.unenforced.filter(item => item.namespace.includes(sideTabName)).filter(item => item.namespace.includes(sideTabName));
        var filteredData = unEnforcedData.filter(item => {
            return Object.values(item).some(val => String(val).toLowerCase().includes(searchText))
        })
        renderEnforceTable(filteredData, sideTabName)
    }


})

var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
        this.childNodes[1].classList.toggle("fa-caret-down")
        this.childNodes[1].classList.toggle("fa-caret-right")
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "none") {
            dropdownContent.style.display = "block";
        } else {
            dropdownContent.style.display = "none";
        }
    });
}

var ppdropdown = document.getElementsByClassName("pp-dropdown-btn");
var i;
for (i = 0; i < ppdropdown.length; i++) {
    ppdropdown[i].addEventListener("click", function () {
        this.childNodes[1].classList.toggle("fa-caret-down")
        this.childNodes[1].classList.toggle("fa-caret-right")
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}
