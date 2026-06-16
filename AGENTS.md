You are working on a React + TypeScript + Tailwind CSS + DaisyUI educational web builder project.

Before modifying code, inspect the repository and create a refactoring Plan only. Do not start implementation yet.

Current context:
This project lets students build web pages using draggable blocks. Existing blocks include simple elements such as heading, paragraph, image, and structural/function blocks such as container, password zone, toggle zone, and grid zone.

The main issue is not the HtmlBlock data structure itself. The problem is that the code that creates, renders, edits, moves, drops, previews, and exports blocks is currently scattered or concentrated in large components.

Likely high-complexity files:
- BlockStudioPage.tsx
- BlockCanvas.tsx
- BlockPalette.tsx
- BlockRenderer.tsx
- BlockStylePanel.tsx, if present

Primary goal:
Refactor toward a blockDefinitions-driven architecture.

Core principle:
blockDefinitions must be declarative data only. They must not execute logic, render JSX, mutate state, or compile HTML directly.

Executors should read blockDefinitions and perform the actual work.

Target architecture:

blockDefinitions:
- Define each block type declaratively.
- Include:
  - type
  - label
  - category
  - template
  - palette metadata
  - childFields
  - editableFields
  - dropPolicy
  - dragPreview
  - htmlSchema or htmlExporterKey

Executors:
- blockFactory: clones definition.template and assigns new ids
- BlockPalette: renders palette items from blockDefinitions
- BlockCanvas: renders editable canvas using definitions
- BlockStylePanel: renders controls from editableFields
- blockDropEngine: handles drops using childFields/dropPolicy
- blockHtmlCompiler: exports HTML using htmlSchema/exporterKey
- DragPreviewOverlay: renders drag preview using dragPreview

Important constraint:
Do not immediately replace children/defaultChildren/conditionalChildren with a new slots model.
For now, keep the current data structure and introduce childFields as a declarative bridge.

Example childFields:
- children
- defaultChildren
- conditionalChildren

Future slots migration can be considered later, but should not be part of the first implementation Plan unless the current code absolutely requires it.

Recommended new structure:

src/
  blocks/
    definitions/
      heading.definition.ts
      paragraph.definition.ts
      image.definition.ts
      container.definition.ts
      gridZone.definition.ts
      passwordZone.definition.ts
      toggleZone.definition.ts
      index.ts

    types/
      blockDefinition.types.ts
      editableField.types.ts
      childField.types.ts
      htmlSchema.types.ts
      dropPolicy.types.ts

    factory/
      createBlockFromDefinition.ts
      assignBlockIdsDeep.ts

    tree/
      blockTreeOperations.ts
      blockChildFields.ts

    drop/
      dropTargetIds.ts
      resolveDropTarget.ts
      blockDropEngine.ts

    html/
      blockHtmlCompiler.ts
      htmlSchemaCompiler.ts
      interactiveExporters.ts
      escapeHtml.ts

  features/
    block-studio/
      hooks/
        useBlockStudio.ts
        useBlockDragAndDrop.ts
        useSelectedBlockEditor.ts
        useBlockMutations.ts

      components/
        BlockStudioLayout.tsx
        DragPreviewOverlay.tsx

  components/
    block/
      BlockPalette.tsx

      canvas/
        BlockCanvas.tsx
        CanvasRootDropZone.tsx
        CanvasBlockList.tsx
        CanvasBlockItem.tsx
        CanvasBlockBody.tsx
        CanvasBlockSlot.tsx
        BlockDragHandle.tsx
        BlockEditHandle.tsx
        BlockEditorPopover.tsx
        EditorConnectorLine.tsx

      preview/
        BlockRenderer.tsx
        PreviewBlockRenderer.tsx
        PasswordPreviewItem.tsx
        TogglePreviewItem.tsx
        QrExportPanel.tsx

      editor/
        BlockStylePanel.tsx
        EditableFieldControl.tsx

Expected responsibilities:

