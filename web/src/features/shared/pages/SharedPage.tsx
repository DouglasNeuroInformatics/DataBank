// import { useEffect, useMemo, useState } from 'react';

// import type { DatasetInfo } from '@databank/core';
// import { SearchBar } from '@douglasneuroinformatics/libui/components';
// import axios from 'axios';
// import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
// import { useNavigate } from 'react-router-dom';

// import { LoadingFallback } from '@/components';
// import { DatasetCard } from '@/components/DatasetCard';
// import { Heading } from '@/components/Heading';

// export const SharedPage = () => {
//   const navigate = useNavigate();
//   const [availableDatasets, setAvailableDatasets] = useState<DatasetInfo[]>();
//   const [searchTerm, setSearchTerm] = useState('');
//   const { t } = useTranslation('common');

//   const fetchAvailable = async () => {
//     const response = await axios.get<DatasetInfo[]>('/v1/datasets/available');
//     setAvailableDatasets(response.data);
//   };

//   useEffect(() => {
//     void fetchAvailable();
//   }, []);

//   const filteredDatasets = useMemo(() => {
//     if (!availableDatasets) {
//       return null;
//     }
//     return availableDatasets.filter((dataset) => dataset.name.toUpperCase().includes(searchTerm.toUpperCase()));
//   }, [availableDatasets, searchTerm]);

//   return (
//     <div className="flex h-full w-full flex-col">
//       <Heading
//         title={t({
//           en: 'Shared Datasets',
//           fr: 'ensembles de données partagés'
//         })}
//       />
//       <SearchBar
//         className="mb-3 rounded-sm"
//         size="sm"
//         value={searchTerm}
//         onChange={(e) => {
//           setSearchTerm(e.target.value);
//         }}
//       />
//       <div className="overflow-hidden">
//         {filteredDatasets === null ? (
//           <LoadingFallback />
//         ) : filteredDatasets.length === 0 ? (
//           <div>
//             <p>{t('noResultsFound')}</p>
//           </div>
//         ) : (
//           <ul className="h-full overflow-x-visible overflow-y-scroll rounded-sm shadow">
//             {filteredDatasets.map((dataset) => (
//               <li key={dataset._id}>
//                 <DatasetCard
//                   dataset={dataset}
//                   onClick={({ _id }) => {
//                     navigate(_id);
//                   }}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };
