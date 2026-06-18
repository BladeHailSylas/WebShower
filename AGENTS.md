# AGENTS.md

You are working on a React + TypeScript + Tailwind CSS + DaisyUI educational web builder project.

This repository contains multiple small projects/features. Block Studio is one feature inside the repository, not the whole application.

When working on Block Studio:

* Scope changes to Block Studio-related files only.
* Do not reorganize the entire repository.
* Do not modify unrelated mini-projects, routes, layouts, pages, or shared utilities unless the task explicitly requires it.
* If a shared file must change, explain why and keep the change minimal.
* Prefer scalable and maintainable changes over quick local patches when the task is architectural.
* Prefer small, reviewable phases over broad rewrites.

## Product Direction

Block Studio is an educational web builder, not a general-purpose no-code platform.

The main goal is:

* Students build web pages with draggable blocks.
* Students understand how block structure becomes real HTML/CSS.
* Preview, Code View, and export should reinforce the connection between blocks and web code.
* The editing experience should be beginner-friendly, visually clear, and predictable.

Prefer features that improve:

* block manipulation clarity,
* visible cause-and-effect between edits and rendered output,
* transparency between blocks, preview, Code View, and exported HTML,
* beginner-friendly web programming concepts.

Avoid expanding Block Studio into a broad no-code editor unless the feature clearly supports the educational web-building goal.

## Current Architecture Direction

The desired direction is a `blockDefinitions`-driven architecture.

Adding a new block should require changing as few executor/UI files as reasonably possible.

Preferred flow:

```text
blockDefinitions
→ factory
→ canvas renderers
→ editor controls
→ drop engine/tree operations
→ preview renderer
→ HTML compiler/export
→ Code View
```

The main architectural problem is not the `HtmlBlock` model itself. The problem is scattered logic across large UI components.

Likely complexity areas:

* `BlockStudioPage`
* `BlockCanvas`
* canvas block item/body/slot components
* `BlockPalette`
* `BlockStylePanel`
* preview/code/export components
* HTML compiler/export files
* drag/drop hooks and tree mutation helpers

## Block Definitions Principle

`blockDefinitions` must remain declarative data.

Definitions may include:

* type,
* label,
* category,
* template,
* palette metadata,
* childFields,
* editableFields,
* dropPolicy,
* dragPreview,
* htmlSchema,
* htmlExporterKey.

Definitions must not:

* render JSX,
* mutate state,
* contain React components,
* execute drag/drop logic,
* compile HTML directly,
* contain custom compiler functions,
* perform tree mutation.

Executors should read definitions and perform the work.

Expected executors include:

* `blockFactory`
* `BlockPalette`
* `BlockCanvas`
* `BlockStylePanel`
* `blockDropEngine`
* tree operation helpers
* `blockHtmlCompiler`
* `DragPreviewOverlay`
* Code View display components

## Data Model Constraint

Do not replace the existing `HtmlBlock` model unless explicitly requested.

For now:

* Keep `children`, `defaultChildren`, and `conditionalChildren`.
* Use `childFields` as a declarative bridge over the existing fields.
* Do not migrate to a slots model as part of ordinary feature work.
* Treat any future slots migration as a separate architectural project.

## Recommended Feature Structure

Prefer feature-scoped files under Block Studio-related folders.

A reasonable target structure may include:

```text
src/
  features/
    block-studio/
      blocks/
        definitions/
        types/
        factory/
        tree/
        drop/
        html/
        layout/
      hooks/
      components/

  components/
    block/
      canvas/
      preview/
      editor/
```

The exact structure should follow the current repository where practical. Avoid unnecessary path churn.

## Code View Principles

Code View is an educational transparency feature.

Code View must not introduce a second HTML generation system.

Code View should:

* reuse the existing HTML compiler/export path,
* show read-only HTML generated from the current `HtmlBlock[]`,
* default to body fragment output unless full document output is explicitly requested,
* remain separate from `PreviewBlockRenderer`,
* avoid block-type-specific HTML generation inside UI components.

Allowed:

* a thin adapter such as `compileBlocksForCodeView(blocks)` that calls `compileBlockHtml`,
* display-only formatting helpers that do not change HTML meaning,
* copy-to-clipboard UI,
* empty-state guidance.

Forbidden:

* Code View-specific generators for H1/P/IMAGE/A/GRID_ZONE/etc.,
* rebuilding HTML from React preview JSX,
* reimplementing escaping, class transformation, or style serialization in Code View,
* HTML-to-block reverse parsing,
* editable code editor behavior unless explicitly requested later,
* large editor dependencies for the prototype phase.

