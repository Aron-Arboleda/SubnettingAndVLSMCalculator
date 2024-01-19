import * as logic from "./generalLogic.js";

export function computeSubnets(networkClass, hosts, ipAddress, prefix) {
    const IPAddressString = ipAddress.join('.');
    const [ totalNumberOfHosts, bits ] = logic.getCapacity(hosts);
    const numberOfUsableHosts = totalNumberOfHosts - 2;
    const newPrefix = logic.getNewPrefix(bits);
    const [subnetMask, binarySubnetMask] = logic.computeSubnetMask(newPrefix);
    const wildCardMask = logic.computeWildcardMask(subnetMask);
    const IPclass = networkClass;
    const CIDRnotation = `/${newPrefix}`;
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${newPrefix}`;

    
    return {
        IPAddressString,
        totalNumberOfHosts,
        numberOfUsableHosts,
        subnetMask,
        binarySubnetMask,
        wildCardMask,
        IPclass,
        CIDRnotation,
        IPType,
        Short
    };
}



//console.log(computeSubnets('C', 10, [220,168,2,0], 24));