import { Gn as SpeechProviderPlugin, Il as SpeechVoiceOption } from "../../types-Ga3mNO_F.js";
//#region extensions/microsoft/speech-provider.d.ts
declare function isCjkDominant(text: string): boolean;
declare function listMicrosoftVoices(timeoutMs?: number): Promise<SpeechVoiceOption[]>;
declare function buildMicrosoftSpeechProvider(): SpeechProviderPlugin;
//#endregion
export { buildMicrosoftSpeechProvider, isCjkDominant, listMicrosoftVoices };