The compiler/export path should remain the source of truth:

* `compileBlockHtml` for block fragments,
* `compilePageHtml` for full export documents,
* `htmlSchema` for schema-driven blocks,
* `htmlExporterKey` for custom interactive exporters.

## GRID_ZONE Principles

`GRID_ZONE` is a grid layout container over its direct children.

Current model:

* `GRID_ZONE.children` is the only child storage.
* Each direct child of `GRID_ZONE.children` is a grid item.
* `styles.gridCols` controls the visual column count.
* CSS grid auto-placement handles visual layout.
* The current model does not have per-column child arrays.

Do not introduce for `GRID_ZONE` unless explicitly requested:

* `columns`,
* `gridChildren`,
* 2D child arrays,
* slots migration,
* per-column drop targets,
* `GRID_DROPPER`.

A future `GRID_DROPPER` may be considered later, but it is not part of the current model. If introduced later, it should still be treated as a direct child/grid item of `GRID_ZONE`, not as a reason to convert `GRID_ZONE` into a column-owning data model.

`GRID_ZONE` should remain responsible only for laying out its direct children as grid items.

### GRID_ZONE style handling

It is acceptable for `GRID_ZONE` grid layout style to be handled by canvas, preview, and export/compiler paths while the rule remains small and stable.

If new grid style options are added, such as grid gap, consider a small feature-local layout helper before duplicating the new rule across paths.

Such a helper, if introduced, should only:

* compute equivalent grid layout style for canvas/preview,
* serialize equivalent grid layout style for export,
* centralize fallback values,
* keep canvas/preview/export parity.

It must not handle:

* child distribution,
* column-specific state,
* drop policy,
* DnD behavior,
* `GRID_DROPPER`,
* migration policy.

Do not put layout execution logic into block definitions.

## Canvas Editing UX Principles

Canvas editing should make block manipulation obvious and safe.

Separate responsibilities:

* `BlockDragHandle` starts drag.
* `BlockEditHandle` opens or focuses editing controls.
* Inline inputs, if introduced, edit content and must not start drag.
* DnD listeners from dnd-kit must not be overwritten by local pointer handlers.

When adding pointer or mouse handlers:

* do not accidentally override dnd-kit activator listeners,
* prefer drag handles as the primary drag activator,
* avoid making the entire block body draggable if inline inputs are present,
* prevent edit/input interactions from bubbling only when it does not block drag activators.

Canvas UI should clearly communicate:

* selected state,
* hover state,
* draggable affordance,
* edit affordance,
* nested drop zones,
* content-editable areas.

UI polish should not break DnD, selection, editing, preview, Code View, or export behavior.

## Content Editing Direction

Content editing is a core feature of the educational builder.

Preferred direction:

* visible content should be editable close to where it appears,
* technical attributes should remain editable in the StylePanel or inspector-like UI,
* both inline editing and StylePanel editing must update the same `HtmlBlock` data path.

Examples:

* H1/P visible text: good candidates for inline input.
* Link display text: possible inline input candidate.
* Image `src`/`alt`: better suited for StylePanel.
* Password answer, toggle behavior, grid columns: StylePanel controls.
* Styling values: StylePanel controls.

Do not:

* create separate editing state that diverges from `HtmlBlock`,
* make Code View or export depend on separate UI state,
* create block-type-specific editing systems when an `editableFields`-driven approach can reasonably support the feature,
* let inline inputs interfere with DnD activators.

Recommended first steps for content editing work:

1. Diagnose why content editing disappeared.
2. Restore StylePanel content editing if the current `editableFields` structure supports it.
3. Consider inline input prototypes only for simple visible text blocks such as H1/P.
4. Validate DnD, selection, focus, preview, Code View, and export after content edits.

## Style Editing Principles

Common block styles should generally flow through:

* `editableFields`,
* `StyleProps`,
* style transformers such as `transformGuiToTailwind`,
* preview/export/compiler paths.

Canvas may use editor-specific shell styles that differ from preview/export. This is acceptable when the difference clearly supports editing affordance.

When adding a style option:

* decide whether it is a common style or block-specific layout style,
* avoid duplicating the same rule across canvas/preview/export if the rule is expected to grow,
* keep Code View tied to export/compiler output.

`transformGuiToTailwind` is appropriate for class-style transformations.

It may not be appropriate for layout rules that need:

* React `CSSProperties` in canvas/preview,
* serialized inline CSS in HTML export.

