import { unchild } from "./index.js";
import { doVLSM } from "./logic-vlsm.js";
import * as logic from "./generalLogic.js";

const contentArea = document.querySelector('main div');

export function validityCheckerVLSM1(arrayOfInputs, warningMsgElem) {
    const [ octet1, octet2, octet3, octet4, prefixInput, totalSubnetsInput ] = arrayOfInputs;

    let valid = true;
    let message = '';
    let wrongInputFields = [];

    const totalSubnetsInputValue = parseInt(totalSubnetsInput.value);
    const prefixInputValue = parseInt(prefixInput.value);

    for (const octetInput of [octet1, octet2, octet3, octet4]){
        const value = parseInt(octetInput.value);
        if ((value > 255 || value < 0) || isNaN(value)) {
            wrongInputFields.push(octetInput);
        }
    }

    if ((prefixInputValue < 1 || prefixInputValue > 30) || isNaN(prefixInputValue)) {
        wrongInputFields.push(prefixInput);
    }

    if ((totalSubnetsInputValue < 2 || totalSubnetsInputValue > 500) || isNaN(totalSubnetsInputValue)) {
        wrongInputFields.push(totalSubnetsInput);
    }

    if (totalSubnetsInputValue > Math.pow(2, 32 - prefixInputValue - 2)){
        if (!(wrongInputFields.includes(totalSubnetsInput))){
            wrongInputFields.push(totalSubnetsInput);
            valid = false;
            message = `*The inputted /${prefixInput.value} network has only ${Math.pow(2, 32 - prefixInputValue - 2)} subnet capacity`;
        }
    }

    if (wrongInputFields.length > 0){
        valid = false;
    }

    message = (valid == false && message === '') ? '*Please double check your inputs. *All fields are required' : message;
    
    warningMsgElem.textContent = message;
    wrongInputFields.forEach((input) => {
        input.classList.add('wrongInput');
    });

    return valid;
}


export function validityCheckerVLSM2(prefixInput, hostInputs, warningMsgElem) {
    let valid = true;
    let message = '';
    let wrongInputFields = [];

    const prefixInputValue = parseInt(prefixInput.value);

    hostInputs.forEach((hostInput) => {
        if ((parseInt(hostInput.value) > logic.totalHostsOfNetwork(prefixInputValue) - 2) || hostInput.value === '' || parseInt(hostInput.value) < 0){
            wrongInputFields.push(hostInput);
            valid = false;
        }
    });

    if (valid){
        const hostInputsValues = Array.from(hostInputs).map(input => parseInt(input.value));
        const capacities = hostInputsValues.map(value => logic.getCapacity(value)[0]);
        const sum = capacities.reduce((a, b) => a + b);

        if (sum > logic.totalHostsOfNetwork(parseInt(prefixInput.value))){
            valid = false;
            message = `*The inputted /${prefixInput.value} network has only ${logic.totalHostsOfNetwork(parseInt(prefixInput.value))} total hosts. The computed sum of total hosts needed for the values above are ${sum}.`;
        }
    }
    
    message = (valid == false && message === '') ? '*Please double check your inputs. *All fields are required.' : message;
    
    console.log(wrongInputFields);
    warningMsgElem.textContent = message;
    wrongInputFields.forEach((input) => {
        input.classList.add('wrongInput');
    });

    return valid;
}

export function removeRedBorders(arrayOfInputElements) {
    for (const input of arrayOfInputElements) {
        input.classList.remove('wrongInput');
    }
}
function displayResults(resultContainer, numberOfNetworks, ipAddress, mainPrefix, networksArray) {
    const resultHeader = document.createElement('h3');
    resultHeader.textContent = 'Results';
    
    const computedDataObject = doVLSM(numberOfNetworks, ipAddress, mainPrefix, networksArray);
    const computedDataValues = Object.values(computedDataObject);
    const initialInfoLabels = ['IP Address', 'Number of Usable Hosts', 'Main Network Subnet Mask', 'Subnet Mask in Binary', 'IP Class', 'IP Type', 'Short Form'];
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

    for (let i = 0; i < computedDataObject.vlsmSubnets.length; i++) {
        const row = vlsmInfoTable.insertRow();
        const values = Object.values(computedDataObject.vlsmSubnets[i]);
        for (let j = 0; j < values.length; j++) {
            const cell = row.insertCell();
            cell.textContent = values[j];
        }
    }

    resultContainer.append(resultHeader, initialInfoTable, vlsmTableHeader, vlsmInfoTable);
}

