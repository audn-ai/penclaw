import { s as isIpInCidr } from "./ip-CyyRxPli.js";
import {
  r as readNetworkInterfaces,
  t as listExternalInterfaceAddresses,
} from "./network-interfaces-S5y8vKUw.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/infra/tailnet.ts
const TAILNET_IPV4_CIDR = "100.64.0.0/10";
const TAILNET_IPV6_CIDR = "fd7a:115c:a1e0::/48";
/** Returns true when an address is inside Tailscale's CGNAT IPv4 range. */
function isTailnetIPv4(address) {
  return isIpInCidr(address, TAILNET_IPV4_CIDR);
}
function isTailnetIPv6(address) {
  return isIpInCidr(address, TAILNET_IPV6_CIDR);
}
/** Lists unique Tailscale IPv4/IPv6 addresses from local external interfaces. */
function listTailnetAddresses() {
  const ipv4 = [];
  const ipv6 = [];
  for (const { address, family } of listExternalInterfaceAddresses(readNetworkInterfaces())) {
    if (family === "IPv4" && isTailnetIPv4(address)) ipv4.push(address);
    if (family === "IPv6" && isTailnetIPv6(address)) ipv6.push(address);
  }
  return {
    ipv4: uniqueStrings(ipv4),
    ipv6: uniqueStrings(ipv6),
  };
}
/** Returns the first discovered Tailscale IPv4 address, if any. */
function pickPrimaryTailnetIPv4() {
  return listTailnetAddresses().ipv4[0];
}
/** Returns the first discovered Tailscale IPv6 address, if any. */
function pickPrimaryTailnetIPv6() {
  return listTailnetAddresses().ipv6[0];
}
//#endregion
export { pickPrimaryTailnetIPv4 as n, pickPrimaryTailnetIPv6 as r, isTailnetIPv4 as t };
