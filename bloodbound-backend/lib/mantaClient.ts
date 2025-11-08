import { MantaClient } from 'mantahq-sdk';

const manta = new MantaClient({
  sdkKey: process.env.MANTA_SDK_KEY!,
});

export default manta;