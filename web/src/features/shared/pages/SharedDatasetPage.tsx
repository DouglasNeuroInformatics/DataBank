// import { ActionDropdown, Button, Table } from '@douglasneuroinformatics/libui/components';
// import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
// import { useParams } from 'react-router-dom';

// import { LoadingFallback } from '@/components';
// import { Heading } from '@/components/Heading';
// import { useDataset } from '@/hooks/useDataset';

// export const SharedDatasetPage = () => {
//   const params = useParams();
//   const { dataset, download, table } = useDataset(params.id!);
//   const { t } = useTranslation('common');

//   return dataset ? (
//     <div className="flex h-full w-full flex-col">
//       <Heading subtitle={dataset.description} title={dataset.name}>
//         <div className="flex gap-3">
//           <Button
//             className="whitespace-nowrap"
//             label={t('contactOwner')}
//             size="sm"
//             variant="secondary"
//             onClick={() => {
//               window.open(`mailto:${dataset.owner.email}?subject=${encodeURIComponent(dataset.name)}`, '_self');
//             }}
//           />
//           <ActionDropdown
//             className="w-min whitespace-nowrap"
//             options={['CSV', 'TSV', 'DICT']}
//             size="sm"
//             title={t('download')}
//             onSelection={(option) => {
//               download(option);
//             }}
//           />
//         </div>
//       </Heading>
//       <div className="flex-grow overflow-hidden">
//         <Table columns={table.columns} data={table.data} />
//       </div>
//     </div>
//   ) : (
//     <LoadingFallback />
//   );
// };
