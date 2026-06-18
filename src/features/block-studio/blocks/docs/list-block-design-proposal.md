# LIST Block Design Proposal

## 1. Educational Value

LIST is useful in Block Studio because students often need ordered steps, unordered summaries, feature lists, materials, links, and project checklists when building static pages. It pairs naturally with existing H1/P/IMAGE/CARD/HR/CONTAINER blocks: a heading introduces the section, HR separates sections, CARD groups a list with supporting content, and CONTAINER controls broader layout.

From an HTML education perspective, LIST is valuable because it makes the relationship between visual structure and semantic HTML concrete:

- `ul` means an unordered group of related items.
- `ol` means an ordered sequence.
- `li` represents one item inside the list.
- Nested block structure should visibly become nested HTML structure in Code View and export.

## 2. Data Model Options

### Option A: LIST block + LIST_ITEM internal block

```text
LIST
└─ LIST_ITEM
   └─ content or child blocks
```

- Data model: add `LIST` and internal `LIST_ITEM` block types.
- Canvas UX: students can see that a list owns list items, and list items are distinct structural pieces.
- StylePanel UX: LIST can edit `ul`/`ol`; LIST_ITEM can edit item text or child content.
- Preview/export/code: maps cleanly to `<ul><li>...</li></ul>` or `<ol><li>...</li></ol>`.
- DnD fit: good if LIST only accepts LIST_ITEM and LIST_ITEM accepts simple content or child blocks.
- Definition-driven fit: strong, but requires drop policies that restrict parent/child relationships more carefully than current broad child fields.
- Implementation size: medium.
- Educational value: high, because the block tree mirrors HTML semantics.
- Risks: more moving parts, an internal block, item add/delete UX, and stricter DnD rules are needed.

### Option B: LIST block with `items: string[]`

```ts
items: string[]
```

- Data model: LIST stores plain item text in a new array field.
- Canvas UX: easy to render but less consistent with existing block tree behavior.
- StylePanel UX: item editing can live in an array editor.
- Preview/export/code: straightforward for text-only `<li>` output.
- DnD fit: weak, because individual list items are not blocks.
- Definition-driven fit: weaker, because `items` needs new editable field behavior and compiler schema support.
- Implementation size: medium.
- Educational value: medium, focused on list syntax but not block-to-HTML structure.
- Risks: introduces a new non-block child model and a custom editor path.

### Option C: LIST block allows P or general blocks as children

```text
LIST
├─ P
├─ P
└─ A
```

- Data model: LIST uses existing `children`.
- Canvas UX: simple because students already drag blocks into containers.
- StylePanel UX: LIST edits list type; child blocks use existing editors.
- Preview/export/code: compiler must wrap each direct child in `<li>`.
- DnD fit: good with the existing child field model.
- Definition-driven fit: fair, but export needs a list-specific wrapper behavior.
- Implementation size: low to medium.
- Educational value: medium, because students see child blocks become list items, but the tree does not explicitly show `li`.
- Risks: a child `P` becomes `<li><p>...</p></li>`, which is valid but may surprise beginners expecting the P itself to become the item text.

### Option D: textarea-based multi-line input

```text
StylePanel textarea
each line -> li
```

- Data model: LIST stores one text field and splits lines for output.
- Canvas UX: easiest initial authoring, but list items are not draggable blocks.
- StylePanel UX: simple multi-line editing.
- Preview/export/code: straightforward for text-only lists.
- DnD fit: not applicable for items.
- Definition-driven fit: weak unless textarea controls and line splitting become supported common concepts.
- Implementation size: low.
- Educational value: medium for HTML output, low for block structure.
- Risks: creates a special editing system and does not teach nested block manipulation.

## 3. `ul` / `ol` Choice

The first implementation should use one `LIST` block with a semantic `listKind` or similar field rather than separate `UL` and `OL` block types. `ul` and `ol` are semantic output choices for the same educational concept: a list of items. Keeping them as one block avoids duplicating palette entries, renderers, compiler behavior, and docs.

This should not be modeled as a visual-only style field if the exported tag changes. The field should represent semantic list kind and drive Preview, Code View, and export consistently.

## 4. Item Add/Delete UX

Possible UX paths:

- StylePanel array editing: predictable for text-only lists, but weaker for block-based learning.
- Canvas item controls: direct and beginner-friendly, but needs careful DnD and focus handling.
- LIST_ITEM from palette: explicit, but clutters the palette and can be dropped in invalid places unless drop rules improve.
- LIST-only item insertion button: likely best for Option A, because students add items in context.
- P-as-item behavior: fastest to implement with existing DnD, but less explicit semantically.

## 5. Recommendation

Recommended direction: Option A, `LIST` + internal `LIST_ITEM`, in a later dedicated phase.

Initial scope for that future phase:

- Add `LIST` as a public block and `LIST_ITEM` as an internal block.
- Store items through existing child fields, not a separate array.
- Let `LIST` choose unordered or ordered output through one semantic field.
- Provide an in-context "add item" control instead of exposing LIST_ITEM in the palette.
- Compile through the existing HTML compiler path, not a Code View-specific generator.

Future expansion:

- Allow simple inline text editing for LIST_ITEM after the base block is stable.
- Consider nested blocks inside LIST_ITEM only after DnD restrictions are reliable.
- Add ordered-list start values or marker styling later if they support the lesson.

Do not include in the first LIST implementation:

- A second Code View compiler.
- A slots migration.
- LIST_ITEM as a normal palette block.
- Arbitrary item arrays that bypass `HtmlBlock`.
- Complex nested list behavior before basic DnD is proven.

Regression checklist for a future LIST implementation:

- Add LIST to root canvas.
- Add, delete, and reorder LIST_ITEM entries.
- Switch unordered and ordered output.
- Confirm Preview, Code View, and export use matching `ul`/`ol` and `li`.
- Confirm LIST_ITEM cannot be dropped into invalid parents.
- Confirm existing H1/P/IMAGE/A/CARD/HR/CONTAINER behavior remains unchanged.