BlockStudioPage:
- Should become a page-level orchestrator only.
- It should connect DndContext, layout, palette, canvas, preview, and drag overlay.
- Move block creation, tree mutation, drop resolution, and drag state logic out.

BlockCanvas:
- Should become an editable canvas host.
- Split sortable block item, child drop zones, editor popover, connector line, and block body rendering into smaller components.
- It should use blockDefinitions.childFields to render container-like blocks where possible.

BlockPalette:
- Should render from blockDefinitions instead of hardcoded block lists.

BlockStylePanel:
- Should render controls from editableFields where possible.
- Use custom editor escape hatches only when needed.

BlockRenderer:
- Should separate preview rendering from HTML export and QR/export UI.

Factory:
- createBlockFromDefinition(type) should:
  1. Read blockDefinitions[type].template
  2. structuredClone it
  3. Assign new ids recursively
  4. Return a new HtmlBlock instance
- Adding a new block should not require changing blockFactory.

Drop:
- String drop target ids should be centralized.
- resolveDropTarget should parse ids.
- blockDropEngine should decide how to insert/move blocks.

Tree:
- find, update, remove, insert, replace operations should be pure functions.
- UI components should not manually recurse through block trees.

Plan requirements:
Create a detailed refactoring Plan before coding.

The Plan must include:
1. Current architecture summary after inspecting the repo
2. Main complexity problems found in actual files
3. Target architecture adapted to this repo
4. Phase-by-phase implementation order
5. Files to create
6. Files to modify
7. Types to introduce or change
8. Risk assessment
9. Regression test checklist
10. What should explicitly not be changed in the first phase

Preferred implementation phases:
Phase 0: Inspect current repo and verify build/typecheck.
Phase 1: Introduce blockDefinitions, templates, and generic blockFactory.
Phase 2: Extract tree operations and drop resolution/engine.
Phase 3: Simplify BlockStudioPage into an orchestrator.
Phase 4: Split BlockCanvas into smaller SRP-based components.
Phase 5: Convert BlockPalette and BlockStylePanel to definition-driven behavior.
Phase 6: Separate preview rendering from HTML export in BlockRenderer.
Phase 7: Consider future improvements such as slots, runtime validation, versioning, and migration.

Non-goals for first implementation:
- Do not rewrite the entire HtmlBlock model unless unavoidable.
- Do not migrate to slots immediately.
- Do not put JSX, mutation logic, or HTML compiler functions directly inside blockDefinitions.
- Do not change visible behavior unless required by the refactor.
- Do not start coding before producing the Plan.

Refactoring strength guidance:
This should be a real architecture refactor, not a minimal cleanup.

Prioritize the target architecture over preserving old implementation details. You may remove, replace, or substantially rewrite existing code when it clearly serves the blockDefinitions-driven architecture.

Do not keep obsolete code paths or duplicate systems just to reduce diff size.

At the same time, keep the work reviewable and phase-based. Each phase should aim to end in a buildable and type-safe state. If a temporary broken state is unavoidable, explicitly document:
- what is broken,
- why it is temporarily acceptable,
- which following step will fix it.

Do not water down the refactor into superficial extraction only. If the current structure conflicts with the target architecture, propose a real replacement plan.

Repository scope warning:
This repository is not only the Block Coding Studio. It is a collection of multiple small projects/features, and Block Coding Studio is one new large feature added to it.

Therefore, do not reorganize the entire repository to match the proposed Block Studio architecture.

The new blocks/, features/block-studio/, and components/block/ structure should be applied only to Block Studio-related code.

Before creating the Plan, inspect the repo and determine the actual scope of Block Studio. The Plan must clearly separate:
- Block Studio files to refactor
- shared files that require minimal changes
- unrelated mini-project files that must not be touched

Do not move or rewrite unrelated project pages, routes, layouts, components, or utilities.

Avoid broad import path churn across the whole app. Prefer creating new Block Studio-specific folders and migrating only directly related files.

If a shared file must be changed, explain why and keep the change minimal.

Treat this as a feature-scoped refactor, not an app-wide architecture migration.