import * as logic from "./generalLogic";

export function computeSubnets(networkClass, hosts, ipAddress, prefix) {
    const IPAddressString = ipAddress.join('.');
    const { totalNumberOfHosts, bits} = logic.getCapacity(hosts);
    const numberOfUsableHosts = totalNumberOfHosts - 2;
    const newPrefix = logic.getNewPrefix(bits);
    const {subnetMask, binarySubnetMask} = logic.computeSubnetMask(newPrefix);
    const wildCardMask = logic.computeWildcardMask(subnetMask);
    const IPclass = networkClass;
    const CIDRnotation = `/${newPrefix}`;
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${newPrefix}`;




    
}

