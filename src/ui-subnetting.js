import { unchild } from "./index.js";

const contentArea = document.querySelector('main div');

const resultContainer = document.createElement('div');
resultContainer.id = 'resultContainerSubnetting';

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

function subnettingFormInit(form) {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';

    const networkClassLabel = document.createElement('label');
    networkClassLabel.textContent = 'Network Class';
    inputContainer.appendChild(networkClassLabel);

    const networkClassDiv = document.createElement('div');
    const networkClassInputs = ['A', 'B', 'C'].map((labelText) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'abc';
      input.value = labelText;
      const label = document.createElement('label');
      label.textContent = labelText;
      networkClassDiv.appendChild(input);
      networkClassDiv.appendChild(label);
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
    inputContainer.appendChild(hostInput);

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

    form.appendChild(inputContainer);

    const resultButton = document.createElement('button');
    resultButton.className = 'resultButton';
    resultButton.id = 'resultButtonSubnetting';
    resultButton.type = 'submit';
    resultButton.textContent = 'Compute and Show Results';
    form.appendChild(resultButton);

    const warningMsg = document.createElement('p');
    warningMsg.className = 'warningMsg';
    warningMsg.id = 'warningMsgSubnetting';
    form.appendChild(warningMsg);

    resultButton.addEventListener('click', (e) => {
        e.preventDefault();
        unchild(resultContainer);

        const emptyChecker = ((networkClassInputs[0].checked == false && networkClassInputs[1].checked == false && networkClassInputs[2].checked == false) || !hostInput.value || !octet1.value || !octet2.value || !octet3.value || !octet4.value || !prefixInput.value);
        
        const limitChecker = (hostInput.value > 2147483648 || hostInput.value < 2) || (prefixInput.value > 30 || prefixInput.value < 0) || 
        [octet1, octet2, octet3, octet4].some((x) => {
            return (x.value > 255 || x.value < 0);
        });
        
        if (emptyChecker){
            warningMsg.innerHTML = '*All fields are required';
        } else if (limitChecker) {
            warningMsg.innerHTML = '*Please enter valid IP address / hosts needed';
        } else {
            warningMsg.innerHTML = '';
        }

        if (warningMsg.innerHTML === ''){
            const networkClass = networkClassInputs.filter((input) => input.checked)[0].value;
            const hosts = parseInt(hostInput.value);
            const ipAddress = [octet1.value, octet2.value, octet3.value, octet4.value].map((x) => parseInt(x));
            const prefix = parseInt(prefixInput.value);
            displayResults(networkClass, hosts, ipAddress, prefix);

            console.log(networkClass, hosts, ipAddress, prefix);
        }
    });
}

function displayResults(networkClass, hosts, ipAddress, prefix) {
    
}