import React, { useRef } from 'react';

import { Button } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CircleCheckIcon } from 'lucide-react';
import { motion } from 'motion/react';

import collaborationFigure from '@/assets/svg/collaboration.svg?raw';
import dataManagementFigure from '@/assets/svg/data-management.svg?raw';
import { HeroIcon } from '@/components/HeroIcon';

const InfoGroup: React.FC<{
  description?: string;
  items: {
    description: string;
    label: string;
  }[];
  title: string;
}> = ({ description, items, title }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold leading-tight tracking-tight md:text-xl xl:text-2xl">{title}</h3>
        {description && <span className="text-muted-foreground text-sm">{description}</span>}
      </div>
      <ul className="space-y-5">
        {items.map((item) => (
          <li className="flex" key={item.label}>
            <div className="flex h-full w-10 shrink-0 flex-col [&>svg>circle]:stroke-none [&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-green-600 [&>svg]:stroke-white">
              <CircleCheckIcon style={{ height: '32px', width: '32px' }} />
            </div>
            <div className="flex grow flex-col">
              <h5 className="mb-1.5 text-base font-semibold leading-tight tracking-tight md:text-[1.0625rem]">
                {item.label}
              </h5>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RouteComponent = () => {
  const keyFeaturesRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  return (
    <>
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-5 text-center xl:text-left">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex grow flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-slate-100">
            {t('common.platformName')}
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 w-11/12 text-base md:mt-5 xl:mx-0">
            {t('common.platformDescription')}
          </p>
          <div className="mt-5 flex justify-center gap-3 xl:justify-start">
            <Button
              asChild
              label={t({
                en: 'Get started',
                fr: 'Commencer'
              })}
              size="lg"
              type="button"
            >
              <Link to="/auth/create-account" />
            </Button>
            <Button
              label={t({
                en: 'Learn more',
                fr: 'En savoir plus'
              })}
              size="lg"
              type="button"
              variant="secondary"
              onClick={() => {
                keyFeaturesRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, x: 0, y: 0 }}
          className="hidden w-80 xl:block"
          initial={{ opacity: 0, x: 10, y: 10 }}
          transition={{ duration: 0.7 }}
        >
          <HeroIcon />
        </motion.div>
      </section>
      <section className="pb-8" ref={keyFeaturesRef}>
        <h2 className="mb-8 text-center text-[1.375rem] font-bold leading-tight tracking-tight md:text-2xl xl:text-3xl">
          {t({
            en: 'Key Features',
            fr: 'Fonctionnalités principales'
          })}
        </h2>
        <div className="flex flex-col gap-8 xl:gap-16">
          <div className="flex justify-between gap-12 py-8 xl:gap-16">
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
              className="hidden items-center justify-center lg:flex [&>svg]:h-72 [&>svg]:w-auto"
              dangerouslySetInnerHTML={{ __html: dataManagementFigure }}
            />
          </div>
          <div className="flex justify-between gap-12 py-8 xl:gap-16">
            <div
              className="hidden items-center justify-center lg:flex [&>svg]:h-72 [&>svg]:w-auto"
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
    </>
  );
};

export const Route = createFileRoute('/_public/')({
  component: RouteComponent
});
