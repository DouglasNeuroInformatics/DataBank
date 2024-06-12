/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';
import type { RouteObject } from 'react-router-dom';

import DatasetCard from '../components/DatasetCard';

const ViewPublicDatasetsPage = () => {
  const { t } = useTranslation('common');
  const dummyDatasetInfo: DatasetCardProps = {
    createdAt: new Date('2024-02-20'),
    description: `This is a test dataset for the dataset card. 
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloribus 
    quibusdam exercitationem non distinctio tempore earum consectetur id 
    nisi facilis, at, inventore placeat dignissimos vel labore culpa in 
    similique, laudantium tempora. Lorem ipsum dolor sit amet consectetur 
    adipisicing elit. Vel tenetur minus quod numquam consequuntur, velit, 
    obcaecati nobis aliquid sit temporibus mollitia tempora ducimus? Maxime 
    voluptatem alias debitis nemo perspiciatis sapiente.
    Distinctio ut perspiciatis possimus molestias magnam nisi deleniti 
    repudiandae porro repellendus totam necessitatibus, error iusto 
    reprehenderit dolor dolorum nostrum sit! Molestias molestiae autem 
    suscipit eveniet nostrum pariatur dignissimos tenetur error.
    Iure in dolor ab ipsa numquam excepturi repellendus sunt voluptates 
    vel. Itaque, debitis vitae dolores temporibus fugit modi sit consectetur
     excepturi. Laudantium impedit quam eligendi in accusamus nulla 
     obcaecati odio?
    Eligendi, iste excepturi nemo autem nesciunt, repellendus minima unde 
    quod ullam nihil neque placeat pariatur odit expedita cupiditate ut 
    labore accusantium nulla soluta maiores earum sed nam. Iste, odit temporibus?
    Aut aliquam excepturi fugit, eveniet nesciunt repudiandae molestiae 
    est minus quam, quasi enim? Eos amet sapiente culpa. Officiis facilis 
    laboriosam, temporibus adipisci at neque maiores porro? Natus dolor 
    eveniet ducimus.`,
    id: '001',
    isManager: false,
    license: 'Public',
    managerIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
    name: 'Happiness Dataset',
    updatedAt: new Date('2024-05-29')
  };
  const dummyDatasetsInfo: DatasetCardProps[] = [
    dummyDatasetInfo,
    dummyDatasetInfo,
    dummyDatasetInfo,
    dummyDatasetInfo
  ];

  // // useEffect to fetch all public datasets information
  // // here should use a function to get all
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title className="text-3xl">{t('publicDatasets')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul>
            {dummyDatasetsInfo.map((datasetInfo, i) => {
              return (
                <>
                  <li key={i}>
                    <DatasetCard
                      createdAt={datasetInfo.createdAt}
                      description={datasetInfo.description}
                      id={datasetInfo.id}
                      isManager={datasetInfo.isManager}
                      license={datasetInfo.license}
                      managerIds={datasetInfo.managerIds}
                      name={datasetInfo.name}
                      updatedAt={datasetInfo.updatedAt}
                    />
                  </li>
                </>
              );
            })}
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between"></Card.Footer>
      </Card>
    </>
  );
};

export const viewPublicDatasetsRoute: RouteObject = {
  path: 'datasets',
  element: <ViewPublicDatasetsPage />
};
