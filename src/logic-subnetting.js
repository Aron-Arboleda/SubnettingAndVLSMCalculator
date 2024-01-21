import * as logic from "./generalLogic.js";

export function computeSubnetting(ipAddress, totalHosts, totalSubnets, subnetMask, prefix) {
    const subnets = [];
    const numberOfUsableHosts = totalHosts - 2;
    let networkAddress = ipAddress;
    for (let i = 0; i < totalSubnets; i++) {
        const subnet = `S${i}`;
        const firstUsableHost = logic.addBinaryIPAndCapacity(networkAddress, 1);
        const lastUsableHost = logic.addBinaryIPAndCapacity(networkAddress, totalHosts - 2);
        const broadcastAddress = logic.addBinaryIPAndCapacity(networkAddress, totalHosts - 1);
        
        subnets.push({ subnet, networkAddress, firstUsableHost, lastUsableHost, broadcastAddress, numberOfUsableHosts, subnetMask, prefix});
        networkAddress = logic.addBinaryIPAndCapacity(broadcastAddress, 1);
    }
    return subnets;
}

export function doSubnetting(networkClass, usableHosts, ipAddress, mainPrefix) {
    const IPAddressString = ipAddress.join('.');
    const [ totalNumberOfHosts, bits ] = logic.getCapacity(usableHosts);
    const numberOfUsableHosts = totalNumberOfHosts - 2;
    const newPrefix = logic.getNewPrefix(bits);
    const totalSubnetsCreated = logic.getTotalSubnets(mainPrefix, newPrefix);
    const [subnetMask, binarySubnetMask] = logic.computeSubnetMask(newPrefix);
    const wildCardMask = logic.computeWildcardMask(subnetMask);
    const IPclass = networkClass;
    const CIDRnotation = `/${newPrefix}`;
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${newPrefix}`;

    const subnets = computeSubnetting(IPAddressString, totalNumberOfHosts, totalSubnetsCreated, subnetMask, CIDRnotation);

    return {
        IPAddressString,
        totalNumberOfHosts,
        numberOfUsableHosts,
        totalSubnetsCreated,
        subnetMask,
        binarySubnetMask,
        wildCardMask,
        IPclass,
        CIDRnotation,
        IPType,
        Short,
        subnets
    };
}



//console.log(doSubnetting('C', 28, [192,168,2,0], 24));