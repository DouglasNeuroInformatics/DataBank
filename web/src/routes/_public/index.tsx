import { useMemo, useRef } from 'react';

import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { DatabaseIcon, FolderOpenIcon, HistoryIcon, ShieldCheckIcon, UploadIcon, UsersIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { HeroIcon } from '@/components/HeroIcon';

type Feature = {
  description: string;
  icon: LucideIcon;
  label: string;
};

const FeatureCard = ({ description, icon: Icon, label }: Feature) => {
  return (
    <Card className="h-full">
      <Card.Header className="gap-3">
        <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
          <Icon className="size-5!" />
        </div>
        <Card.Title className="text-base">{label}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="text-muted-foreground text-sm">{description}</p>
      </Card.Content>
    </Card>
  );
};

const RouteComponent = () => {
  const keyFeaturesRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  const features = useMemo<Feature[]>(
    () => [
      {
        description: t({
          en: 'Easily upload your tabular data in common formats like CSV or Excel.',
          fr: 'Importez facilement vos données tabulaires dans des formats courants comme CSV ou Excel.'
        }),
        icon: UploadIcon,
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
        icon: DatabaseIcon,
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
        icon: FolderOpenIcon,
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
        icon: HistoryIcon,
        label: t({
          en: 'Automatic Version Tracking',
          fr: 'Suivi automatique des versions'
        })
      },
      {
        description: t({
          en: 'Control who can access datasets, including the ability to grant access to specific variables.',
          fr: "Contrôlez qui peut accéder aux bases de données, y compris la possibilité d'accorder l'accès à des variables spécifiques."
        }),
        icon: ShieldCheckIcon,
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
        icon: UsersIcon,
        label: t({
          en: 'User Management',
          fr: 'Gestion des utilisateurs'
        })
      }
    ],
    [t]
  );

  return (
    <>
      <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center gap-8 text-center xl:text-left">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex grow flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.7 }}
        >
          <Heading className="text-4xl lg:text-5xl" variant="h1">
            {t('common.platformName')}
          </Heading>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base xl:mx-0">
            {t('common.platformDescription')}
          </p>
          <div className="mt-6 flex justify-center gap-3 xl:justify-start">
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
              variant="outline"
              onClick={() => {
                keyFeaturesRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, x: 0, y: 0 }}
          className="hidden w-80 shrink-0 xl:block"
          initial={{ opacity: 0, x: 10, y: 10 }}
          transition={{ duration: 0.7 }}
        >
          <HeroIcon />
        </motion.div>
      </section>
      <section className="scroll-mt-20 py-16" ref={keyFeaturesRef}>
        <div className="mx-auto max-w-2xl text-center">
          <Heading variant="h2">
            {t({
              en: 'Key Features',
              fr: 'Fonctionnalités principales'
            })}
          </Heading>
          <p className="text-muted-foreground mt-3 text-base">
            {t({
              en: 'Everything you need to store, organize, and share research data with your collaborators.',
              fr: 'Tout ce dont vous avez besoin pour stocker, organiser et partager des données de recherche avec vos collaborateurs.'
            })}
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.label} {...feature} />
          ))}
        </div>
      </section>
    </>
  );
};

export const Route = createFileRoute('/_public/')({
  component: RouteComponent
});
