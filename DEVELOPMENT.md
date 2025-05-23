# Development Guide

## Core Principles

1. **Keep It Simple**
   - Expand src/index.ts as needed - avoid complex directory structures
   - Focus on core functionality first
   - Use built-in Node.js features when possible
   - Check N8N_API.yml for correct endpoints/methods

2. **Document Only What Works**
   - No *public* "roadmap" or planned features
   - Only document implemented functionality
   - Keep documentation clear and focused

3. **JSON Requirements**
   - All tool arguments must be compact, single-line JSON
   - Example: `{"clientId":"abc123","id":"workflow123"}`

4. **Workflow Creation**
   - Include nodes and connections arrays (even if empty)
   - 'active' property is read-only
   ```json
   {
     "clientId": "abc123",
     "name": "My Workflow",
     "nodes": [],
     "connections": {}
   }
   ```

5. **Enterprise Features**
   - Project/variable management require Enterprise license
   - Base workflow features work without license
   - Clear error messages for license requirements

## What Not To Do

1. **No Overcomplication**
   - Don't create complex directory structures
   - Don't add unnecessary dependencies
   - Use built-in fetch instead of importing it
   - Check if functionality exists before adding imports

2. **No Speculative Documentation**
   - Don't document unimplemented features
   - Don't maintain *public* planning documents
   - Don't commit planning docs as implementation

3. **No Feature Creep**
   - Add features only when fully designed
   - Follow github repo's simple approach
   - Focus on core functionality first

4. **No Roadmaps**
   - Document only what exists
   - Keep focus on current functionality
   - Clear, concise documentation

## Credential Mapping GUI (Electron App)

- The Electron app for credential mapping is located in `src/credential-mapping-app/`.
- It is designed for use only within this MCP repository and is not a standalone product.
- To run the app in development mode:
  1. Install dependencies: `npm install` (from the repo root)
  2. Start the app: `npm run credential-mapping-app`
- The app provides a GUI for viewing, editing, and deleting entries in `credentials-map.json` (mappings) and managing types in `credential-types.json`. Both files are always in the same folder as the Electron app (.exe) and the server. All must be together for correct operation.
  - **credentials-map.json**: Only actual mappings (type → {id, name})
  - **credential-types.json**: Master list of types and enabled/disabled state
- See the main README for user instructions and workflow integration.

### UI/UX Notes
- The credential mapping table is scrollable for large lists.
- The refresh (⟳) and settings (⚙) buttons are now icons in the top right corner.
- The bookmarklet/script copy is now a small 'Script' button in the bottom right, replacing the old input/label.
- The script button is unobtrusive and always available for quick copying.
- All UI actions provide toast notifications for feedback.
