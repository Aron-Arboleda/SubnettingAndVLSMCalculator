import * as logic from "./generalLogic.js";

export function computeSubnetting(ipAddress, totalHosts, totalSubnets, mainSubnetMask, newSubnetMask, prefix) {
    const subnets = [];
    const numberOfUsableHosts = totalHosts - 2;
    let networkAddress = logic.getNetworkAddress(ipAddress, mainSubnetMask);
    for (let i = 0; i < totalSubnets; i++) {
        const subnet = `S${i}`;
        const firstUsableHost = logic.addBinaryIPAndCapacity(networkAddress, 1);
        const lastUsableHost = logic.addBinaryIPAndCapacity(networkAddress, totalHosts - 2);
        const broadcastAddress = logic.addBinaryIPAndCapacity(networkAddress, totalHosts - 1);
        
        subnets.push({ subnet, networkAddress, firstUsableHost, lastUsableHost, broadcastAddress, numberOfUsableHosts, newSubnetMask, prefix});
        networkAddress = logic.addBinaryIPAndCapacity(broadcastAddress, 1);
    }
    return subnets;
}

export function doSubnetting(networkClass, usableHosts, ipAddress, mainPrefix) {
    const IPAddressString = ipAddress.join('.');
    const [ totalNumberOfHosts, bits ] = logic.getCapacity(usableHosts);
    const numberOfUsableHosts = totalNumberOfHosts - 2;
    const mainSubnetMask = logic.computeSubnetMask(mainPrefix)[0];
    const newPrefix = logic.getNewPrefix(bits);
    const totalSubnetsCreated = logic.getTotalSubnets(mainPrefix, newPrefix);
    const [newSubnetMask, binaryNewSubnetMask] = logic.computeSubnetMask(newPrefix);
    const wildCardMask = logic.computeWildcardMask(newSubnetMask);
    const IPclass = networkClass;
    const CIDRnotation = `/${newPrefix}`;
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${newPrefix}`;

    const subnets = computeSubnetting(IPAddressString, totalNumberOfHosts, totalSubnetsCreated, mainSubnetMask, newSubnetMask, CIDRnotation);

    const networkAddress = logic.getNetworkAddress(IPAddressString, newSubnetMask);
    const broadcastAddress = logic.addBinaryIPAndCapacity(networkAddress, totalNumberOfHosts - 1);
    const subnetPosition = logic.getSubnetPosition(mainPrefix, newPrefix, networkAddress);
    const addressLabel = logic.getAddressLabel(IPAddressString, networkAddress, broadcastAddress);


    return {
        IPAddressString,
        subnetPosition,
        networkAddress,
        broadcastAddress,
        addressLabel,
        totalNumberOfHosts,
        numberOfUsableHosts,
        totalSubnetsCreated,
        newSubnetMask,
        binaryNewSubnetMask,
        wildCardMask,
        IPclass,
        CIDRnotation,
        IPType,
        Short,
        subnets
    };
}



//console.log(doSubnetting('C', 28, [192,168,2,0], 24));