import { s as __toESM, t as __commonJSMin } from "./rolldown-runtime-DE1ahGrs.js";
//#endregion
//#region packages/net-policy/src/ip.ts
var import_ipaddr = /* @__PURE__ */ __toESM(
  /* @__PURE__ */ __commonJSMin((exports, module) => {
    (function (root) {
      "use strict";
      const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
      const ipv4Regexes = {
        fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
        longValue: new RegExp(`^${ipv4Part}$`, "i"),
      };
      const octalRegex = new RegExp(`^0[0-7]+$`, "i");
      const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
      const zoneIndex = "%[0-9a-z]{1,}";
      const ipv6Part = "(?:[0-9a-f]+::?)+";
      const ipv6Regexes = {
        zoneIndex: new RegExp(zoneIndex, "i"),
        native: new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
        deprecatedTransitional: new RegExp(
          `^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`,
          "i",
        ),
        transitional: new RegExp(
          `^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`,
          "i",
        ),
      };
      function expandIPv6(string, parts) {
        if (string.indexOf("::") !== string.lastIndexOf("::")) return null;
        let colonCount = 0;
        let lastColon = -1;
        let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
        let replacement, replacementCount;
        if (zoneId) {
          zoneId = zoneId.substring(1);
          string = string.replace(/%.+$/, "");
        }
        while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) colonCount++;
        if (string.substr(0, 2) === "::") colonCount--;
        if (string.substr(-2, 2) === "::") colonCount--;
        if (colonCount > parts) return null;
        replacementCount = parts - colonCount;
        replacement = ":";
        while (replacementCount--) replacement += "0:";
        string = string.replace("::", replacement);
        if (string[0] === ":") string = string.slice(1);
        if (string[string.length - 1] === ":") string = string.slice(0, -1);
        parts = (function () {
          const ref = string.split(":");
          const results = [];
          for (let i = 0; i < ref.length; i++) results.push(parseInt(ref[i], 16));
          return results;
        })();
        return {
          parts,
          zoneId,
        };
      }
      function matchCIDR(first, second, partSize, cidrBits) {
        if (first.length !== second.length)
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        let part = 0;
        let shift;
        while (cidrBits > 0) {
          shift = partSize - cidrBits;
          if (shift < 0) shift = 0;
          if (first[part] >> shift !== second[part] >> shift) return false;
          cidrBits -= partSize;
          part += 1;
        }
        return true;
      }
      function parseIntAuto(string) {
        if (hexRegex.test(string)) return parseInt(string, 16);
        if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
          if (octalRegex.test(string)) return parseInt(string, 8);
          throw new Error(`ipaddr: cannot parse ${string} as octal`);
        }
        return parseInt(string, 10);
      }
      function padPart(part, length) {
        while (part.length < length) part = `0${part}`;
        return part;
      }
      const ipaddr = {};
      ipaddr.IPv4 = (function () {
        function IPv4(octets) {
          if (octets.length !== 4) throw new Error("ipaddr: ipv4 octet count should be 4");
          let i, octet;
          for (i = 0; i < octets.length; i++) {
            octet = octets[i];
            if (!(0 <= octet && octet <= 255))
              throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
          }
          this.octets = octets;
        }
        IPv4.prototype.SpecialRanges = {
          unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
          broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
          multicast: [[new IPv4([224, 0, 0, 0]), 4]],
          linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
          loopback: [[new IPv4([127, 0, 0, 0]), 8]],
          carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
          private: [
            [new IPv4([10, 0, 0, 0]), 8],
            [new IPv4([172, 16, 0, 0]), 12],
            [new IPv4([192, 168, 0, 0]), 16],
          ],
          reserved: [
            [new IPv4([192, 0, 0, 0]), 24],
            [new IPv4([192, 0, 2, 0]), 24],
            [new IPv4([192, 88, 99, 0]), 24],
            [new IPv4([198, 18, 0, 0]), 15],
            [new IPv4([198, 51, 100, 0]), 24],
            [new IPv4([203, 0, 113, 0]), 24],
            [new IPv4([240, 0, 0, 0]), 4],
          ],
          as112: [
            [new IPv4([192, 175, 48, 0]), 24],
            [new IPv4([192, 31, 196, 0]), 24],
          ],
          amt: [[new IPv4([192, 52, 193, 0]), 24]],
        };
        IPv4.prototype.kind = function () {
          return "ipv4";
        };
        IPv4.prototype.match = function (other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv4")
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          return matchCIDR(this.octets, other.octets, 8, cidrRange);
        };
        IPv4.prototype.prefixLengthFromSubnetMask = function () {
          let cidr = 0;
          let stop = false;
          const zerotable = {
            0: 8,
            128: 7,
            192: 6,
            224: 5,
            240: 4,
            248: 3,
            252: 2,
            254: 1,
            255: 0,
          };
          let i, octet, zeros;
          for (i = 3; i >= 0; i -= 1) {
            octet = this.octets[i];
            if (octet in zerotable) {
              zeros = zerotable[octet];
              if (stop && zeros !== 0) return null;
              if (zeros !== 8) stop = true;
              cidr += zeros;
            } else return null;
          }
          return 32 - cidr;
        };
        IPv4.prototype.range = function () {
          return ipaddr.subnetMatch(this, this.SpecialRanges);
        };
        IPv4.prototype.toByteArray = function () {
          return this.octets.slice(0);
        };
        IPv4.prototype.toIPv4MappedAddress = function () {
          return ipaddr.IPv6.parse(`::ffff:${this.toString()}`);
        };
        IPv4.prototype.toNormalizedString = function () {
          return this.toString();
        };
        IPv4.prototype.toString = function () {
          return this.octets.join(".");
        };
        return IPv4;
      })();
      ipaddr.IPv4.broadcastAddressFromCIDR = function (string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 4) {
            octets.push(
              parseInt(ipInterfaceOctets[i], 10) | (parseInt(subnetMaskOctets[i], 10) ^ 255),
            );
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      };
      ipaddr.IPv4.isIPv4 = function (string) {
        return this.parser(string) !== null;
      };
      ipaddr.IPv4.isValid = function (string) {
        try {
          new this(this.parser(string));
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr.IPv4.isValidCIDR = function (string) {
        try {
          this.parseCIDR(string);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr.IPv4.isValidFourPartDecimal = function (string) {
        if (ipaddr.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/))
          return true;
        else return false;
      };
      ipaddr.IPv4.isValidCIDRFourPartDecimal = function (string) {
        const match = string.match(/^(.+)\/(\d+)$/);
        if (!ipaddr.IPv4.isValidCIDR(string) || !match) return false;
        return ipaddr.IPv4.isValidFourPartDecimal(match[1]);
      };
      ipaddr.IPv4.networkAddressFromCIDR = function (string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 4) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format");
        }
      };
      ipaddr.IPv4.parse = function (string) {
        const parts = this.parser(string);
        if (parts === null) throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        return new this(parts);
      };
      ipaddr.IPv4.parseCIDR = function (string) {
        let match;
        if ((match = string.match(/^(.+)\/(\d+)$/))) {
          const maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 32) {
            const parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function () {
                return this.join("/");
              },
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      };
      ipaddr.IPv4.parser = function (string) {
        let match, part, value;
        if ((match = string.match(ipv4Regexes.fourOctet)))
          return (function () {
            const ref = match.slice(1, 6);
            const results = [];
            for (let i = 0; i < ref.length; i++) {
              part = ref[i];
              results.push(parseIntAuto(part));
            }
            return results;
          })();
        else if ((match = string.match(ipv4Regexes.longValue))) {
          value = parseIntAuto(match[1]);
          if (value > 4294967295 || value < 0)
            throw new Error("ipaddr: address outside defined range");
          return (function () {
            const results = [];
            let shift;
            for (shift = 0; shift <= 24; shift += 8) results.push((value >> shift) & 255);
            return results;
          })().reverse();
        } else if ((match = string.match(ipv4Regexes.twoOctet)))
          return (function () {
            const ref = match.slice(1, 4);
            const results = [];
            value = parseIntAuto(ref[1]);
            if (value > 16777215 || value < 0)
              throw new Error("ipaddr: address outside defined range");
            results.push(parseIntAuto(ref[0]));
            results.push((value >> 16) & 255);
            results.push((value >> 8) & 255);
            results.push(value & 255);
            return results;
          })();
        else if ((match = string.match(ipv4Regexes.threeOctet)))
          return (function () {
            const ref = match.slice(1, 5);
            const results = [];
            value = parseIntAuto(ref[2]);
            if (value > 65535 || value < 0)
              throw new Error("ipaddr: address outside defined range");
            results.push(parseIntAuto(ref[0]));
            results.push(parseIntAuto(ref[1]));
            results.push((value >> 8) & 255);
            results.push(value & 255);
            return results;
          })();
        else return null;
      };
      ipaddr.IPv4.subnetMaskFromPrefixLength = function (prefix) {
        prefix = parseInt(prefix);
        if (prefix < 0 || prefix > 32) throw new Error("ipaddr: invalid IPv4 prefix length");
        const octets = [0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 4)
          octets[filledOctetCount] = (Math.pow(2, prefix % 8) - 1) << (8 - (prefix % 8));
        return new this(octets);
      };
      ipaddr.IPv6 = (function () {
        function IPv6(parts, zoneId) {
          let i, part;
          if (parts.length === 16) {
            this.parts = [];
            for (i = 0; i <= 14; i += 2) this.parts.push((parts[i] << 8) | parts[i + 1]);
          } else if (parts.length === 8) this.parts = parts;
          else throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          for (i = 0; i < this.parts.length; i++) {
            part = this.parts[i];
            if (!(0 <= part && part <= 65535))
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
          }
          if (zoneId) this.zoneId = zoneId;
        }
        IPv6.prototype.SpecialRanges = {
          unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new IPv6([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new IPv6([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new IPv6([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          deprecatedSiteLocal: [new IPv6([65216, 0, 0, 0, 0, 0, 0, 0]), 10],
          discard: [new IPv6([256, 0, 0, 0, 0, 0, 0, 0]), 64],
          rfc6145: [new IPv6([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          rfc6052: [
            [new IPv6([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
            [new IPv6([100, 65435, 1, 0, 0, 0, 0, 0]), 48],
          ],
          "6to4": [new IPv6([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          teredo: [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          benchmarking: [new IPv6([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
          amt: [new IPv6([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
          as112v6: [
            [new IPv6([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
            [new IPv6([9760, 79, 32768, 0, 0, 0, 0, 0]), 48],
          ],
          deprecatedOrchid: [new IPv6([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
          orchid2: [new IPv6([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
          droneRemoteIdProtocolEntityTags: [new IPv6([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
          segmentRouting: [new IPv6([24320, 0, 0, 0, 0, 0, 0, 0]), 16],
          reserved: [
            [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
            [new IPv6([8193, 3512, 0, 0, 0, 0, 0, 0]), 32],
            [new IPv6([16383, 0, 0, 0, 0, 0, 0, 0]), 20],
          ],
        };
        IPv6.prototype.isIPv4MappedAddress = function () {
          return this.range() === "ipv4Mapped";
        };
        IPv6.prototype.kind = function () {
          return "ipv6";
        };
        IPv6.prototype.match = function (other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv6")
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          return matchCIDR(this.parts, other.parts, 16, cidrRange);
        };
        IPv6.prototype.prefixLengthFromSubnetMask = function () {
          let cidr = 0;
          let stop = false;
          const zerotable = {
            0: 16,
            32768: 15,
            49152: 14,
            57344: 13,
            61440: 12,
            63488: 11,
            64512: 10,
            65024: 9,
            65280: 8,
            65408: 7,
            65472: 6,
            65504: 5,
            65520: 4,
            65528: 3,
            65532: 2,
            65534: 1,
            65535: 0,
          };
          let part, zeros;
          for (let i = 7; i >= 0; i -= 1) {
            part = this.parts[i];
            if (part in zerotable) {
              zeros = zerotable[part];
              if (stop && zeros !== 0) return null;
              if (zeros !== 16) stop = true;
              cidr += zeros;
            } else return null;
          }
          return 128 - cidr;
        };
        IPv6.prototype.range = function () {
          return ipaddr.subnetMatch(this, this.SpecialRanges);
        };
        IPv6.prototype.toByteArray = function () {
          let part;
          const bytes = [];
          const ref = this.parts;
          for (let i = 0; i < ref.length; i++) {
            part = ref[i];
            bytes.push(part >> 8);
            bytes.push(part & 255);
          }
          return bytes;
        };
        IPv6.prototype.toFixedLengthString = function () {
          const addr = function () {
            const results = [];
            for (let i = 0; i < this.parts.length; i++)
              results.push(padPart(this.parts[i].toString(16), 4));
            return results;
          }
            .call(this)
            .join(":");
          let suffix = "";
          if (this.zoneId) suffix = `%${this.zoneId}`;
          return addr + suffix;
        };
        IPv6.prototype.toIPv4Address = function () {
          if (!this.isIPv4MappedAddress())
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          const ref = this.parts.slice(-2);
          const high = ref[0];
          const low = ref[1];
          return new ipaddr.IPv4([high >> 8, high & 255, low >> 8, low & 255]);
        };
        IPv6.prototype.toNormalizedString = function () {
          const addr = function () {
            const results = [];
            for (let i = 0; i < this.parts.length; i++) results.push(this.parts[i].toString(16));
            return results;
          }
            .call(this)
            .join(":");
          let suffix = "";
          if (this.zoneId) suffix = `%${this.zoneId}`;
          return addr + suffix;
        };
        IPv6.prototype.toRFC5952String = function () {
          const regex = /((^|:)(0(:|$)){2,})/g;
          const string = this.toNormalizedString();
          let bestMatchIndex = 0;
          let bestMatchLength = -1;
          let match;
          while ((match = regex.exec(string)))
            if (match[0].length > bestMatchLength) {
              bestMatchIndex = match.index;
              bestMatchLength = match[0].length;
            }
          if (bestMatchLength < 0) return string;
          return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}`;
        };
        IPv6.prototype.toString = function () {
          return this.toRFC5952String();
        };
        return IPv6;
      })();
      ipaddr.IPv6.broadcastAddressFromCIDR = function (string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 16) {
            octets.push(
              parseInt(ipInterfaceOctets[i], 10) | (parseInt(subnetMaskOctets[i], 10) ^ 255),
            );
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
        }
      };
      ipaddr.IPv6.isIPv6 = function (string) {
        return this.parser(string) !== null;
      };
      ipaddr.IPv6.isValid = function (string) {
        if (typeof string === "string" && string.indexOf(":") === -1) return false;
        try {
          const addr = this.parser(string);
          new this(addr.parts, addr.zoneId);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr.IPv6.isValidCIDR = function (string) {
        if (typeof string === "string" && string.indexOf(":") === -1) return false;
        try {
          this.parseCIDR(string);
          return true;
        } catch (e) {
          return false;
        }
      };
      ipaddr.IPv6.networkAddressFromCIDR = function (string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 16) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
        }
      };
      ipaddr.IPv6.parse = function (string) {
        const addr = this.parser(string);
        if (addr.parts === null)
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        return new this(addr.parts, addr.zoneId);
      };
      ipaddr.IPv6.parseCIDR = function (string) {
        let maskLength, match, parsed;
        if ((match = string.match(/^(.+)\/(\d+)$/))) {
          maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 128) {
            parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function () {
                return this.join("/");
              },
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      };
      ipaddr.IPv6.parser = function (string) {
        let addr, i, match, octet, octets, zoneId;
        if ((match = string.match(ipv6Regexes.deprecatedTransitional)))
          return this.parser(`::ffff:${match[1]}`);
        if (ipv6Regexes.native.test(string)) return expandIPv6(string, 8);
        if ((match = string.match(ipv6Regexes.transitional))) {
          zoneId = match[6] || "";
          addr = match[1];
          if (!match[1].endsWith("::")) addr = addr.slice(0, -1);
          addr = expandIPv6(addr + zoneId, 6);
          if (addr.parts) {
            octets = [
              parseInt(match[2]),
              parseInt(match[3]),
              parseInt(match[4]),
              parseInt(match[5]),
            ];
            for (i = 0; i < octets.length; i++) {
              octet = octets[i];
              if (!(0 <= octet && octet <= 255)) return null;
            }
            addr.parts.push((octets[0] << 8) | octets[1]);
            addr.parts.push((octets[2] << 8) | octets[3]);
            return {
              parts: addr.parts,
              zoneId: addr.zoneId,
            };
          }
        }
        return null;
      };
      ipaddr.IPv6.subnetMaskFromPrefixLength = function (prefix) {
        prefix = parseInt(prefix);
        if (prefix < 0 || prefix > 128) throw new Error("ipaddr: invalid IPv6 prefix length");
        const octets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 16)
          octets[filledOctetCount] = (Math.pow(2, prefix % 8) - 1) << (8 - (prefix % 8));
        return new this(octets);
      };
      ipaddr.fromByteArray = function (bytes) {
        const length = bytes.length;
        if (length === 4) return new ipaddr.IPv4(bytes);
        else if (length === 16) return new ipaddr.IPv6(bytes);
        else throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
      };
      ipaddr.isValid = function (string) {
        return ipaddr.IPv6.isValid(string) || ipaddr.IPv4.isValid(string);
      };
      ipaddr.isValidCIDR = function (string) {
        return ipaddr.IPv6.isValidCIDR(string) || ipaddr.IPv4.isValidCIDR(string);
      };
      ipaddr.parse = function (string) {
        if (ipaddr.IPv6.isValid(string)) return ipaddr.IPv6.parse(string);
        else if (ipaddr.IPv4.isValid(string)) return ipaddr.IPv4.parse(string);
        else throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
      };
      ipaddr.parseCIDR = function (string) {
        try {
          return ipaddr.IPv6.parseCIDR(string);
        } catch (e) {
          try {
            return ipaddr.IPv4.parseCIDR(string);
          } catch (e2) {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
          }
        }
      };
      ipaddr.process = function (string) {
        const addr = this.parse(string);
        if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) return addr.toIPv4Address();
        else return addr;
      };
      ipaddr.subnetMatch = function (address, rangeList, defaultName) {
        let i, rangeName, rangeSubnets, subnet;
        if (defaultName === void 0 || defaultName === null) defaultName = "unicast";
        for (rangeName in rangeList)
          if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
            rangeSubnets = rangeList[rangeName];
            if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array))
              rangeSubnets = [rangeSubnets];
            for (i = 0; i < rangeSubnets.length; i++) {
              subnet = rangeSubnets[i];
              if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet))
                return rangeName;
            }
          }
        return defaultName;
      };
      if (typeof module !== "undefined" && module.exports) module.exports = ipaddr;
      else root.ipaddr = ipaddr;
    })(exports);
  })(),
  1,
);
function normalizeOptionalString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function normalizeLowercaseStringOrEmpty(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function expectIpv6Hextets(parts) {
  const [a, b, c, d, e, f, g, h] = parts;
  if (
    a === void 0 ||
    b === void 0 ||
    c === void 0 ||
    d === void 0 ||
    e === void 0 ||
    f === void 0 ||
    g === void 0 ||
    h === void 0
  )
    throw new Error("expected IPv6 address to expose 8 hextets");
  return [a, b, c, d, e, f, g, h];
}
const BLOCKED_IPV4_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "broadcast",
  "multicast",
  "linkLocal",
  "loopback",
  "carrierGradeNat",
  "private",
  "reserved",
]);
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "private",
  "linkLocal",
  "carrierGradeNat",
]);
const BLOCKED_IPV6_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
  "unspecified",
  "loopback",
  "linkLocal",
  "uniqueLocal",
  "multicast",
  "reserved",
  "benchmarking",
  "discard",
  "orchid2",
]);
const RFC2544_BENCHMARK_PREFIX = [import_ipaddr.default.IPv4.parse("198.18.0.0"), 15];
const CLOUD_METADATA_IP_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200", "fd00:ec2::254"]);
const EMBEDDED_IPV4_SENTINEL_RULES = [
  {
    matches: (parts) =>
      parts[0] === 0 &&
      parts[1] === 0 &&
      parts[2] === 0 &&
      parts[3] === 0 &&
      parts[4] === 0 &&
      parts[5] === 0,
    toHextets: (parts) => [parts[6], parts[7]],
  },
  {
    matches: (parts) =>
      parts[0] === 100 &&
      parts[1] === 65435 &&
      parts[2] === 1 &&
      parts[3] === 0 &&
      parts[4] === 0 &&
      parts[5] === 0,
    toHextets: (parts) => [parts[6], parts[7]],
  },
  {
    matches: (parts) => parts[0] === 8194,
    toHextets: (parts) => [parts[1], parts[2]],
  },
  {
    matches: (parts) => parts[0] === 8193 && parts[1] === 0,
    toHextets: (parts) => [parts[6] ^ 65535, parts[7] ^ 65535],
  },
  {
    matches: (parts) => (parts[4] & 64767) === 0 && parts[5] === 24318,
    toHextets: (parts) => [parts[6], parts[7]],
  },
];
function stripIpv6Brackets(value) {
  if (value.startsWith("[") && value.endsWith("]")) return value.slice(1, -1);
  return value;
}
function isNumericIpv4LiteralPart(value) {
  return /^[0-9]+$/.test(value) || /^0x[0-9a-f]+$/i.test(value);
}
/** Type guard for parsed IPv4 addresses. */
function isIpv4Address(address) {
  return address.kind() === "ipv4";
}
/** Type guard for parsed IPv6 addresses. */
function isIpv6Address(address) {
  return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
  if (!isIpv6Address(address)) return address;
  if (!address.isIPv4MappedAddress()) return address;
  return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return;
  return stripIpv6Brackets(trimmed);
}
/** Parses canonical IPv4/IPv6 literals, rejecting legacy IPv4 shorthand forms. */
function parseCanonicalIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) return;
  return import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized) ||
    import_ipaddr.default.IPv6.isValid(normalized)
    ? import_ipaddr.default.parse(normalized)
    : void 0;
}
/** Parses canonical IP literals plus legacy IPv4 forms needed for SSRF checks. */
function parseLooseIpAddress(raw) {
  const normalized = normalizeIpParseInput(raw);
  if (!normalized) return;
  return import_ipaddr.default.isValid(normalized)
    ? import_ipaddr.default.parse(normalized)
    : void 0;
}
/** Normalizes canonical IP literals and maps IPv4-mapped IPv6 addresses to IPv4 text. */
function normalizeIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) return;
  return normalizeLowercaseStringOrEmpty(normalizeIpv4MappedAddress(parsed).toString());
}
/** True only for canonical four-part dotted-decimal IPv4 literals. */
function isCanonicalDottedDecimalIPv4(raw) {
  const normalized = normalizeIpParseInput(raw);
  return normalized !== void 0 && import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized);
}
/** Detects legacy numeric IPv4 forms that canonical parsing deliberately rejects. */
function isLegacyIpv4Literal(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return false;
  const normalized = stripIpv6Brackets(trimmed);
  if (!normalized || normalized.includes(":")) return false;
  if (isCanonicalDottedDecimalIPv4(normalized)) return false;
  const parts = normalized.split(".");
  if (parts.length === 0 || parts.length > 4) return false;
  if (parts.some((part) => part.length === 0)) return false;
  if (!parts.every((part) => isNumericIpv4LiteralPart(part))) return false;
  return true;
}
/** True when a canonical IP literal is loopback, including IPv4-mapped IPv6. */
function isLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) return false;
  return normalizeIpv4MappedAddress(parsed).range() === "loopback";
}
/** True for link-local IPs, including legacy and embedded-IPv4 forms. */
function isLinkLocalIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) return false;
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv4Address(normalized)) return normalized.range() === "linkLocal";
  if (extractEmbeddedIpv4FromIpv6(normalized)?.range() === "linkLocal") return true;
  return normalized.range() === "linkLocal";
}
/** True for cloud metadata IP literals, including mapped and embedded forms. */
function isCloudMetadataIpAddress(raw) {
  const parsed = parseLooseIpAddress(raw);
  if (!parsed) return false;
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv6Address(normalized)) {
    const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
    if (embeddedIpv4 && CLOUD_METADATA_IP_ADDRESSES.has(embeddedIpv4.toString())) return true;
  }
  return CLOUD_METADATA_IP_ADDRESSES.has(normalized.toString());
}
/** True for canonical private, loopback, link-local, or blocked special-use IPs. */
function isPrivateOrLoopbackIpAddress(raw) {
  const parsed = parseCanonicalIpAddress(raw);
  if (!parsed) return false;
  const normalized = normalizeIpv4MappedAddress(parsed);
  if (isIpv4Address(normalized)) return PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(normalized.range());
  return isBlockedSpecialUseIpv6Address(normalized);
}
/** Applies the SSRF block policy for parsed IPv6 special-use ranges. */
function isBlockedSpecialUseIpv6Address(address, options = {}) {
  const range = address.range();
  if (range === "uniqueLocal" && options.allowUniqueLocalRange === true) return false;
  if (BLOCKED_IPV6_SPECIAL_USE_RANGES.has(range)) return true;
  const [firstPart] = expectIpv6Hextets(address.parts);
  return (firstPart & 65472) === 65216;
}
/** True for canonical IPv4 literals in RFC 1918 private ranges. */
function isRfc1918Ipv4Address(raw) {
  return parseCanonicalIpAddress(raw)?.range() === "private";
}
/** True for canonical IPv4 literals in the carrier-grade NAT range. */
function isCarrierGradeNatIpv4Address(raw) {
  return parseCanonicalIpAddress(raw)?.range() === "carrierGradeNat";
}
/** Applies the SSRF block policy for parsed IPv4 special-use ranges. */
function isBlockedSpecialUseIpv4Address(address, options = {}) {
  const inRfc2544BenchmarkRange = address.match(RFC2544_BENCHMARK_PREFIX);
  if (inRfc2544BenchmarkRange && options.allowRfc2544BenchmarkRange === true) return false;
  return BLOCKED_IPV4_SPECIAL_USE_RANGES.has(address.range()) || inRfc2544BenchmarkRange;
}
function decodeIpv4FromHextets(high, low) {
  const octets = [(high >>> 8) & 255, high & 255, (low >>> 8) & 255, low & 255];
  return import_ipaddr.default.IPv4.parse(octets.join("."));
}
/** Extracts embedded IPv4 addresses from mapped and transition IPv6 prefixes. */
function extractEmbeddedIpv4FromIpv6(address) {
  if (address.isIPv4MappedAddress()) return address.toIPv4Address();
  const parts = expectIpv6Hextets(address.parts);
  if (address.range() === "rfc6145") return decodeIpv4FromHextets(parts[6], parts[7]);
  if (address.range() === "rfc6052") return decodeIpv4FromHextets(parts[6], parts[7]);
  for (const rule of EMBEDDED_IPV4_SENTINEL_RULES) {
    if (!rule.matches(parts)) continue;
    const [high, low] = rule.toHextets(parts);
    return decodeIpv4FromHextets(high, low);
  }
}
/** Checks an IP literal against an exact IP or CIDR range, normalizing mapped IPv4. */
function isIpInCidr(ip, cidr) {
  const normalizedIp = parseCanonicalIpAddress(ip);
  if (!normalizedIp) return false;
  const candidate = cidr.trim();
  if (!candidate) return false;
  const comparableIp = normalizeIpv4MappedAddress(normalizedIp);
  if (!candidate.includes("/")) {
    const exact = parseCanonicalIpAddress(candidate);
    if (!exact) return false;
    const comparableExact = normalizeIpv4MappedAddress(exact);
    return (
      comparableIp.kind() === comparableExact.kind() &&
      comparableIp.toString() === comparableExact.toString()
    );
  }
  try {
    const [baseAddress, prefixLength] = import_ipaddr.default.parseCIDR(candidate);
    const comparableBase = normalizeIpv4MappedAddress(baseAddress);
    return (
      comparableIp.kind() === comparableBase.kind() &&
      comparableIp.match([comparableBase, prefixLength])
    );
  } catch {
    return false;
  }
}
//#endregion
export {
  parseLooseIpAddress as _,
  isCarrierGradeNatIpv4Address as a,
  isIpv4Address as c,
  isLinkLocalIpAddress as d,
  isLoopbackIpAddress as f,
  parseCanonicalIpAddress as g,
  normalizeIpAddress as h,
  isCanonicalDottedDecimalIPv4 as i,
  isIpv6Address as l,
  isRfc1918Ipv4Address as m,
  isBlockedSpecialUseIpv4Address as n,
  isCloudMetadataIpAddress as o,
  isPrivateOrLoopbackIpAddress as p,
  isBlockedSpecialUseIpv6Address as r,
  isIpInCidr as s,
  extractEmbeddedIpv4FromIpv6 as t,
  isLegacyIpv4Literal as u,
};
