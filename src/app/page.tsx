import { sleep } from '@douglasneuroinformatics/utils';

export default async function Home() {
  await sleep(5);
  throw new Error();
  return <div>Data Bank</div>;
}