function vlsmFormInit(form) {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';

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
      input.className = 'inputfield numberInput octetInput initialElement';
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
    prefixInput.min = '1';
    prefixInput.max = '30';
    prefixInput.className = 'inputfield numberInput prefixInput initialElement';
    ipAddressDiv.appendChild(prefixInput);

    const [ octet1, octet2, octet3, octet4 ] = ipAddressOctetsInputs;

    inputContainer.appendChild(ipAddressDiv);

    const numberOfNetworksLabel = document.createElement('label');
    numberOfNetworksLabel.textContent = 'Total number of networks needed:';
    inputContainer.appendChild(numberOfNetworksLabel);

    const numberOfNetworksInput = document.createElement('input');
    numberOfNetworksInput.type = 'number';
    numberOfNetworksInput.placeholder = '(500 max)';
    numberOfNetworksInput.min = '2';
    numberOfNetworksInput.max = '500';
    numberOfNetworksInput.className = 'inputfield numberInput initialElement';

    inputContainer.appendChild(numberOfNetworksInput);

    form.appendChild(inputContainer);

    const continueButton = document.createElement('button');
    continueButton.className = 'proceedButtons';
    continueButton.id = 'continueButtonVLSM';
    continueButton.textContent = 'Continue';
    form.appendChild(continueButton);

    const warningMsg1 = document.createElement('p');
    warningMsg1.className = 'warningMsg';
    warningMsg1.id = 'warningMsg1VLSM';
    form.appendChild(warningMsg1);
    
    

    const subContainerForContinue = document.createElement('div');
    subContainerForContinue.id = 'subContainerForContinue';

    continueButton.addEventListener('click', (e) => { 
        e.preventDefault();
        unchild(subContainerForContinue);

        removeRedBorders(document.querySelectorAll('input[type="number"]'));

        const valid = validityCheckerVLSM1(document.querySelectorAll('input[type="number"]'), warningMsg1);

        if (valid){
            removeRedBorders(document.querySelectorAll('input[type="number"]'));

            const numberOfNetworksInputTable = document.createElement('table');
            numberOfNetworksInputTable.id = 'numberOfNetworksInputTable';
            const headerRow = numberOfNetworksInputTable.insertRow();
            headerRow.className = 'headerRow';
            const networknameHeaderCell = headerRow.insertCell();
            networknameHeaderCell.textContent = 'Network Name';
            const networkHostsNeededHeaderCell = headerRow.insertCell();
            networkHostsNeededHeaderCell.textContent = 'Usable Hosts Needed';
            
            const listOfInputs = [];
            
            for (let i = 0; i < parseInt(numberOfNetworksInput.value); i++) {
                const row = numberOfNetworksInputTable.insertRow();
                const networkNameInput = document.createElement('input');
                networkNameInput.type = 'text';
                networkNameInput.value = `Network ${i+1}`;
                networkNameInput.className = 'inputfield textInput subElement';
                row.insertCell().appendChild(networkNameInput);
    
                const networkNHostsNeededInput = document.createElement('input');
                networkNHostsNeededInput.type = 'number';
                networkNHostsNeededInput.placeholder = `Hosts`; 
                networkNHostsNeededInput.className = 'inputfield numberInput hostTableInput subElement';
                row.insertCell().appendChild(networkNHostsNeededInput);

                listOfInputs.push({networkNameInput, networkNHostsNeededInput});
            }
            subContainerForContinue.appendChild(numberOfNetworksInputTable);

            const warningMsg2 = document.createElement('p');
            warningMsg2.className = 'warningMsg';
            warningMsg2.id = 'warningMsg2VLSM';
            subContainerForContinue.appendChild(warningMsg2);

            const resultButton = document.createElement('button');
            resultButton.className = 'proceedButtons';
            resultButton.id = 'resultButtonVLSM';
            resultButton.type = 'submit';
            resultButton.textContent = 'Compute and Show Results';

            const resultContainer = document.createElement('div');
            resultContainer.id = 'resultContainerVLSM';

            resultButton.addEventListener('click', (e) => {
                e.preventDefault();
                unchild(resultContainer);
                
                removeRedBorders(document.querySelectorAll('.hostTableInput.subElement'));

                const valid = validityCheckerVLSM1(document.querySelectorAll('.initialElement'), warningMsg1) && validityCheckerVLSM2(prefixInput,document.querySelectorAll('.hostTableInput.subElement'), warningMsg2);
                
                if (valid){
                    removeRedBorders(document.querySelectorAll('input[type="number"]'));

                    const numberOfNetworks = parseInt(numberOfNetworksInput.value);
                    const ipAddress = [octet1.value, octet2.value, octet3.value, octet4.value].map((x) => parseInt(x));
                    const mainPrefix = parseInt(prefixInput.value);
                    const networksArray = listOfInputs.map(({ networkNameInput, networkNHostsNeededInput }) => ({
                        networkName: networkNameInput.value,
                        hostsNeeded: parseInt(networkNHostsNeededInput.value)
                    }));
                    displayResults(resultContainer, numberOfNetworks, ipAddress, mainPrefix, networksArray);
                }
            });
            subContainerForContinue.appendChild(resultButton);

            subContainerForContinue.appendChild(resultContainer);
            
        }
    });

    form.appendChild(subContainerForContinue);

    

    
    // default values for testing
    numberOfNetworksInput.value = '4';
    octet1.value = '192';
    octet2.value = '168';
    octet3.value = '2';
    octet4.value = '0';
    prefixInput.value = '24';

    

    
}

