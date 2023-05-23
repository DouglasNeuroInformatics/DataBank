import { sleep } from '@douglasneuroinformatics/utils';

export default async function Home() {
  await sleep(5);
  return <div>Data Bank</div>;
}
