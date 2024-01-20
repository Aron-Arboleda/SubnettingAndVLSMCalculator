export function binaryToInt(binaryString) {
    return parseInt(binaryString, 2);
}

export function intToBinary(integer) {
    return integer.toString(2);
}

export function getCapacity(hosts) {
    for (let i = 0; i < 32; i++) {
        if (Math.pow(2, i) >= hosts){
            return [ Math.pow(2, i), i ];
        }
    }
}

export function getTotalSubnets(mainNetworkPrefix, subnetPrefix) {
    return Math.pow(2, subnetPrefix - mainNetworkPrefix);
}

export function computeSubnetMask(prefix) {
    let binarySubnetMask = '';
    for (let i = 0; i < 32; i++) {
        if (i % 8 === 0 && i !== 0) {
            binarySubnetMask += '.';
        }

        if (i < prefix) {
            binarySubnetMask += '1';
        } else {
            binarySubnetMask += '0';
        }
    }
    const binaryOctets = binarySubnetMask.split('.');
    const subnetMask = binaryOctets.map(binaryToInt).join('.');
    return [subnetMask, binarySubnetMask];
}

export function computeWildcardMask(subnetMask) {
    return subnetMask.split('.').map(octet => 255 - parseInt(octet)).join('.');
}

export function getNewPrefix(bits) {
    return 32 - bits;
}

export function getIPType(ipv4Address) {
    const privateRanges = [
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,       // 10.0.0.0 - 10.255.255.255
        /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,  // 172.16.0.0 - 172.31.255.255
        /^192\.168\.\d{1,3}\.\d{1,3}$/,          // 192.168.0.0 - 192.168.255.255
    ];

    return privateRanges.some(regex => regex.test(ipv4Address)) ? 'Private' : 'Public';
}



export function computeSubnets(ipAddress, totalHosts, totalSubnets, subnetMask, prefix) {
    const subnets = [];
    const numberOfUsableHosts = totalHosts - 2;
    let networkAddress = ipAddress;
    for (let i = 0; i < totalSubnets; i++) {
        const subnet = `S${i}`;
        const firstUsableHost = addBinaryIPAndCapacity(networkAddress, 1);
        const lastUsableHost = addBinaryIPAndCapacity(networkAddress, totalHosts - 2);
        const broadcastAddress = addBinaryIPAndCapacity(networkAddress, totalHosts - 1);
        
        subnets.push({ subnet, networkAddress, firstUsableHost, lastUsableHost, broadcastAddress, numberOfUsableHosts, subnetMask, prefix});
        networkAddress = addBinaryIPAndCapacity(broadcastAddress, 1);
    }
    return subnets;
}

export function addBinaryIPAndCapacity(ipv4Address, hostCapacity) {
    const toBinaryString = ip => ip.split('.').map(octet => parseInt(octet, 10).toString(2).padStart(8, '0')).join('');
    const binaryIP = toBinaryString(ipv4Address);
    const binaryCapacity = hostCapacity.toString(2).padStart(32, '0'); // Assuming hostCapacity is an integer
    const sum = (parseInt(binaryIP, 2) + parseInt(binaryCapacity, 2)) >>> 0;
    const decimalDotted = sum.toString(2).padStart(32, '0').match(/.{1,8}/g).map(binary => parseInt(binary, 2)).join('.');
    return decimalDotted;
}

//console.log(computeSubnets('192.168.2.0', 32, 3, '255.255.255.224' ,'/27'));
