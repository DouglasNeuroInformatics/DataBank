# libui

Generic UI components for DNP projects, built using React and Tailwind CSS (shadcn/ui-based).

**Status in DataBank:** used extensively in `web/` — the primary source of UI components, hooks, and theming for the frontend.

## When to reach for this

- Need a common UI primitive (button, dialog, table, form field, dropdown, etc.) — use a `libui` component instead of building one from scratch or adding another component library.
- Need a common frontend hook (debounced/throttled effects, media query, storage, translation, theme) — check `./hooks` before writing a new one.
- Need to merge Tailwind class names conditionally — use `cn()` from `./utils` instead of a custom classnames helper.

There is no root `.` export — always import from a subpath.

## Subpath exports

| Subpath                  | Purpose                            | Representative exports (not exhaustive — see hosted docs)                                                                                                                                                                         |
| ------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `./components`           | ~35 UI components                  | `Button`, `Card`, `Dialog`, `Form`, `DataTable`, `ServerDataTable`, `Table`, `Select`, `ComboBox`, `Tabs`, `Tooltip`, `DatePicker`, `FileDropzone`, `LanguageToggle`, `ThemeToggle`, `Heading`, `Separator`, `Badge`, `SearchBar` |
| `./hooks`                | ~13 hooks                          | `useTranslation`, `useTheme`, `useEventListener`, `useStorage`, `useMediaQuery`, `useDestructiveAction`, `useDownload`, `useInterval`, `useWindowSize`                                                                            |
| `./providers`            | App-level context providers        | `CoreProvider`                                                                                                                                                                                                                    |
| `./i18n`                 | Translator instance and i18n types | `i18n`                                                                                                                                                                                                                            |
| `./utils`                | Small helpers                      | `cn()` (class merging), `isBrowser()`                                                                                                                                                                                             |
| `./tailwind/globals.css` | Base Tailwind stylesheet           | imported once at the app root                                                                                                                                                                                                     |

Component docs are published via Storybook, not typedoc.

## Common patterns in this repo

Component import (`web/src/components/UserInfoCard.tsx`):

```tsx
import { Button } from '@douglasneuroinformatics/libui/components';
```

Global stylesheet import (`web/src/styles.css`):

```css
@import '@douglasneuroinformatics/libui/tailwind/globals.css';
```

Class merging via `cn()` — check `./utils` before conditionally joining Tailwind classes by hand.

## Docs

https://douglasneuroinformatics.github.io/libui (Storybook)
