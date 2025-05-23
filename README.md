# Enhanced n8n MCP Server

An advanced MCP server that provides comprehensive access to n8n workflows, executions, credentials, and enterprise features through the Model Context Protocol. This enhanced version enables AI assistants and Large Language Models (LLMs) to interact with n8n instances programmatically with extensive automation capabilities.

## 🤖 For AI Assistants Working on This Project

**If you're an AI assistant enhancing this MCP server:**
- **READ** [`docs/technical-guide.md`](./docs/technical-guide.md) **FIRST** - Contains validated patterns and solutions
- **REFERENCE** [`docs/capabilities.md`](./docs/capabilities.md) for strategic planning and capability overview
- **UPDATE both documents** when you add new features or solve problems
- **FOLLOW documented patterns** to avoid repeating solved issues

See: [Technical Guide](./docs/technical-guide.md) | [Capabilities Overview](./docs/capabilities.md)

---

## Features

### ✅ Core Features (Fully Implemented)
- **Workflow Management**: Complete CRUD operations for workflows
- **Execution Monitoring**: View, analyze, and manage workflow executions
- **Basic Credential Operations**: Create and delete credentials programmatically
- **Tag Management**: Organize workflows with comprehensive tagging system
- **Security Auditing**: Generate detailed security analysis reports
- **User Management**: Full user administration capabilities

### ⚠️ Partial Features (Limited Implementation)
- **Credential Management**: Can create/delete credentials, but **credential assignment to nodes requires manual configuration in n8n UI**
- **Automation Pipeline**: Visual/text-to-workflow creation works, but blocked by credential assignment step

### ✅ Enterprise Features (License Required)
- **Project Management**: Organize workflows by projects
- **Variable Management**: Global variable system for cross-workflow data sharing
- **Advanced User Management**: Enhanced permissions and role management

### 📋 Planned Enhancements
- **Automatic Credential Assignment**: Programmatic assignment of credentials to workflow nodes
- **Credential Discovery**: List and filter existing credentials
- **Workflow Templates**: Standardized workflow patterns
- **Advanced Error Handling**: Automated recovery mechanisms

---

## Supported AI Platforms

### Primary: Claude Desktop
- **Multimodal Support**: ✅ Screenshot analysis and workflow generation
- **MCP Integration**: ✅ Native protocol support
- **Setup Complexity**: Low
- **Documentation**: Complete

### Secondary: Other MCP Clients
- **Cline (VS Code)**: ✅ Full MCP support, text-based workflow generation
- **Continue**: ✅ Basic MCP support
- **Custom MCP Clients**: ✅ Any client implementing MCP protocol

### AI Model Compatibility
- **Claude Models**: Native support via Claude Desktop
- **GPT Models**: Compatible via supported MCP clients
- **Gemini**: Compatible via supported MCP clients
- **Local Models**: Compatible with open-source MCP clients

---

## Installation & Development Setup

### Local Development (Current Approach)

1. **Clone the enhanced repository:**
   ```bash
   git clone https://github.com/AIssistedDevelopment/advanced-n8n-mcp-server.git
   cd advanced-n8n-mcp-server
   ```

2. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Get your n8n API Key:**
   - Log into your n8n instance
   - Click your user icon in the bottom left
   - Go to Settings → API
   - Click "Create API Key"
   - Copy your API key (you won't be able to see it again)

### Alternative: npm Installation

For basic functionality (without latest enhancements):
```bash
npm install -g advanced-n8n-mcp-server
```

Note: The npm version may not include the latest credential management enhancements.

---

## Configuration

### Claude Desktop Configuration

1. **Open Claude Desktop configuration:**
   ```bash
   # macOS
   ~/Library/Application Support/Claude/claude_desktop_config.json
   
   # Windows
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Add the enhanced n8n configuration:**
   ```json
   {
     "mcpServers": {
       "n8n-advanced": {
         "command": "node",
         "args": ["path/to/advanced-n8n-mcp-server/build/index.js"],
         "env": {
           "N8N_API_URL": "http://localhost:5678/api/v1",
           "N8N_API_KEY": "your-api-key-here",
           "N8N_WEBHOOK_USERNAME": "admin",
           "N8N_WEBHOOK_PASSWORD": "password123"
         }
       }
     }
   }
   ```

### Other MCP Clients

#### Cline (VS Code)
```json
{
  "mcpServers": {
    "n8n-advanced": {
      "command": "node",
      "args": ["path/to/advanced-n8n-mcp-server/build/index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "your-api-key-here",
        "N8N_WEBHOOK_USERNAME": "admin",
        "N8N_WEBHOOK_PASSWORD": "password123"
      }
    }
  }
}
```

#### Continue
```json
{
  "mcpServers": {
    "n8n-advanced": {
      "command": "node",
      "args": ["path/to/advanced-n8n-mcp-server/build/index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "your-api-key-here",
        "N8N_WEBHOOK_USERNAME": "admin",
        "N8N_WEBHOOK_PASSWORD": "password123"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `N8N_API_URL` | ✅ | Full API endpoint URL | `http://localhost:5678/api/v1` |
| `N8N_API_KEY` | ✅ | Your n8n API key | `eyJhbGciOiJIUzI1NiIs...` |
| `N8N_WEBHOOK_USERNAME` | ✅ | Webhook authentication username | `admin` |
| `N8N_WEBHOOK_PASSWORD` | ✅ | Webhook authentication password | `password123` |

---

## Validation & Testing

### Basic Functionality Test
After configuration:
1. **Restart your MCP client** (Claude Desktop, Cline, etc.)
2. **Test connection**: Ask your AI assistant "List my n8n workflows"
3. **Verify response**: You should see your workflows listed

### Advanced Functionality Test
1. **Test credential creation**: "Create a test OpenAI credential"
2. **Test workflow creation**: "Create a simple webhook workflow"
3. **Note limitation**: Manual credential assignment required in n8n UI

### Expected Workflow
```
User Input → AI Analysis → Workflow Creation → Manual Credential Assignment → Activation
                                                          ↑
                                                Current limitation
```

---

## Automation Capabilities by AI Assistant

### Visual-to-Workflow (Multimodal AIs)
**Supported by**: AI assistants with vision capabilities
```
Screenshot → Visual Analysis → Workflow Plan → n8n Creation → Manual Credentials → Deploy
```

### Text-to-Workflow (All AIs)
**Supported by**: All AI assistants with MCP access
```
Description → Analysis → Workflow Plan → n8n Creation → Manual Credentials → Deploy
```

### Code-to-Workflow (Developer-focused)
**Supported by**: All programming-capable AI assistants
```
Requirements → Code Generation → Workflow JSON → MCP Deploy → Manual Credentials → Activate
```

---

## Current Limitations & Workarounds

### Credential Assignment Gap
**Issue**: Cannot programmatically assign credentials to workflow nodes  
**Impact**: Manual step required in n8n UI after workflow creation  
**Workaround**:
1. AI assistant creates workflow structure via MCP
2. Open workflow in n8n UI
3. Manually assign credentials to each node requiring authentication
4. Activate workflow

### Missing Functions
The following functions are documented but not yet implemented:
- `list-credentials` - Discover existing credentials
- `assign-credential-to-node` - Programmatic credential assignment
- `get-credential` - Retrieve credential details
- `list-credentials-by-type` - Filter credentials by type

---

## Documentation

### For Strategic Planning
- **[Capabilities Overview](./docs/capabilities.md)** - Comprehensive capability matrix, integration patterns, and strategic implications

### For Implementation
- **[Technical Guide](./docs/technical-guide.md)** - Validated patterns, error solutions, and best practices

### For Development
- **Current README** - Installation, configuration, and basic usage
- **[API Reference](./docs/api-reference.md)** *(coming soon)*

---

## Troubleshooting

### Common Issues

1. **"Client not initialized"**
   - Check `N8N_API_URL` and `N8N_API_KEY` are set correctly
   - Ensure n8n instance is accessible at specified URL
   - Verify API key has necessary permissions

2. **"License required" errors**
   - You're attempting to use Enterprise features
   - Either upgrade to n8n Enterprise or use core features only

3. **Webhook authentication failures**
   - Verify `N8N_WEBHOOK_USERNAME` and `N8N_WEBHOOK_PASSWORD` are set
   - Check webhook credentials match your n8n configuration

4. **Credential assignment issues**
   - This is a known limitation - see [Current Limitations](#current-limitations--workarounds)
   - Manual assignment in n8n UI is currently required

5. **AI assistant connection issues**
   - Restart your MCP client after configuration changes
   - Verify MCP server path is correct for your system
   - Check environment variables are properly set

6. **n8n connection issues**
   - Verify n8n instance is running and accessible
   - Check URL protocol (http/https)
   - Remove trailing slash from `N8N_API_URL`

### For detailed troubleshooting patterns, see [Technical Guide](./docs/technical-guide.md)

---

## Contributing

### Development Workflow
1. **Read the technical guide** before making changes
2. **Update documentation** when adding features
3. **Test thoroughly** with various n8n configurations and AI assistants
4. **Update version numbers** in both code and docs

### Enhancement Priorities
1. **Credential assignment functions** - Critical for full automation
2. **Credential discovery mechanisms** - Essential for workflow planning
3. **Error handling improvements** - Better resilience
4. **Performance optimizations** - Scalability enhancements

### Testing with Different AI Assistants
- **Claude Desktop**: Primary development and testing platform
- **Cline**: Text-based workflow generation and code assistance
- **Continue**: Basic MCP functionality validation
- **Custom Clients**: Ensure MCP protocol compliance

---

## Security Best Practices

### API Key Management
- Use minimal permissions necessary for your use case
- Rotate API keys regularly (recommended: monthly)
- Never commit keys to version control
- Use environment variables for all sensitive data

### Instance Security
- Use HTTPS for production n8n instances
- Enable n8n authentication and 2FA
- Keep n8n updated to latest version
- Regular security audits using the `generate-audit` function

### MCP Server Security
- Limit network access to n8n instance
- Monitor MCP server logs for unusual activity
- Use secure webhook credentials
- Regular dependency updates

### AI Assistant Security
- Be mindful of data shared with AI assistants
- Use appropriate privacy settings in AI platforms
- Validate AI-generated workflows before deployment
- Monitor automated workflows for unexpected behavior

---

## Support & Resources

### Documentation
- [Technical Implementation Guide](./docs/technical-guide.md)
- [Capabilities and Limitations](./docs/capabilities.md)
- [n8n Official Documentation](https://docs.n8n.io)

### Community
- [GitHub Issues](https://github.com/AIssistedDevelopment/advanced-n8n-mcp-server/issues)
- [n8n Community Forum](https://community.n8n.io)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)

### Enterprise Support
- n8n Enterprise customers: Contact n8n support for advanced integration assistance
- Custom development: Available for enterprise automation requirements
- AI platform integration: Consulting available for multi-platform deployments

---

## License

[MIT License](LICENSE)

---

## Changelog

### v3.1 (Latest - AI-Agnostic)
- ✅ AI-agnostic documentation and configuration
- ✅ Multi-platform MCP client support
- ✅ Enhanced credential management (create/delete)
- ✅ Comprehensive documentation system
- ✅ Advanced workflow patterns support
- ⚠️ Credential assignment still requires manual configuration
- 📋 Planned: Automatic credential assignment functions

### v3.0
- ✅ Enhanced credential management (create/delete)
- ✅ Comprehensive documentation system
- ✅ Advanced workflow patterns support
- ⚠️ Credential assignment still requires manual configuration
- 📋 Planned: Automatic credential assignment functions

### v2.x
- ✅ Basic MCP server functionality
- ✅ Core workflow operations
- ✅ Enterprise feature support

### v1.x
- ✅ Initial MCP integration
- ✅ Basic workflow management

## Credential Management Strategy (n8n Community Edition)

## Overview
n8n Community Edition does **not** support listing credentials via the public API. This means that automation tools (like Claude Desktop via MCP) cannot discover or assign credentials programmatically unless the credential ID is already known.

## Solution: Credential Mapping and Types Files
To enable full workflow automation, place the server, Electron app (.exe), `credentials-map.json`, and `credential-types.json` all in the same folder. Both the app and the server will always read/write these files in their current working directory, so all must be together for correct operation.

### Example `credentials-map.json`
```json
{
  "openAiApi": { "id": "123", "name": "OpenAI API Key" },
  "githubApi": { "id": "456", "name": "GitHub Token" }
}
```

### Example `credential-types.json`
```json
{
  "types": ["openAiApi", "githubApi", ...],
  "typeStates": { "openAiApi": true, "githubApi": false, ... }
}
```

- **credentials-map.json**: Only contains actual credential mappings (type → {id, name}).
- **credential-types.json**: Contains the master list of credential types and their enabled/disabled state for the UI.

## How to Add a New Credential
1. **Create the credential in n8n** (UI > Credentials > New credential).
2. **Get the credential ID** from the URL or details panel in the n8n UI.
3. **Update `credentials-map.json`** (in the same folder as the app/server) with the new type, ID, and name.
4. **Reload the MCP server** if needed.

## Security Considerations
- The mapping file contains only IDs and names—**never secrets or API keys**.
- Keep the mapping file private if you want to avoid leaking integration names.

## Limitations
- If you delete or recreate a credential in n8n, you must update the mapping file.
- No automation is possible for credential discovery in Community Edition; this is a manual step.

## Automation Workflow
- Claude Desktop (via MCP) requests a credential of a certain type.
- The MCP server looks up the type in the mapping file and assigns the correct ID to the node.
- n8n uses the ID to fetch the real secret at runtime.

## Future Improvements
- If n8n adds credential listing to the API, this process can be automated.
- For now, this mapping/types file approach is the most secure and reliable for Community Edition.

# Credential Mapping Helper System

## Overview
To make updating the credential mapping file easy and error-free, use the provided local server and browser bookmarklet:

### 1. Credential Mapping Server
- The server listens on `http://localhost:32192/map` and updates the `credentials-map.json` file in the same folder.

### 2. Browser Bookmarklet
- Add the provided JavaScript as a bookmark in your browser.
- When viewing a credential in n8n, click the bookmarklet.
- The bookmarklet sends the ID and name to the local server and shows a notification on success. The app will prompt you to select a type.

### 3. Security
- The mapping file contains only IDs and names, not secrets.
- The local server only listens on localhost and should not be exposed to the internet.

### 4. Troubleshooting
- If the bookmarklet fails, check that the local server is running and accessible.
- Make sure your browser allows notifications and fetch requests to `localhost`.
- If the credential name or ID is not detected, enter them manually when prompted.

### 5. Updating the Mapping
- After adding a new credential in n8n, use the bookmarklet to update the mapping file in seconds—no manual JSON editing required.

# Credential Mapping GUI (Electron App)

## Overview
This project includes a simple Electron-based desktop app for managing the `credentials-map.json` and `credential-types.json` files used by the MCP server. The app is designed for use **only within this repository** and is not intended as a general-purpose credential manager. It is tightly integrated with the MCP workflow and always reads/writes the mapping and types files in the same folder as the app/server.

## Features
- View, add, edit, and delete credential mappings (type, ID, name)
- Manage the master list of credential types and their enabled/disabled state
- Status indicator and manual start/stop controls
- Integrates with the browser bookmarklet for easy credential capture from n8n

## Folder Structure
- `src/credential-mapping-app/` — Electron app source code
- `credentials-map.json` — The mapping file managed by the app. **It must be in the same folder as the app/server.**
- `credential-types.json` — The types file managed by the app. **It must be in the same folder as the app/server.**

## Usage
1. Start the app from the MCP repo root: `npm run credential-mapping-app` (or use the provided desktop shortcut)
2. Use the GUI to view or edit mappings, or start the mapping server
3. Use the settings dialog to manage credential types and their enabled/disabled state
4. The server will auto-shutdown after a bookmarklet POST, or you can shut it down manually

## Security
- The mapping and types files are only modified when the app is running
- No background processes unless explicitly started

See the technical guide for more details on integration and workflow.

#### Mapping Fields
- **Type**: The credential type string as used in n8n (e.g., `n8n-api` or `googleSheetsApi`). This is how the MCP knows which credential to assign to which node type.
- **ID**: The unique credential ID in n8n. This is what n8n uses internally to reference the credential.
- **Name**: The human-readable name of the credential in n8n. This is for clarity and UI display, and helps agents or users distinguish between multiple credentials of the same type.

#### Types File Fields
- **types**: Array of all known credential types (default and custom)
- **typeStates**: Object mapping type name to enabled/disabled state

![Credential Mapping Manager screenshot](./docs/credential-mapping-manager.png)

## Usage

- Start the app. The server can be started/stopped from the main window.
- The credential mapping table is scrollable. Use the **refresh** (⟳) and **settings** (⚙) icons at the top right to update or configure credential types.
- To add a mapping from your browser, use the **Script** button in the bottom right corner to copy the bookmarklet. Paste it into your browser bookmarks bar. When you need to send a credential, click the bookmarklet while viewing a credential in n8n. The app will prompt you to select a credential type from your enabled types list, then save the mapping and auto-refresh.
- Only enabled types (managed in settings) appear in the selection dialog. Default types are toggleable (enable/disable) but not deletable; custom types are both toggleable and deletable. There is no add new type button on the main page—types are managed only in the settings dialog.
- The **Script** button is small and unobtrusive, always available in the bottom right of the app window.
- All mappings are saved to `credentials-map.json` and all types to `credential-types.json` in the app/server directory.

## For AI Agents and MCP Integrations
- Only use `credentials-map.json` for credential mappings (type → {id, name}).
- Ignore `credential-types.json` unless you are managing the UI or type list.
- Do not treat any keys in `credentials-map.json` as types or states—only as mappings.