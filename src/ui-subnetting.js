import { unchild } from "./index.js";
import { doSubnetting } from "./logic-subnetting.js";
import * as logic from "./generalLogic.js";

const contentArea = document.querySelector('main div');

const resultContainer = document.createElement('div');
resultContainer.id = 'resultContainerSubnetting';

export function validityCheckerSubnetting(arrayOfInputs) {
    const [ radioButtonA, radioButtonB, radioButtonC, hostInput, octet1, octet2, octet3, octet4, prefixInput ] = arrayOfInputs;

    let classType = '';
    for (const radioButton of [radioButtonA, radioButtonB, radioButtonC]) {
        if (radioButton.checked) {
            classType = radioButton.value;
        }
    }

    let valid = true;
    let message = '';
    let wrongInputFields = [];

    const hostInputValue = parseInt(hostInput.value);
    const prefixInputValue = parseInt(prefixInput.value);

    if (classType === 'A'){
        if ((hostInputValue > 2147483646 || hostInputValue < 2) || isNaN(hostInputValue)) {
            wrongInputFields.push(hostInput);
        }
        
        if ((prefixInputValue < 1 || prefixInputValue > 30) || isNaN(prefixInputValue)) {
            wrongInputFields.push(prefixInput);
        }
    } else if (classType === 'B'){
        if ((hostInputValue > 32766 || hostInputValue < 2) || isNaN(hostInputValue)) {
            wrongInputFields.push(hostInput);
        }
        
        if ((prefixInputValue < 16 || prefixInputValue > 30) || isNaN(prefixInputValue)) {
            wrongInputFields.push(prefixInput);
        }
    } else if (classType === 'C'){
        if ((hostInputValue > 126 || hostInputValue < 2) || isNaN(hostInputValue)) {
            wrongInputFields.push(hostInput);
        }
        
        if ((prefixInputValue < 24 || prefixInputValue > 30) || isNaN(prefixInputValue)) {
            wrongInputFields.push(prefixInput);
        }
    } 

    for (const octetInput of [octet1, octet2, octet3, octet4]){
        const value = parseInt(octetInput.value);
        if ((value > 255 || value < 0) || isNaN(value)) {
            wrongInputFields.push(octetInput);
        }
    }


    if (hostInputValue > logic.totalHostsOfNetwork(prefixInputValue) - 2){
        if (!(wrongInputFields.includes(hostInput))){
            wrongInputFields.push(hostInput);
            valid = false;
            message = `*The inputted /${prefixInput.value} network has only ${logic.totalHostsOfNetwork(parseInt(prefixInput.value)) - 2} usable hosts`;
        }
    }

    if (wrongInputFields.length > 0){
        valid = false;
    }

    message = (valid == false && message === '') ? '*Please double check your inputs. *All fields are required' : message;
    
    return [ valid, message, wrongInputFields ];
}

function displayResults(networkClass, usableHosts, ipAddress, prefix) {
    const resultHeader = document.createElement('h3');
    resultHeader.textContent = 'Results';
    
    const computedDataObject = doSubnetting(networkClass, usableHosts, ipAddress, prefix);
    const computedDataValues = Object.values(computedDataObject);
    const initialInfoLabels = ['IP Address:', 'Total Number of Hosts per Subnet:', 'Number of Usable Hosts per Subnet:', 'Total Subnets Created:', 'Subnet Mask:', 'Binary Subnet Mask:', 'Wildcard Mask:', 'Network Class:', 'CIDR Notation:', 'IP Type:', 'Short Form:'];
    const initialInfoTable = document.createElement('table');
    initialInfoTable.className = 'resultTables';

    for (let i = 0; i < initialInfoLabels.length; i++) {
        const row = initialInfoTable.insertRow();
        const labelCell = row.insertCell();
        labelCell.textContent = initialInfoLabels[i];
        const dataCell = row.insertCell();
        dataCell.textContent = computedDataValues[i];
    }

    const subnetTableHeader = document.createElement('h4');
    subnetTableHeader.textContent = 'Subnetting Table';

    const subnettingInfoLabels = ['Subnet', 'Network Address', 'First Usable Host', 'Last Usable Host', 'Broadcast Address', 'Number of Usable Hosts', 'Subnet Mask', 'Prefix'];
    const subnettingInfoTable = document.createElement('table');
    subnettingInfoTable.className = 'subnettingTables';

    const subnettingTableHeaderRow = subnettingInfoTable.insertRow();
    for (let label of subnettingInfoLabels) {
        const labelCell = subnettingTableHeaderRow.insertCell();
        labelCell.textContent = label;
    }

    for (let i = 0; i < computedDataObject.subnets.length; i++) {
        const row = subnettingInfoTable.insertRow();
        const values = Object.values(computedDataObject.subnets[i]);
        for (let j = 0; j < values.length; j++) {
            const cell = row.insertCell();
            cell.textContent = values[j];
        }
    }

    resultContainer.append(resultHeader, initialInfoTable, subnetTableHeader, subnettingInfoTable);
}

