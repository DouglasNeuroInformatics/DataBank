import { useTranslation } from 'react-i18next';

export interface ActivityCardProps {
  icon: React.ComponentType<Omit<React.SVGProps<SVGElement>, 'ref'>>;
  text: string;
  timestamp: number;
}

export const ActivityCard = (props: ActivityCardProps) => {
  const { i18n } = useTranslation();
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="border p-2 bg-slate-800 text-slate-100 rounded-full mr-2">
          <props.icon height={24} width={24} />
        </div>
        <h5>{props.text}</h5>
      </div>
      <span>{new Date(props.timestamp).toLocaleString(i18n.resolvedLanguage, { dateStyle: 'long' })}</span>
    </div>
  );
};
