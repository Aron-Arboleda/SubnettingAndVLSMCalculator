const contentArea = document.querySelector('main div');

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

    contentArea.append(title, context, calculatorTitle, form);
}

function subnettingFormInit(form) {
    form.innerHTML = `
        <div id="inputContainer">
            <label>Network Class</label>
            <div>
                <input type="radio" name="abc">
                <label>A</label>
                <input type="radio" name="abc">
                <label>B</label>
                <input type="radio" name="abc">
                <label>C</label>
            </div>
            <label>Host needed per subnet</label>
            <input type="number" min="2" max="2147483648">
            <label>IP Address</label>
            <div>
                <input type="number" min="1" max="255">
                <label>.</label>
                <input type="number" min="1" max="255">
                <label>.</label>
                <input type="number" min="1" max="255">
                <label>.</label>
                <input type="number" min="1" max="255">
            </div>
        </div>
    `;

    /** 
    const gridDiv = document.createElement('div');
    gridDiv.className = 'inputContainer';
    
    const labelNetworkClass = document.createElement('label');
    labelNetworkClass.textContent = 'Network Class';
    const radioButtonWrapperDiv = document.createElement('div');
    const inputNetworkClassA = document.createElement('input');
    inputNetworkClassA.type = 'radio';
    inputNetworkClassA.name = 'abc';
    const inputNetworkClassB = document.createElement('input');
    inputNetworkClassB.type = 'radio';
    inputNetworkClassB.name = 'abc';
    const inputNetworkClassC = document.createElement('input');
    inputNetworkClassC.type = 'radio';
    inputNetworkClassC.name = 'abc';
    radioButtonWrapperDiv.append(inputNetworkClassA, inputNetworkClassB, inputNetworkClassC);
    labelNetworkClass.for = 'netClassContainer';







    
    const labelHostNeeded = document.createElement('label');
    labelHostNeeded.innerText = 'Number of Host Needed per Subnet';
    const inputHostNeeded = document.createElement('input');
    inputNetworkClassA.type = 'number';
    labelHostNeeded.appendChild(inputHostNeeded);

    
    const labelIPAddress = document.createElement('label');
    labelIPAddress.innerText = 'IP Address';
    const ipAddressWrapperDiv = document.createElement('div');
    const inputIPAddressOctet1 = document.createElement('input');
    inputIPAddressOctet1.type = 'number';
    const dot1 = document.createElement('p');
    dot1.innerText = '.';
    const inputIPAddressOctet2 = document.createElement('input');
    inputIPAddressOctet2.type = 'number';
    const dot2 = document.createElement('p');
    dot2.innerText = '.';
    const inputIPAddressOctet3 = document.createElement('input');
    inputIPAddressOctet3.type = 'number';
    const dot3 = document.createElement('p');
    dot3.innerText = '.';
    const inputIPAddressOctet4 = document.createElement('input');
    inputIPAddressOctet4.type = 'number';
    ipAddressWrapperDiv.append(inputIPAddressOctet1, dot1, inputIPAddressOctet2, dot2, inputIPAddressOctet3, dot3);
    labelIPAddress.appendChild(ipAddressWrapperDiv);

    gridDiv.append(labelNetworkClass, radioButtonWrapperDiv, labelHostNeeded, inputHostNeeded, labelIPAddress, ipAddressWrapperDiv);
    
    form.append(gridDiv);
    */
}