export function VLSMInit() {
    const title = document.createElement('h2');
    title.innerText = 'Variable Length Subnet Masking (VLSM)';
    const context = document.createElement('p');
    context.innerText = 'Variable Length Subnet Masking (VLSM) is an extension of subnetting that allows for the use of different subnet masks within the same network. Unlike standard subnetting, VLSM offers flexibility by permitting variable subnet mask lengths. This means that administrators can allocate larger subnets with longer masks to segments requiring more hosts, and smaller subnets with shorter masks to segments with fewer hosts. VLSM is instrumental in optimizing IP address allocation, especially in hierarchical network designs, ensuring efficient utilization of available address space.';

    const calculatorTitle = document.createElement('h3');
    calculatorTitle.textContent = `🧮 VLSM Calculator`;

    const noteContainerVLSM = document.createElement('div');
    noteContainerVLSM.className = 'noteContainer';
    noteContainerVLSM.innerHTML = `
        Total number of networks (subnets) reference:<br>
        • Prefix /8 - /15, total subnets may vary around: 65,536 upto 4,194,304 networks<br>
        • Prefix /16 - /23, total subnets may vary around: 128 upto 32,768 networks<br>
        • Prefix /24 - /30, total subnets may vary around: 1 upto 64 networks<br>
        Total usable hosts reference:<br>
        • Prefix /8 - /15, usable hosts may vary around: 131,070 upto 16,777,214 hosts<br>
        • Prefix /16 - /23, usable hosts may vary around: 510 upto 65,534 hosts<br>
        • Prefix /24 - /30, usable hosts may vary around: 2 upto 254 hosts
    `;

    const form = document.createElement('form');
    form.id = 'vlsm-form';

    vlsmFormInit(form);

    
    contentArea.append(title, context, calculatorTitle, noteContainerVLSM, form);
}



