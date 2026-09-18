import { GoogleGenAI } from "@google/genai";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-B3-rCSAh.js";
//#region extensions/google/google-genai-runtime.ts
function createGoogleGenAI(options) {
  const httpOptions = options.httpOptions ?? {};
  return new GoogleGenAI({
    ...options,
    httpOptions: {
      ...httpOptions,
      headers: {
        ...httpOptions.headers,
        ...resolveGoogleApiClientHeaders({
          baseUrl: typeof httpOptions.baseUrl === "string" ? httpOptions.baseUrl : void 0,
        }),
      },
    },
  });
}
//#endregion
export { createGoogleGenAI as t };
