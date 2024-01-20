import * as logic from "./generalLogic.js";

export function doSubnetting(networkClass, hosts, ipAddress, mainPrefix) {
    const IPAddressString = ipAddress.join('.');
    const [ totalNumberOfHosts, bits ] = logic.getCapacity(hosts);
    const numberOfUsableHosts = totalNumberOfHosts - 2;
    const newPrefix = logic.getNewPrefix(bits);
    const totalSubnetsCreated = logic.getTotalSubnets(mainPrefix, newPrefix);
    const [subnetMask, binarySubnetMask] = logic.computeSubnetMask(newPrefix);
    const wildCardMask = logic.computeWildcardMask(subnetMask);
    const IPclass = networkClass;
    const CIDRnotation = `/${newPrefix}`;
    const IPType = logic.getIPType(IPAddressString);
    const Short = `${IPAddressString} /${newPrefix}`;

    const subnets = logic.computeSubnets(IPAddressString, totalNumberOfHosts, totalSubnetsCreated, subnetMask, CIDRnotation);

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



console.log(doSubnetting('C', 28, [192,168,2,0], 24));