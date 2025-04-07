import { CircleCheckIcon } from 'lucide-react';

type InfoGroupProps = {
  description?: string;
  items: {
    description: string;
    label: string;
  }[];
  title: string;
};

export const InfoGroup = ({ description, items, title }: InfoGroupProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold leading-tight tracking-tight md:text-xl xl:text-2xl">{title}</h3>
        {description && <span className="text-muted-foreground text-sm">{description}</span>}
      </div>
      <ul className="space-y-5">
        {items.map((item) => (
          <li className="flex" key={item.label}>
            <div className="flex h-full w-10 flex-shrink-0 flex-col [&>svg]:h-8 [&>svg]:w-8 [&>svg]:fill-green-600 [&>svg]:stroke-white">
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
