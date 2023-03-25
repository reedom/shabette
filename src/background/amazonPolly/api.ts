import { Voice } from '@aws-sdk/client-polly/dist-types/models/models_0';
import { DescribeVoicesCommand, PollyClient } from '@aws-sdk/client-polly';

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
}