function subnettingFormInit(form) {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';

    const networkClassLabel = document.createElement('label');
    networkClassLabel.textContent = 'Network Class';
    inputContainer.appendChild(networkClassLabel);

    const networkClassDiv = document.createElement('div');
    networkClassDiv.id = 'networkClassDiv';
    const networkClassInputs = ['A', 'B', 'C'].map((labelText) => {
        const radioButtonContainer = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'abc';
        input.value = labelText;
        input.className = 'radioButton';
        const label = document.createElement('label');
        label.textContent = labelText;
        radioButtonContainer.appendChild(input);
        radioButtonContainer.appendChild(label);
        networkClassDiv.appendChild(radioButtonContainer);
        return input;
    });
    inputContainer.appendChild(networkClassDiv);

    const hostLabel = document.createElement('label');
    hostLabel.textContent = 'Host needed per subnet';
    inputContainer.appendChild(hostLabel);

    const hostInput = document.createElement('input');
    hostInput.type = 'number';
    hostInput.min = '2';
    hostInput.max = '2147483648';
    hostInput.className = 'inputfield numberInput';
    inputContainer.appendChild(hostInput);

    const ipAddressLabel = document.createElement('label');
    ipAddressLabel.textContent = 'Main IP Address';
    inputContainer.appendChild(ipAddressLabel);

    const ipAddressDiv = document.createElement('div');
    const ipAddressOctetsInputs = [];
    for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '255';
      input.className = 'inputfield numberInput octetInput';
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
    prefixInput.className = 'inputfield numberInput prefixInput';
    ipAddressDiv.appendChild(prefixInput);

    const [ octet1, octet2, octet3, octet4 ] = ipAddressOctetsInputs;

    inputContainer.appendChild(ipAddressDiv);

    form.appendChild(inputContainer);

    const resultButton = document.createElement('button');
    resultButton.className = 'proceedButtons';
    resultButton.id = 'resultButtonSubnetting';
    resultButton.type = 'submit';
    resultButton.textContent = 'Compute and Show Results';
    form.appendChild(resultButton);

    const warningMsg = document.createElement('p');
    warningMsg.className = 'warningMsg';
    warningMsg.id = 'warningMsgSubnetting';
    form.appendChild(warningMsg);

    // default values
    networkClassInputs[2].checked = true;
    hostInput.value = '30';
    octet1.value = '192';
    octet2.value = '168';
    octet3.value = '2';
    octet4.value = '0';
    prefixInput.value = '24';

    resultButton.addEventListener('click', (e) => {
        e.preventDefault();
        unchild(resultContainer);
        for (const input of document.querySelectorAll('input[type="number"]')) {
            input.classList.remove('wrongInput');
        }

        const [ valid, message, wrongInputFields ] = validityCheckerSubnetting(document.querySelectorAll('input'));
        
        warningMsg.textContent = message;
        
        wrongInputFields.forEach((input) => {
            input.classList.add('wrongInput');
        });

        if (valid){
            for (const input of document.querySelectorAll('input[type="number"]')) {
                input.classList.remove('wrongInput');
            }
            const networkClass = networkClassInputs.filter((input) => input.checked)[0].value;
            const hosts = parseInt(hostInput.value);
            const ipAddress = [octet1.value, octet2.value, octet3.value, octet4.value].map((x) => parseInt(x));
            const prefix = parseInt(prefixInput.value);
            displayResults(networkClass, hosts, ipAddress, prefix);
        }
    });
}

export function SubnettingInit() {
    const title = document.createElement('h2');
    title.innerText = 'Subnetting';
    const context = document.createElement('p');
    context.innerText = 'Subnetting is a crucial aspect of IP network design achieved by dividing a larger network into smaller subnets. This process involves redistributing host bits within an IP address through binary operations. The subnet mask delineates the network and host portions of the IP address, and administrators choose mask lengths based on specific subnet requirements. Subnetting enables efficient address space utilization and enhances network organization by creating smaller, manageable segments.';

    const calculatorTitle = document.createElement('h3');
    calculatorTitle.textContent = `🧮 Subnetting Calculator`;

    const form = document.createElement('form');
    form.id = 'subnetting-form';

    subnettingFormInit(form);

    
    contentArea.append(title, context, calculatorTitle, form, resultContainer);
}



