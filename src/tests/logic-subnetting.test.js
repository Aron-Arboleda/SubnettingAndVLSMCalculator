/* eslint-disable */

import { doSubnetting } from '../logic-subnetting.js';
import { describe, expect, it } from "vitest";

describe('#computeSubnets', () => {
    it('testing computeSubnets function', () => {
        const { IPAddressString,
            totalNumberOfHosts,
            numberOfUsableHosts,
            subnetMask,
            binarySubnetMask,
            wildCardMask,
            IPclass,
            CIDRnotation,
            IPType,
            Short } = doSubnetting('C', 50, [192,168,2,0], 24);
        expect(totalNumberOfHosts).toEqual(64);
        expect(numberOfUsableHosts).toEqual(62);
        expect(subnetMask).toEqual('255.255.255.192');
        expect(binarySubnetMask).toEqual('11111111.11111111.11111111.11000000');
        expect(wildCardMask).toEqual('0.0.0.63');
        expect(CIDRnotation).toEqual('/26');
        expect(IPType).toEqual('Private');
        expect(Short).toEqual('192.168.2.0 /26');
    });
})
