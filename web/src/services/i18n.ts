import { i18n } from '@douglasneuroinformatics/libui/i18n';

import common from '../translations/common.json';

i18n.setDefaultNamespace('common');
i18n.addPreInitTranslations({ common });

await i18n.init();

export default i18n;
