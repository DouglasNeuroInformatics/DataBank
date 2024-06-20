/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { RouteObject } from 'react-router-dom';

import { ProjectCard, type ProjectCardProps } from '../components/ProjectCard';

const ViewProjectsPage = () => {
  const dummyProjectsInfo: ProjectCardProps[] = [
    {
      createdAt: new Date('2024-02-20'),
      description: `This is a test Project for the Project card. 
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
      userIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
      name: 'Happiness Project',
      updatedAt: new Date('2024-05-29'),
      isProjectManager: true,
      expiry: new Date('2025-11-20'),
      externalId: 'LETS_WORK_ON_A_PROJECT'
    },
    {
      createdAt: new Date('2024-02-20'),
      description: `This is a test Project for the Project card. 
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
      userIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
      name: 'Happiness Project',
      updatedAt: new Date('2024-05-29'),
      isProjectManager: true,
      expiry: new Date('2025-11-20'),
      externalId: 'LETS_WORK_ON_A_PROJECT'
    },
    {
      createdAt: new Date('2024-02-20'),
      description: `This is a test Project for the Project card. 
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
      userIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
      name: 'Happiness Project',
      updatedAt: new Date('2024-05-29'),
      isProjectManager: true,
      expiry: new Date('2025-11-20'),
      externalId: 'LETS_WORK_ON_A_PROJECT'
    },
    {
      createdAt: new Date('2024-02-20'),
      description: `This is a test Project for the Project card. 
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
      userIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
      name: 'Happiness Project',
      updatedAt: new Date('2024-05-29'),
      isProjectManager: true,
      expiry: new Date('2025-11-20'),
      externalId: 'LETS_WORK_ON_A_PROJECT'
    },
    {
      createdAt: new Date('2024-02-20'),
      description: `This is a test Project for the Project card. 
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
      userIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
      name: 'Happiness Project',
      updatedAt: new Date('2024-05-29'),
      isProjectManager: true,
      expiry: new Date('2025-11-20'),
      externalId: 'LETS_WORK_ON_A_PROJECT'
    }
  ];

  // // useEffect to fetch all public datasets information
  // // here should use a function to get all
  return (
    <ul>
      {dummyProjectsInfo.map((projectInfo, i) => {
        return (
          <>
            <li key={i}>
              <ProjectCard
                createdAt={projectInfo.createdAt}
                description={projectInfo.description}
                expiry={projectInfo.expiry}
                externalId={projectInfo.externalId}
                id={projectInfo.id}
                isProjectManager={projectInfo.isProjectManager}
                name={projectInfo.name}
                updatedAt={projectInfo.updatedAt}
                userIds={projectInfo.userIds}
              />
            </li>
          </>
        );
      })}
    </ul>
  );
};

export const viewProjectsRoute: RouteObject = {
  path: 'projects',
  element: <ViewProjectsPage />
};
