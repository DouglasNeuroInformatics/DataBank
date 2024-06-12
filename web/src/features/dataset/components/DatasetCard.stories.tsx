import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import DatasetCard from './DatasetCard.js';

const meta: Meta<typeof DatasetCard> = {
  component: DatasetCard,
  decorators: [
    (Story) => (
      <div className="h-full w-full p-12">
        <Story />
      </div>
    )
  ]
};

export default meta;

export const Default: StoryObj<typeof DatasetCard> = {
  args: {
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
    isManager: true,
    license: 'Public',
    managerIds: ['063b5c7', '063b5eb', '063b598', '063b537'],
    name: 'Happiness Dataset',
    updatedAt: new Date('2024-05-29')
  }
};

export const NotAManager: StoryObj<typeof DatasetCard> = {
  args: {
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
  }
};
