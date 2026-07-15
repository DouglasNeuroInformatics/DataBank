# libui-form-types

Type declarations for a declarative form system (no runtime code — pure `.d.ts`).

**Status in DataBank: not a direct dependency — pulled in only transitively via `libui`.** Consider a direct dependency if you're authoring declarative form schemas rather than just consuming `libui`'s `Form` component.

## When to reach for this

- Defining a declarative form schema (field kinds, validation shape) that needs to type-check against `libui`'s `Form` component or a similar declarative form renderer — use these types instead of hand-writing ad hoc form field types.

## Key exports

Exported under a `FormTypes` namespace (`import FormTypes from '@douglasneuroinformatics/libui-form-types'` or named re-exports), including:

- Field kinds: `StaticFieldKind`, `ScalarFieldValue`, `StaticFormField`, `DynamicFormField`
- Field types: `StringFormField`, `NumberFormField`, `DateFormField`, `BooleanFormField`, `SetFormField`, `RecordArrayFormField`, `NumberRecordFormField`
- Aggregates: `FormFields`, `FormFieldsGroup`, `FormContent`, `FieldsetValue`
- Data shapes: `FormDataType`, `RequiredFormDataType`, `PartialFormDataType`, `BaseFormField`

This is illustrative, not exhaustive — see the source `.d.ts` for the complete namespace.

## Docs

https://douglasneuroinformatics.github.io/libui-form-types (also see `libui`'s `Form` component, which this package's types underpin — `.agents/docs/packages/libui.md`).
