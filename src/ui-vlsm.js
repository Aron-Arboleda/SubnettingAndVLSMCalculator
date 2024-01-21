import { unchild } from "./index.js";
import { doVLSM } from "./logic-vlsm.js";

const contentArea = document.querySelector('main div');

const resultContainer = document.createElement('div');
resultContainer.id = 'resultContainerVLSM';

function displayResults(numberOfNetworks, ipAddress, mainPrefix, networksArray) {
    const resultHeader = document.createElement('h3');
    resultHeader.textContent = 'Results';
    
    const computedDataObject = doVLSM(numberOfNetworks, ipAddress, mainPrefix, networksArray);
    const computedDataValues = Object.values(computedDataObject);
    const initialInfoLabels = ['IP Address', 'Number of Usable Hosts', 'Main Network Subnet Mask', 'Subnet Mask in Binary', 'IP Class', 'Short Form'];
    const initialInfoTable = document.createElement('table');
    initialInfoTable.className = 'resultTables';

    for (let i = 0; i < initialInfoLabels.length; i++) {
        const row = initialInfoTable.insertRow();
        const labelCell = row.insertCell();
        labelCell.textContent = initialInfoLabels[i];
        const dataCell = row.insertCell();
        dataCell.textContent = computedDataValues[i];
    }


    const vlsmTableHeader = document.createElement('h4');
    vlsmTableHeader.textContent = 'VLSM Table';

    const vlsmInfoLabels = ['Subnet Name', 'Needed Hosts', 'Available Hosts', 'Unused Hosts', 'Network Address', 'Prefix', 'Subnet Mask', 'Usable Hosts Range', 'Broadcast Address', 'Wildcard Mask'];
    const vlsmInfoTable = document.createElement('table');
    vlsmInfoTable.className = 'subnettingTables';

    const vlsmTableHeaderRow = vlsmInfoTable.insertRow();
    for (let label of vlsmInfoLabels) {
        const labelCell = vlsmTableHeaderRow.insertCell();
        labelCell.textContent = label;
    }

    for (let i = 0; i < computedDataObject.subnets.length; i++) {
        const row = vlsmInfoTable.insertRow();
        const values = Object.values(computedDataObject.subnets[i]);
        for (let j = 0; j < values.length; j++) {
            const cell = row.insertCell();
            cell.textContent = values[j];
        }
    }

    resultContainer.append(resultHeader, initialInfoTable, vlsmTableHeader, vlsmInfoTable);
}

function showIfInputIsWrong(emptyChecker, limitChecker, warningMsgElement) {
    if (emptyChecker){
        warningMsgElement.innerHTML = '*All fields are required';
    } else if (limitChecker) {
        warningMsgElement.innerHTML = '*Please enter valid IP address / hosts needed';
    } else {
        warningMsgElement.innerHTML = '';
    }
}

