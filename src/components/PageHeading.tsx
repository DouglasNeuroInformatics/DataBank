import React from 'react';

interface PageHeadingProps {
  text: string;
}

export const PageHeading = ({ text }: PageHeadingProps) => (
  <h1 className="text-center text-3xl font-medium my-5">{text}</h1>
);
