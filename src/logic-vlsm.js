import * as logic from "./generalLogic.js";

export function computeVLSM(ipAddress, numberOfNetworks, networksArray) {
    const vlsmSubnets = [];
    let networkAddress = ipAddress;
    for (let i = 0; i < numberOfNetworks; i++) {
        const subnetName = networksArray[i].networkName;
        const neededHosts = networksArray[i].hostsNeeded;
        const [ totalNumberOfHosts, bits ] = logic.getCapacity(networksArray[i].hostsNeeded);
        const availableHosts = totalNumberOfHosts - 2;
        const unusedHosts = availableHosts - neededHosts; 
        const prefix = logic.getNewPrefix(bits);
        const subnetMask = logic.computeSubnetMask(prefix);

        const firstUsableHost = logic.addBinaryIPAndCapacity(networkAddress, 1);
        const lastUsableHost = logic.addBinaryIPAndCapacity(networkAddress, totalNumberOfHosts - 2);
        const usableHostsRange = `${firstUsableHost} - ${lastUsableHost}`;
        const broadcastAddress = logic.addBinaryIPAndCapacity(networkAddress, totalNumberOfHosts - 1);
        const wildCardMask = logic.computeWildcardMask(subnetMask);
        
        vlsmSubnets.push({ subnetName, neededHosts, availableHosts, unusedHosts, networkAddress, prefix, subnetMask, usableHostsRange, broadcastAddress, wildCardMask});
        networkAddress = logic.addBinaryIPAndCapacity(broadcastAddress, 1);
    }
    return vlsmSubnets;
}

export function doVLSM(numberOfNetworks, ipAddress, mainPrefix, networksArray) {
    const IPAddressString = ipAddress.join('.');
    const numberOfUsableHostsOfNetwork = Math.pow(2, 32 - mainPrefix) - 2;
    const [mainSubnetMask, mainSubnetMaskBinary] = logic.computeSubnetMask(mainPrefix);
    const IPclass = logic.getNetworkClass(mainPrefix);
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${mainPrefix}`;

    const vlsmSubnets = computeVLSM(ipAddress, numberOfNetworks, networksArray);

    return {
        IPAddressString,
        numberOfUsableHostsOfNetwork,
        mainSubnetMask,
        mainSubnetMaskBinary,
        IPclass,
        IPType,
        Short,
        vlsmSubnets
    };
}



//console.log(doSubnetting('C', 28, [192,168,2,0], 24));