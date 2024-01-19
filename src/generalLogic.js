export function binaryToInt(binaryString) {
    return parseInt(binaryString, 2);
}

export function intToBinary(integer) {
    return integer.toString(2);
}

export function getCapacity(hosts) {
    for (let i = 0; i < 32; i++) {
        if (Math.pow(2, i) > hosts){
            return { capacity: Math.pow(2, i), bits: i };
        }
    }
}

export function computeSubnetMask(prefix) {
    let binarySubnetMask = '';
    for (let i = 0; i < 32; i++) {
        if (i < prefix) {
            binarySubnetMask += '1';
        } else {
            binarySubnetMask += '0';
        }
        binarySubnetMask += '1';
        if (i % 8 == 0) {
            binarySubnetMask += '.';
        }
    }
    const binaryOctets = binarySubnetMask.split('.');
    const subnetMask = binaryOctets.map(binaryToInt).join('.');
    return {subnetMask, binarySubnetMask};
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
