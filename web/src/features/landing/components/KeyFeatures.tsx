import type { Ref } from 'react';

import { useTranslation } from '@douglasneuroinformatics/libui/hooks';

import collaborationFigure from '@/assets/svg/collaboration.svg?raw';
import dataManagementFigure from '@/assets/svg/data-management.svg?raw';

import { InfoGroup } from './InfoGroup';

export const KeyFeatures: React.FC<{ ref: Ref<HTMLElement> }> = ({ ref }) => {
  const { t } = useTranslation();
  return (
    <section ref={ref}>
      <h2 className="mb-8 text-center text-[1.375rem] font-bold leading-tight tracking-tight md:text-2xl xl:text-3xl">
        {t({
          en: 'Key Features',
          fr: 'Fonctionnalités principales'
        })}
      </h2>
      <div className="flex flex-col gap-8">
        <div className="mb-8 grid gap-12 lg:grid-cols-2">
          <InfoGroup
            description={t({
              en: 'Efficiently manage your datasets with easy uploads, centralized storage, project organization, and automatic version tracking.',
              fr: 'Gérez efficacement vos bases de données grâce à des téléchargements simples, un stockage centralisé, une organisation par projet et un suivi automatique des versions.'
            })}
            items={[
              {
                description: t({
                  en: 'Easily upload your tabular data in common formats like CSV or Excel.',
                  fr: 'Importez facilement vos données tabulaires dans des formats courants comme CSV ou Excel.'
                }),
                label: t({
                  en: 'Upload Datasets',
                  fr: 'Télécharger des bases de données'
                })
              },
              {
                description: t({
                  en: 'Keep all your datasets in one place for easy access and collaboration.',
                  fr: 'Conservez toutes vos bases de données au même endroit pour un accès facile et une collaboration efficace.'
                }),
                label: t({
                  en: 'Centralized Storage',
                  fr: 'Stockage centralisé'
                })
              },
              {
                description: t({
                  en: 'Group datasets into projects to stay organized and maintain clarity.',
                  fr: 'Regroupez les bases de données dans des projets afin de rester organisé et garder une vue claire.'
                }),
                label: t({
                  en: 'Organized by Projects',
                  fr: 'Organisé par projets'
                })
              },
              {
                description: t({
                  en: 'Every time a dataset is updated, changes are saved and a changelog is created automatically.',
                  fr: "Chaque fois qu'une base de données est mise à jour, les modifications sont enregistrées et un journal des changements est créé automatiquement."
                }),
                label: t({
                  en: 'Automatic Version Tracking',
                  fr: 'Suivi automatique des versions'
                })
              }
            ]}
            title={t({
              en: 'Data Management',
              fr: 'Gestion des données'
            })}
          />
          <div
            className="hidden items-center justify-center lg:flex [&>svg]:h-96"
            dangerouslySetInnerHTML={{ __html: dataManagementFigure }}
          />
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div
            className="hidden items-center justify-center lg:flex [&>svg]:h-96 [&>svg]:w-auto"
            dangerouslySetInnerHTML={{ __html: collaborationFigure }}
          />
          <InfoGroup
            description={t({
              en: 'Easily manage who can access your data with intuitive controls and selective sharing tailored for collaborative environments.',
              fr: "Gérez facilement l'accès à vos données grâce à des contrôles intuitifs et un partage sélectif adaptés aux environnements collaboratifs."
            })}
            items={[
              {
                description: t({
                  en: 'Control who can access datasets, including the ability to grant access to specific variables).',
                  fr: "Contrôlez qui peut accéder aux bases de données, y compris la possibilité d'accorder l'accès à des variables spécifiques."
                }),
                label: t({
                  en: 'Selective Sharing',
                  fr: 'Partage sélectif'
                })
              },
              {
                description: t({
                  en: 'Intuitive permission controls designed for non-technical users, such as clinicians and researchers.',
                  fr: "Contrôles d'autorisations intuitifs conçus pour les utilisateurs non techniques, tels que les cliniciens et les chercheurs."
                }),
                label: t({
                  en: 'User Management',
                  fr: 'Gestion des utilisateurs'
                })
              }
            ]}
            title={t({
              en: 'Access and Collaboration',
              fr: 'Accès et collaboration'
            })}
          />
        </div>
      </div>
    </section>
  );
};
