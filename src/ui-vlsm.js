const contentArea = document.querySelector('main div');

export function VLSMInit() {
    const vlsmHTML = `
        <h2>Variable Length Subnet Masking (VLSM)</h2>
        <p>Variable Length Subnet Masking (VLSM) is an extension of subnetting that allows for the use of different subnet masks within the same network. Unlike standard subnetting, VLSM offers flexibility by permitting variable subnet mask lengths. This means that administrators can allocate larger subnets with longer masks to segments requiring more hosts, and smaller subnets with shorter masks to segments with fewer hosts. VLSM is instrumental in optimizing IP address allocation, especially in hierarchical network designs, ensuring efficient utilization of available address space.</p>

        

    `;

    contentArea.innerHTML = vlsmHTML;
}