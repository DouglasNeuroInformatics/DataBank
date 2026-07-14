import { useState } from 'react';

import { Badge, Button, Checkbox, SearchBar } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';
import { XIcon } from 'lucide-react';

export type PrimaryKeySelectorProps = {
  columns: string[];
  onChange: (primaryKeys: string[]) => void;
  value: string[];
};

export const PrimaryKeySelector = ({ columns, onChange, value }: PrimaryKeySelectorProps) => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColumns = columns.filter((column) => column.toLowerCase().includes(searchTerm.toLowerCase().trim()));

  const toggleColumn = (column: string) => {
    onChange(value.includes(column) ? value.filter((key) => key !== column) : [...value, column]);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">{t({ en: 'Primary Keys', fr: 'Clés primaires' })}</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t({
            en: 'Optionally select the columns that uniquely identify each row. If none are selected, an ID will be generated automatically.',
            fr: 'Sélectionnez éventuellement les colonnes qui identifient de manière unique chaque ligne. Si aucune n’est sélectionnée, un identifiant sera généré automatiquement.'
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder={t({ en: 'Search columns...', fr: 'Rechercher les colonnes...' })}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
        </div>
        <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {value.length} {t({ en: 'of', fr: 'de' })} {columns.length} {t({ en: 'selected', fr: 'sélectionné' })}
        </p>
        {value.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>
            {t({ en: 'Clear', fr: 'Effacer' })}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="max-h-64 overflow-y-auto">
          {filteredColumns.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              {t({ en: 'No columns found.', fr: 'Aucune colonne trouvée.' })}
            </p>
          ) : (
            filteredColumns.map((column) => {
              const isSelected = value.includes(column);
              return (
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 border-b px-4 py-2.5 transition-colors last:border-b-0',
                    isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                  key={column}
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleColumn(column)} />
                  <span className="font-mono text-sm">{column}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((key) => (
            <Badge className="gap-1 font-mono" key={key} variant="secondary">
              {key}
              <button
                aria-label={t({ en: 'Remove primary key', fr: 'Supprimer la clé primaire' })}
                className="hover:text-foreground text-muted-foreground"
                type="button"
                onClick={() => toggleColumn(key)}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
