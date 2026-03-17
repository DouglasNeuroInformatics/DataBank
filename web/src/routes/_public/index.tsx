import React, { useRef } from 'react';

import { Button } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CircleCheckIcon } from 'lucide-react';
import { motion } from 'motion/react';

import collaborationFigure from '@/assets/svg/collaboration.svg?raw';
import dataManagementFigure from '@/assets/svg/data-management.svg?raw';

const HeroIcon = () => {
  return (
    <svg
      data-name="Layer 1"
      height="306"
      viewBox="0 0 158.81 130.19"
      width="406"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 -18.57 131.42)"
          gradientUnits="userSpaceOnUse"
          id="linear-gradient"
          x1="83.01"
          x2="42.02"
          y1="54.9"
          y2="60.46"
        >
          <stop offset="0.01" />
          <stop offset="0.08" stopOpacity="0.69" />
          <stop offset="0.21" stopOpacity="0.32" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          gradientTransform="rotate(180 -235.545 61.97)"
          id="linear-gradient-2"
          x1="-547.98"
          x2="-499.46"
          xlinkHref="#linear-gradient"
          y1="61.6"
          y2="27.21"
        />
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 -7.29 140.53)"
          id="linear-gradient-3"
          x1="84.42"
          x2="76.09"
          xlinkHref="#linear-gradient"
          y1="69.76"
          y2="16.29"
        />
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 -7.29 140.53)"
          id="linear-gradient-4"
          x1="90.92"
          x2="82.6"
          xlinkHref="#linear-gradient"
          y1="61.65"
          y2="8.18"
        />
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 -7.29 140.53)"
          id="linear-gradient-5"
          x1="91.34"
          x2="81.27"
          xlinkHref="#linear-gradient"
          y1="69.04"
          y2="4.4"
        />
        <linearGradient
          id="linear-gradient-6"
          x1="147.04"
          x2="105.55"
          xlinkHref="#linear-gradient"
          y1="88.11"
          y2="13.31"
        />
      </defs>
      <path
        className="opacity-50 dark:opacity-20"
        d="M37.39 133.54c13.07 6.39 30 3.93 43.88 2 11-1.57 18.9-4 30-2.73a97.49 97.49 0 0035-2.38c4.79-1.21 9.59-2.86 13.45-5.94s6.67-7.84 6.33-12.77c-.47-6.71-6.21-11.61-10-17.13-11.23-16.19-6.16-38.61-13-57.07a46.18 46.18 0 00-63.6-25.41c-15 7.32-25.11 20.44-39.45 28.8-7.76 4.52-16.28 8.09-22.51 14.58-6.89 7.14-10.25 17.26-10.2 27.18s3.27 19.65 8.11 28.33 11.44 16.56 20 21.52c.68.35 1.33.69 1.99 1.02z"
        fill="#68e1fd"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M33.69 114.84c-2.39.34-5.54 2.1-4.44 4.26a3.89 3.89 0 002.75 1.61 130.3 130.3 0 0017.2 3.12c10.5 1.19 21.1 1.11 31.66 1l30.71-.26c12-.1 24.17-.21 36.06-2.16-1-5-6.9-7.1-11.95-7.65-12.5-1.38-25.28 1.06-37.6-1.41-6.3-1.27-12.51-3.82-18.93-3.31-6.9.54-11.71 4.19-18.72 3.56-8.84-.79-18-.03-26.74 1.24z"
        fill="#68e1fd"
        opacity="0.18"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M48.45 116.87a4.36 4.36 0 00.35 1.83 3 3 0 001.33 1.24 5.24 5.24 0 003.9.39.74.74 0 00.45-.28.56.56 0 00.08-.38 2.93 2.93 0 00-1-1.84 6.13 6.13 0 01-1.4-1.61c-.6-1.21-.16-4.42-2.43-3.9-1.92.43-1.33 3.2-1.28 4.55z"
        fill="#fbb8aa"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M48.14 119s-.33.8.07 1.26 4.49 3 7.25 1-3.75-2.26-3.75-2.26z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M48.3 117.19a.59.59 0 01.73.19 2.41 2.41 0 002.19.79c.9-.22 1.26-1.25 1.7-1.25s2.82 2 3 2.89-1.08 1.5-2.42 1.59-4.39-.85-5-1.55a2.9 2.9 0 01-.2-2.66z"
        fill="#fff"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M40.65 118.1a4.56 4.56 0 00.34 1.84 3.09 3.09 0 001.34 1.24 5.28 5.28 0 003.9.38.73.73 0 00.45-.27.66.66 0 00.08-.39 2.9 2.9 0 00-1-1.83 6.9 6.9 0 01-1.41-1.6c-.59-1.21-.15-4.42-2.42-3.91-1.93.44-1.33 3.21-1.28 4.54z"
        fill="#fbb8aa"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M40.34 120.29s-.32.79.07 1.26 4.48 3 7.24 1-3.74-2.31-3.74-2.31z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M40.5 118.44a.57.57 0 01.73.19 2.38 2.38 0 002.19.78c.89-.21 1.26-1.24 1.69-1.25s2.83 2 3 2.89-1.08 1.51-2.42 1.59-4.39-.84-5-1.55a2.87 2.87 0 01-.19-2.65z"
        fill="#fff"
        transform="translate(-7.29 -7.47)"
      />
      <path d="M39 84.53s-.42 23.37 1.31 31.16l4.4.54 3-32z" fill="#473f47" transform="translate(-7.29 -7.47)" />
      <path d="M52.6 82s2.06 12.6-.44 32.84l-4.4.55-3-32z" fill="#473f47" transform="translate(-7.29 -7.47)" />
      <path
        d="M57.74 71.94c-.05.84-.32 1.58-1.06 1.82h-.19c-1.35.27-3.12-.75-4.35-1.65A16.87 16.87 0 0150.66 71v-9l6.56 6.72a10.43 10.43 0 01.52 3.22z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M52.19 72.12c0 .42.06.85.06 1.27 0 2.33-.54 4.74.15 7a2.52 2.52 0 01.2 1.61 2 2 0 01-1 .94 19.46 19.46 0 01-6.75 1.8c-1.74.24-4.22.76-5.83-.18a2.89 2.89 0 01-1.14-1.89 35.75 35.75 0 01-1.09-7.35c0-.33-.05-.65-.06-1-.14-2.24-.18-4.47-.14-6.71 0-1.62.16-3.37 1.22-4.59A11.58 11.58 0 0144 59.93a6.64 6.64 0 012-.11 8.44 8.44 0 012.75.93 4.68 4.68 0 012.44 2 13.82 13.82 0 011.15 3.7 13.37 13.37 0 01.15 3.55c-.06.59-.21 1.18-.27 1.77a1.73 1.73 0 00-.03.35z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M42.68 85.32c-.68.2-2.24-.42-2.76-.51-.31 0-.59-.21-.9-.28-1.54-.39-1.72-4.73-1.87-5.89a82.84 82.84 0 01-1.06-9.38 10 10 0 01.41-3.53 4.09 4.09 0 012.31-2.58c2-.71 2.56 5.53 2.83 6.82.34 1.62.69 3.24 1 4.85.24 1.19.11 2.13 1 3a.49.49 0 00.24.14.48.48 0 00.24-.06 3.51 3.51 0 011.24-.29.78.78 0 01.94.7 2.78 2.78 0 01-1.19 2.93c-.42.27-.9.41-1.33.67-1.59 1-.26 2-.89 3.2a.42.42 0 01-.21.21z"
        fill="#020202"
        opacity="0.1"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M47.43 58a1.47 1.47 0 01-1 .47 4.62 4.62 0 01-.91 0h-.17a.2.2 0 00-.13 0 .24.24 0 000 .14 10.18 10.18 0 000 1.83v.33a.6.6 0 010 .35.55.55 0 01-.37.24 2.9 2.9 0 01-.83.15 3.67 3.67 0 01-1.69-.6 17.25 17.25 0 00-.17-3.13 16.63 16.63 0 01-.4-4 2.2 2.2 0 012.55-2.18 5 5 0 012.73.75 1.09 1.09 0 01.41.81c.1.53.19 1.06.24 1.6s.11 1.22.12 1.83a2.08 2.08 0 01-.38 1.41zM63.34 65.17c.06-.09.18-.19.27-.13a.26.26 0 01.08.13.59.59 0 00.54.31h.65a1.83 1.83 0 011.44.78 2.85 2.85 0 01.52 1.59 2 2 0 01-.39 1.44 2.68 2.68 0 01-2.15.57h-.7a.66.66 0 01-.73-.53c-.29-.69-.81-1.39-.45-2.09a12.24 12.24 0 01.92-2.07z"
        fill="#fbb8aa"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M46.56 52.88a1.25 1.25 0 01-.91.29c-.9-.06-1.29-.62-2 .25a2 2 0 00-.42 1c0 .08 0 1 .08 1-.26.09-.31-.38-.51-.57s-.66.07-.69.39a1.85 1.85 0 00.29.93 2.87 2.87 0 01.12 1.83c0 .15-.15.32-.29.28s-.23-.28-.33-.4a5 5 0 00-.46-.46c-.5-.44-1.35-.78-1.72-1.3a1.4 1.4 0 01-.23-.95c0-.08.26-.89.39-.81a1.17 1.17 0 01.14-2 2.35 2.35 0 011.19-2.67 4.84 4.84 0 013.08-.38 7.79 7.79 0 013.26 1.16 2.56 2.56 0 01.84.83 1.26 1.26 0 01.1 1.15.38.38 0 01-.36-.18.72.72 0 01-.65.77.68.68 0 01-.7-.4.89.89 0 01-.22.24z"
        fill="#473f47"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M45.56 58.49h-.17a.2.2 0 00-.13 0 .24.24 0 000 .14 10.18 10.18 0 000 1.83 2.45 2.45 0 01-1.69-2.6 10 10 0 002.07.61z"
        fill="#dc9e93"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M63.21 69.59a12.87 12.87 0 01-3.15 3.14 6.3 6.3 0 01-3 1.06 1 1 0 01-.42-.05 1 1 0 01-.57-.39 3.3 3.3 0 01-.76-1.87c-.07-1.8 1.88-2.85 1.88-2.85s4.44-1.41 5-1.18c.29.12.57.75.76 1.29s.26.85.26.85z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M63.21 69.59a12.87 12.87 0 01-3.15 3.14 6.3 6.3 0 01-3 1.06 1 1 0 01-.42-.05 1.06 1.06 0 01-.19.06c-1.35.27-3.11-.76-4.35-1.66l-1.48-.53-.42-4.19s3.56 3.32 5.11 4.06a4 4 0 002.38.44 2.7 2.7 0 00.63-.19 20.71 20.71 0 004.57-3 7.12 7.12 0 01.32.86z"
        fill="#020202"
        opacity="0.1"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M48.62 73.9l.38-3.79a.62.62 0 01.59-.57l5-.25a.64.64 0 01.66.61.48.48 0 010 .12l-1.31 8.63a.62.62 0 01-.54.53l-4.61.64a.64.64 0 01-.71-.55.57.57 0 010-.13z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M55.24 70l-1.3 8.63a.64.64 0 01-.54.53l-4.58.64a.63.63 0 01-.72-.54.76.76 0 010-.15l.56-5.24.34-3.76a.63.63 0 01.6-.56l5-.25a.63.63 0 01.65.55.37.37 0 01-.01.15z"
        fill="#fff"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M55.24 70l-1.3 8.63a.64.64 0 01-.54.53l-4.58.64a.38.38 0 010-.15l.55-5.23.37-3.8a.63.63 0 01.59-.57l4.89-.24a.31.31 0 01.02.19z"
        fill="url(#linear-gradient)"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M47.09 73.84a.81.81 0 01.7-.29 2.26 2.26 0 01.42.26.93.93 0 00.4.09 4 4 0 001.64-.23 2.13 2.13 0 01.85-.21 1.26 1.26 0 01.85.6 2.4 2.4 0 01.05 2.59 2.51 2.51 0 01-.85.77 5.29 5.29 0 01-2.42.61H46.2a1 1 0 01-.58-.07.9.9 0 01-.28-.74 2.5 2.5 0 01.23-1.71c.49-.61 1.03-1.09 1.52-1.67z"
        fill="#fbb8aa"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M37.83 63s-9.27 12.12-6.34 16.4 15.28-.71 15.28-.71l-1.2-3.54s-8.68 1.1-8.75.13 5.51-6.54 5.51-6.54 1-8.13-4.5-5.74z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path d="M56.49 55.48H119.9V101.6H56.49z" fill="#fff" />
      <path d="M61.05 94H116.71V96.19H61.05z" fill="#68e1fd" />
      <path d="M82.06 77.13H87.46000000000001V81.83999999999999H82.06z" fill="#68e1fd" opacity="0.41" />
      <path d="M76.7 73.47H82.10000000000001V81.83H76.7z" fill="#68e1fd" />
      <path d="M71.35 69.61H76.75V81.84H71.35z" fill="#68e1fd" opacity="0.5" />
      <path d="M65.99 65.85H71.39V81.83999999999999H65.99z" fill="#68e1fd" />
      <path d="M60.63 62.06H66.03V81.84H60.63z" fill="#68e1fd" />
      <path d="M60.63 62.06H66.03V81.84H60.63z" fill="url(#linear-gradient-2)" />
      <path
        d="M114.56 30.71a7.1 7.1 0 01-7.09 7.1H89.26a7.1 7.1 0 110-14.19h2.62a5.63 5.63 0 010-.58 6.52 6.52 0 0113-.23V23a5.63 5.63 0 010 .58h2.61a7.08 7.08 0 017.09 7.09z"
        fill="#68e1fd"
        opacity="0.31"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M112.36 30a7.1 7.1 0 01-7.09 7.1H87.05a7.1 7.1 0 010-14.19h2.62a5.63 5.63 0 010-.58 6.52 6.52 0 0113 0 5.63 5.63 0 010 .58h2.62a7.1 7.1 0 017.07 7.09z"
        fill="#fff"
        transform="translate(-7.29 -7.47)"
      />
      <path d="M88.19 29.66H89.55V35.67H88.19z" fill="#68e1fd" />
      <path
        d="M105.75 44.61L104.39 44.61 104.39 36.35 72.83 36.35 72.83 44.61 71.47 44.61 71.47 34.99 105.75 34.99 105.75 44.61z"
        fill="#68e1fd"
      />
      <path d="M88.19 35.67H89.55V44.620000000000005H88.19z" fill="#68e1fd" />
      <path d="M102.31 44.61H107.55V49.85H102.31z" fill="#68e1fd" />
      <path d="M86.25 44.61H91.49V49.85H86.25z" fill="#68e1fd" />
      <path d="M69.64 44.61H74.88V49.85H69.64z" fill="#68e1fd" />
      <path d="M61.05 85.82H116.71V88.00999999999999H61.05z" fill="#68e1fd" />
      <path d="M61.05 85.82H88.19V88.00999999999999H61.05z" fill="url(#linear-gradient-3)" />
      <path d="M67.55 93.92H94.69V96.11H67.55z" fill="url(#linear-gradient-4)" />
      <path d="M61.05 89.91H116.71V92.1H61.05z" fill="#68e1fd" />
      <path d="M63.13 89.91H98.88V92.1H63.13z" fill="url(#linear-gradient-5)" />
      <path
        d="M103.14 77.35a6.61 6.61 0 01.58-2.69l-4-2.18a11 11 0 005 14.75 11.49 11.49 0 002.19.8l.81-4.51a6.45 6.45 0 01-4.58-6.17z"
        fill="#68e1fd"
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M119.06 83a11 11 0 01-12.17 5l.81-4.51a6.44 6.44 0 007.3-2.66z"
        fill="#68e1fd"
        opacity="0.5"
        style={{ isolation: 'isolate' }}
        transform="translate(-7.29 -7.47)"
      />
      <path
        d="M120.62 77.35a11 11 0 01-1.56 5.65l-4-2.19a6.46 6.46 0 00-10.87-7 5.31 5.31 0 00-.44.81l-4-2.18a11 11 0 0120.92 4.87z"
        fill="url(#linear-gradient-6)"
        transform="translate(-7.29 -7.47)"
      />
    </svg>
  );
};

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
