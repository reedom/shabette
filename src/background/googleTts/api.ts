export namespace GoogleTtsInternal {
  export type Gender = 'MALE' | 'FEMALE';

  export type AudioEncoding =
    | 'AUDIO_ENCODING_UNSPECIFIED'
    | 'LINEAR16'
    | 'MP3'
    | 'OGG_OPUS'
    | 'MULAW'
    | 'ALAW';


  export interface Voice {
    languageCodes: string[]; // ['en-AU']
    name: string; // "en-AU-Standard-A", "en-AU-Neural2-D"
    naturalSampleRateHertz: number; // 24000
    ssmlGender: Gender;
  }

  interface SynthesizeBody {
    input: { text: string } | { ssml: string };
    voice: {
      name: string;
      languageCode?: string;
      ssmlGender?: Gender;
    },
    audioConfig?: {
      audioEncoding?: AudioEncoding;
      speakingRate?: number,
      pitch?: number,
      volumeGainDb?: number,
      sampleRateHertz?: number,
      effectsProfileId?: string[]
    }
  }

  export interface VoiceOptions {
    speed?: number;
    pitch?: number;
    gender?: Gender;
    volume?: number;
  }

  export async function listVoices({
    apiKey
  }: {
    apiKey: string;
  }): Promise<Voice[]> {
    const endpoint = `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}`;
    let error: Error;
    try {
      const res = await fetch(endpoint)
      if (res.ok) {
        return (await res.json()).voices;
      }

      const ret = await res.json();
      console.warn('Fetch response is not ok:', ret);
      error = new Error(`Fetch response is not ok: ${ret}`);
    } catch (err) {
      console.log('Failed to fetch voices', err);
      if (err instanceof Error){
        throw err;
      } else {
        throw new Error(`Failed to fetch voices: ${err}`);
      }
    }

    throw error;
  }


  export async function synthesize({
    apiKey, text, lang, voice, options
  }: {
    apiKey: string;
    text: string;
    lang: string;
    voice: string;
    options?: VoiceOptions,
  }): Promise<string> {
    const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
    let error: Error;
    try {
      const input: SynthesizeBody = {
        "input": { "text": text },
        "voice": { "name": voice, "languageCode": lang },
        "audioConfig": { "audioEncoding": "LINEAR16" }
      };
      if (options?.gender) {
        input.voice.ssmlGender = options.gender;
      }
      if (options?.speed) {
        input.audioConfig!.speakingRate = options.speed;
      }
      if (options?.pitch) {
        input.audioConfig!.pitch = options.pitch;
      }
      if (options?.volume) {
        input.audioConfig!.volumeGainDb = options.volume;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(input),
      })
      if (res.ok) {
        return (await res.json()).audioContent;
      } else {
        const ret = await res.json();
        console.warn('Fetch response is not ok:', ret);
        error = new Error(`Fetch response is not ok: ${ret}`);
      }
    } catch (err) {
      console.warn('Failed to synthesize', err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(`Failed to synthesize: ${err}`);
      }
    }
    throw error;
  }
}