function vlsmFormInit(form) {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';

    const resultButton = document.createElement('button');
    resultButton.className = 'resultButton';
    resultButton.id = 'resultButtonVLSM';
    resultButton.type = 'submit';
    resultButton.textContent = 'Compute and Show Results';
    resultButton.style.display = 'none';

    const ipAddressLabel = document.createElement('label');
    ipAddressLabel.textContent = 'IP Address';
    inputContainer.appendChild(ipAddressLabel);

    const ipAddressDiv = document.createElement('div');
    const ipAddressOctetsInputs = [];
    for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '255';
      ipAddressDiv.appendChild(input);
      ipAddressOctetsInputs.push(input);
      if (i < 3) {
        const dotLabel = document.createElement('label');
        dotLabel.textContent = ' . ';
        ipAddressDiv.appendChild(dotLabel);
      }
    }
    const slashLabel = document.createElement('label');
    slashLabel.textContent = ' / ';
    ipAddressDiv.appendChild(slashLabel);

    const prefixInput = document.createElement('input');
    prefixInput.type = 'number';
    prefixInput.min = '0';
    prefixInput.max = '32';
    ipAddressDiv.appendChild(prefixInput);

    const [ octet1, octet2, octet3, octet4 ] = ipAddressOctetsInputs;

    inputContainer.appendChild(ipAddressDiv);

    const numberOfNetworksLabel = document.createElement('label');
    numberOfNetworksLabel.textContent = 'Total number of networks needed:';
    inputContainer.appendChild(numberOfNetworksLabel);

    const numberOfNetworksInput = document.createElement('input');
    numberOfNetworksInput.type = 'number';
    numberOfNetworksLabel.placeholder = '500 is the maximum';
    numberOfNetworksInput.min = '2';
    numberOfNetworksInput.max = '500';
    inputContainer.appendChild(numberOfNetworksInput);

    form.appendChild(inputContainer);

    const nextButton = document.createElement('button');
    nextButton.className = 'nextButton';
    nextButton.id = 'nextButtonVLSM';
    nextButton.textContent = 'Continue';
    form.appendChild(nextButton);

    const warningMsg1 = document.createElement('p');
    warningMsg1.className = 'warningMsg';
    warningMsg1.id = 'warningMsg1VLSM';
    form.appendChild(warningMsg1);
    
    const numberOfNetworksContainer = document.createElement('div');
    const numberOfNetworksInputTable = document.createElement('table');
    
    

    const listOfInputs = [];

    const emptyChecker = true;
    const limitChecker = true;
    // eslint-disable-next-line no-unused-vars
    nextButton.addEventListener('click', (e) => { 
        e.preventDefault();
        unchild(numberOfNetworksContainer);
        
        const emptyChecker = (!numberOfNetworksInput.value || !octet1.value || !octet2.value || !octet3.value || !octet4.value || !prefixInput.value);
        
        const limitChecker = (parseInt(numberOfNetworksInput.value) > 500 || parseInt(numberOfNetworksInput.value) < 2) || (prefixInput.value > 30 || prefixInput.value < 0) || 
        [octet1, octet2, octet3, octet4].some(x => x.value > 255 || x.value < 0);

        showIfInputIsWrong(emptyChecker, limitChecker, warningMsg1);

        if (warningMsg1.innerHTML === ''){
            const headerRow = numberOfNetworksInputTable.insertRow();
            const networknameHeaderCell = headerRow.insertCell();
            networknameHeaderCell.textContent = 'Network Name';
            const networkHostsNeededHeaderCell = headerRow.insertCell();
            networkHostsNeededHeaderCell.textContent = 'Number of Usable Hosts Needed';
            
            for (let i = 0; i < parseInt(numberOfNetworksInput.value); i++) {
                const row = numberOfNetworksInputTable.insertRow();
                const networkNameInput = document.createElement('input');
                networkNameInput.type = 'text';
                networkNameInput.value = `Network ${i+1}`;
                row.insertCell().appendChild(networkNameInput);
    
                const networkNHostsNeededInput = document.createElement('input');
                networkNHostsNeededInput.type = 'number';
                networkNHostsNeededInput.placeholder = `Hosts`; 
                row.insertCell().appendChild(networkNHostsNeededInput);

                listOfInputs.push({networkNameInput, networkNHostsNeededInput});
            }
            resultButton.style.display = 'block';

            const sanaol = document.createElement('p');
            sanaol.textContent = 'Made with 💙 by Sanaol';
            numberOfNetworksContainer.appendChild(sanaol);
            numberOfNetworksContainer.appendChild(numberOfNetworksInputTable);
            form.appendChild(numberOfNetworksContainer);
        }
    });

    form.appendChild(resultButton);

    const warningMsg2 = document.createElement('p');
    warningMsg2.className = 'warningMsg';
    warningMsg2.id = 'warningMsg2VLSM';
    form.appendChild(warningMsg2);

    // default values for testing
    numberOfNetworksInput.value = '30';
    octet1.value = '192';
    octet2.value = '168';
    octet3.value = '2';
    octet4.value = '0';
    prefixInput.value = '24';

    resultButton.addEventListener('click', (e) => {
        e.preventDefault();
        unchild(resultContainer);

        showIfInputIsWrong(emptyChecker, limitChecker, warningMsg2);

        if (warningMsg2.innerHTML === ''){

            const numberOfNetworks = parseInt(numberOfNetworksInput.value);
            const ipAddress = [octet1.value, octet2.value, octet3.value, octet4.value].map((x) => parseInt(x));
            const mainPrefix = parseInt(prefixInput.value);
            const networksArray = listOfInputs.map(({ networkNameInput, networkNHostsNeededInput }) => ({
                networkName: networkNameInput.value,
                hostsNeeded: parseInt(networkNHostsNeededInput.value)
            }));
            displayResults(numberOfNetworks, ipAddress, mainPrefix, networksArray);
        }
    });

    
}

export function VLSMInit() {
    const title = document.createElement('h2');
    title.innerText = 'Variable Length Subnet Masking (VLSM)';
    const context = document.createElement('p');
    context.innerText = 'Variable Length Subnet Masking (VLSM) is an extension of subnetting that allows for the use of different subnet masks within the same network. Unlike standard subnetting, VLSM offers flexibility by permitting variable subnet mask lengths. This means that administrators can allocate larger subnets with longer masks to segments requiring more hosts, and smaller subnets with shorter masks to segments with fewer hosts. VLSM is instrumental in optimizing IP address allocation, especially in hierarchical network designs, ensuring efficient utilization of available address space.';

    const calculatorTitle = document.createElement('h3');
    calculatorTitle.textContent = `🧮 VLSM Calculator`;

    const form = document.createElement('form');
    form.id = 'vlsm-form';

    vlsmFormInit(form);

    
    contentArea.append(title, context, calculatorTitle, form, resultContainer);
}



