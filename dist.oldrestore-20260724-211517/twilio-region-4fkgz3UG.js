//#region extensions/voice-call/src/providers/twilio-region.ts
const TWILIO_REGIONS = ["us1", "ie1", "au1"];
const TWILIO_API_HOSTNAME_BY_REGION = {
  us1: "api.twilio.com",
  ie1: "api.dublin.ie1.twilio.com",
  au1: "api.sydney.au1.twilio.com",
};
const TWILIO_API_HOSTNAMES = new Set(Object.values(TWILIO_API_HOSTNAME_BY_REGION));
function resolveTwilioApiHostname(region) {
  return TWILIO_API_HOSTNAME_BY_REGION[region ?? "us1"];
}
function resolveTwilioApiBaseUrl(params) {
  return `https://${resolveTwilioApiHostname(params.region)}/2010-04-01/Accounts/${params.accountSid}`;
}
function requireSupportedTwilioApiHostname(baseUrl) {
  const hostname = new URL(baseUrl).hostname;
  if (!TWILIO_API_HOSTNAMES.has(hostname))
    throw new Error(`Unsupported Twilio API hostname: ${hostname}`);
  return hostname;
}
//#endregion
export {
  requireSupportedTwilioApiHostname as n,
  resolveTwilioApiBaseUrl as r,
  TWILIO_REGIONS as t,
};
