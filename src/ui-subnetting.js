const contentArea = document.querySelector('main div');

export function SubnettingInit() {
    const subnettingHTML = `
        <h2>Subnetting</h2>
        <p>Subnetting is a crucial aspect of IP network design achieved by dividing a larger network into smaller subnets. This process involves redistributing host bits within an IP address through binary operations. The subnet mask delineates the network and host portions of the IP address, and administrators choose mask lengths based on specific subnet requirements. Subnetting enables efficient address space utilization and enhances network organization by creating smaller, manageable segments.</p>

        

    `;

    contentArea.innerHTML = subnettingHTML;
}