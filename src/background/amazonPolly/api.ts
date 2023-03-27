import {
  DescribeVoicesCommand,
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommand,
  TextType,
  Voice,
} from '@aws-sdk/client-polly';

const region = 'ap-northeast-1';

function createClient(): PollyClient {
  const accessKeyId = process.env.AWS_API_ACCESS_KEY;
  if (!accessKeyId) {
    throw new Error('You need to set your Amazon AWS Access Key first.');
  }

  const secretAccessKey = process.env.AWS_API_SECRET;
  if (!secretAccessKey) {
    throw new Error('You need to set your Amazon AWS Secret first.');
  }

  return new PollyClient({
    region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

export namespace AmazonPollyInternal {
  export enum Gender {
    Female = "Female",
    Male = "Male"
  }

  export async function listVoices(): Promise<Voice[]> {
    const client = createClient();
    const voices: Voice[] = [];
    let nextToken: string | undefined;
    let sentinel = 10;
    do {
      const res = await client.send(new DescribeVoicesCommand({}));
      voices.push(...res.Voices!);
      nextToken = res.NextToken;
    } while (nextToken && 0 < --sentinel);
    return voices;
  }


  export async function synthesize({
    voiceId, text, dialect, // options
  }: {
    voiceId: string;
    text: string;
    dialect?: string;
    // options?: VoiceOptions,
  }): Promise<Uint8Array> {
    try {
      const client = createClient();
      const res = await client.send(new SynthesizeSpeechCommand({
        VoiceId: voiceId,
        Text: text,
        LanguageCode: dialect,
        OutputFormat: OutputFormat.MP3,
        TextType: TextType.TEXT,
      }));
      return await res!.AudioStream!.transformToByteArray();
    } catch (err) {
      console.warn('Failed to synthesize', err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(`Failed to synthesize: ${err}`);
      }
    }
  }
}