For such layout rules, a feature-local helper may be more appropriate.

## Drag and Drop Expectations

DnD behavior is core functionality.

Always preserve:

* dragging from palette to canvas,
* moving existing root blocks,
* moving nested blocks,
* reordering nested blocks,
* moving blocks in/out of container-like blocks,
* drag handle behavior,
* edit handle behavior.

Do not override dnd-kit listeners with local `onPointerDown` handlers.

If propagation must be stopped for edit/input controls, compose handlers carefully and verify that drag activators still work.

Drop logic should be centralized where possible:

* drop target id creation/parsing,
* drop target resolution,
* insert/move behavior,
* pure tree mutation helpers.

UI components should not own complex recursive tree mutation logic.

## Implementation Guidance

For complex work, create a plan before coding.

The plan should include:

1. Current architecture summary after inspecting the repo.
2. Main complexity problems found in actual files.
3. Target architecture adapted to the repo.
4. Phase-by-phase implementation order.
5. Files to create.
6. Files to modify.
7. Types to introduce or change.
8. Risk assessment.
9. Regression checklist.
10. What should explicitly not be changed.

For smaller work, still identify:

* scope,
* touched files,
* expected behavior,
* validation steps.

Prefer phase-based implementation:

* one phase should have one clear purpose,
* each phase should be reviewable,
* each phase should end in a buildable/type-safe state when possible.

If a temporary broken state is unavoidable, explicitly document:

* what is broken,
* why it is temporarily acceptable,
* which following step will fix it.

## Non-goals Unless Explicitly Requested

Do not:

* rewrite the entire `HtmlBlock` model,
* migrate to slots,
* introduce per-column child arrays for `GRID_ZONE`,
* introduce `GRID_DROPPER`,
* put JSX or compiler functions in `blockDefinitions`,
* create a separate Code View compiler,
* reimplement escaping or style transformation inside UI display components,
* reorganize unrelated repository areas,
* change visible behavior unrelated to the current task,
* add large dependencies for prototype features.

## Validation Expectations

For Block Studio changes, prefer focused validation when full app lint/build is blocked by unrelated mini-project issues.

Always report:

* commands run,
* whether failures are related or unrelated,
* changed-file lint/typecheck result if full lint is blocked,
* manual regression checklist.

Preferred validation commands when available:

* `npx.cmd tsc --noEmit`
* `npm.cmd run build`
* changed-file ESLint command if full lint is blocked
* full lint when unrelated errors do not block validation

If full build/lint fails because of unrelated existing errors, explicitly separate:

* related failures,
* unrelated known failures,
* changed-file validation results.

## Manual Regression Checklist

Use the relevant subset for each task.

### DnD and Canvas

* Add block from palette to root canvas.
* Move existing root block.
* Move nested block into container-like block.
* Move nested block back to root.
* Reorder nested blocks.
* Drag handle works.
* Edit handle works.
* Input/edit controls do not start drag.
* Root empty area click/deselect behavior still works.
* Selected state remains clear.
* Nested drop zones remain usable.

### StylePanel and Content Editing

* Select a block and edit style values.
* Edit visible content if supported.
* Edit technical attributes such as image src/alt or link href if supported.
* Confirm preview updates.
* Confirm Code View updates.
* Confirm export HTML updates.
* Confirm the edited value is stored in `HtmlBlock`, not separate UI state.

### GRID_ZONE

* Add `GRID_ZONE` to root canvas.
* Move `GRID_ZONE` itself.
* Add blocks into `GRID_ZONE`.
* Move blocks out of `GRID_ZONE`.
* Reorder blocks inside `GRID_ZONE`.
* Change `gridCols` 2 → 3 → 4 → 2.
* Confirm children are preserved.
* Confirm canvas, preview, Code View, and export reflect the same grid columns.
* Confirm no `columns`, `gridChildren`, slots, per-column drop targets, or `GRID_DROPPER` were introduced unless explicitly requested.

### Code View

* Empty canvas shows an empty-state message.
* H1/P content appears as escaped HTML.
* Image src/alt appears correctly.
* Link href/text appears correctly.
* Container children appear recursively.
* GRID_ZONE export contains grid inline style.
* Password/toggle zones use existing exporter output.
* Copy button copies current code.
* Code View does not contain block-type-specific generation logic.
* QR/export still uses `compilePageHtml`.

### Export

* Exported full HTML opens as a working HTML page.
* Tailwind classes or CDN setup still work as expected.
* Interactive blocks still work after export.
* Code View fragment and export document remain meaningfully consistent.
