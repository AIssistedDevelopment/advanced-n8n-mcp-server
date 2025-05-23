// Placeholder: UI logic for credential mapping app
// Will connect to Electron main process via IPC for file and server operations

const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mappingBody = document.getElementById('mapping-body');
  const mappingForm = document.getElementById('mapping-form');
  const typeInput = document.getElementById('type');
  const idInput = document.getElementById('id');
  const nameInput = document.getElementById('name');
  const editTypeInput = document.getElementById('edit-type');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const startServerBtn = document.getElementById('start-server');
  const stopServerBtn = document.getElementById('stop-server');
  const oneShotCheckbox = document.getElementById('one-shot');
  const serverStatus = document.getElementById('server-status');

  let editing = false;

  const DEFAULT_TYPES = [
    'openAiApi', 'githubApi', 'slackApi', 'googleSheetsApi', 'httpBasicAuth', 'httpHeaderAuth', 'oAuth2Api',
    'awsApi', 'azureApi', 'gcpApi', 'postgresApi', 'mysqlApi', 'mongoDbApi', 'discordApi', 'microsoftOAuth2Api',
    'dropboxApi', 'jiraApi', 'notionApi', 'twilioApi', 'smtp', 'imap', 'webhookAuth', 'shopifyApi', 'stripeApi',
    'sendgridApi', 'zoomApi', 'zendeskApi', 'mondayComApi', 'asanaApi', 'trelloApi', 'bitbucketApi', 'gitlabApi',
    'cloudflareApi', 'mailgunApi', 'redisApi', 'redisClusterApi', 'mariadbApi', 'mssqlApi', 'sftp', 'ftp', 's3',
    'googleDriveApi', 'microsoftTeamsApi', 'microsoftGraphApi', 'microsoftOneDriveApi', 'microsoftSharepointApi',
    'microsoftOutlookApi', 'microsoftExcelApi', 'microsoftWordApi', 'microsoftPowerpointApi', 'microsoftOnenoteApi',
    'microsoftToDoApi', 'microsoftPlannerApi', 'microsoftBookingsApi', 'microsoftFormsApi', 'microsoftListsApi',
    'microsoftStreamApi', 'microsoftWhiteboardApi', 'microsoftYammerApi', 'microsoftKaizalaApi', 'microsoftPowerAppsApi',
    'microsoftPowerAutomateApi', 'microsoftPowerBiApi', 'microsoftProjectApi', 'microsoftVisioApi', 'microsoftDynamics365Api',
    'microsoftIntuneApi', 'microsoftSecurityApi', 'microsoftComplianceApi', 'microsoftDefenderApi', 'microsoftPurviewApi',
    'microsoftVivaApi', 'microsoftLoopApi', 'microsoftMeshApi', 'microsoftCopilotApi', 'microsoft365Api', 'microsoft365AdminApi',
    'microsoft365ComplianceApi', 'microsoft365DefenderApi', 'microsoft365SecurityApi', 'microsoft365PurviewApi', 'microsoft365VivaApi',
    'microsoft365LoopApi', 'microsoft365MeshApi', 'microsoft365CopilotApi', 'microsoft365BookingsApi', 'microsoft365FormsApi',
    'microsoft365ListsApi', 'microsoft365StreamApi', 'microsoft365WhiteboardApi', 'microsoft365YammerApi', 'microsoft365KaizalaApi',
    'microsoft365PowerAppsApi', 'microsoft365PowerAutomateApi', 'microsoft365PowerBiApi', 'microsoft365ProjectApi', 'microsoft365VisioApi',
    'microsoft365Dynamics365Api', 'microsoft365IntuneApi', 'microsoft365SecurityApi', 'microsoft365ComplianceApi', 'microsoft365DefenderApi',
    'microsoft365PurviewApi', 'microsoft365VivaApi', 'microsoft365LoopApi', 'microsoft365MeshApi', 'microsoft365CopilotApi'
  ];
  let types = [];
  let typeStates = {};
  let mappingsCache = {};

  function showToast(msg, isError) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = isError ? '#d7263d' : '#222';
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2200);
  }

  async function loadTypes() {
    const data = await ipcRenderer.invoke('get-types');
    types = data.types && data.types.length ? data.types : [...DEFAULT_TYPES];
    typeStates = data.typeStates || {};
    updateTypeDropdown();
  }

  function updateTypeDropdown() {
    const typeSelect = document.getElementById('type');
    typeSelect.innerHTML = '';
    types.filter(isTypeEnabled).forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    });
  }

  function openSettingsDialog() {
    const dlg = document.getElementById('settings-dialog');
    dlg.style.display = 'block';
    renderTypesList();
  }
  function closeSettingsDialog() {
    document.getElementById('settings-dialog').style.display = 'none';
  }
  function renderTypesList() {
    const list = document.getElementById('types-list');
    list.innerHTML = '';
    types.forEach((t, i) => {
      const enabled = isTypeEnabled(t);
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.marginBottom = '4px';
      div.innerHTML = `<span style="flex:1;${enabled ? '' : 'color:#aaa;'}">${t}</span>
        <input type="checkbox" data-idx="${i}" ${enabled ? 'checked' : ''} title="Enable/disable type" style="margin-right:8px;" />
        ${isDefaultType(t) ? '' : `<button data-idx="${i}" class="remove-type">Remove</button>`}`;
      list.appendChild(div);
    });
    list.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.onchange = () => {
        const idx = Number(box.dataset.idx);
        setTypeEnabled(types[idx], box.checked);
        renderTypesList();
        updateTypeDropdown();
      };
    });
    list.querySelectorAll('.remove-type').forEach(btn => {
      btn.onclick = async () => {
        types.splice(Number(btn.dataset.idx), 1);
        await saveTypes();
        renderTypesList();
        updateTypeDropdown();
      };
    });
  }
  async function saveTypes() {
    await ipcRenderer.invoke('reload-map-file');
    await ipcRenderer.invoke('save-types', { types, typeStates });
  }

  async function loadMappings() {
    const mappings = await ipcRenderer.invoke('get-mappings');
    mappingBody.innerHTML = '';
    if (!mappings || Object.keys(mappings).length === 0) {
      mappingBody.innerHTML = '<tr><td colspan="4">No mappings found.</td></tr>';
      return;
    }
    Object.entries(mappings).forEach(([type, { id, name }]) => {
      if (type.startsWith('__')) return; // Filter out special keys
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${type}</td>
        <td>${id}</td>
        <td>${name}</td>
        <td>
          <span class="edit" data-type="${type}">Edit</span>
          <span class="danger" data-type="${type}">Delete</span>
        </td>
      `;
      mappingBody.appendChild(tr);
    });
    // Add event listeners for edit/delete
    mappingBody.querySelectorAll('.edit').forEach(el => {
      el.onclick = () => startEdit(el.dataset.type);
    });
    mappingBody.querySelectorAll('.danger').forEach(el => {
      el.onclick = () => deleteMapping(el.dataset.type);
    });
  }

  async function saveMapping(e) {
    e.preventDefault();
    await ipcRenderer.invoke('reload-map-file');
    const type = typeInput.value.trim();
    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    if (!type || !id || !name) return;
    const res = await ipcRenderer.invoke('save-mapping', { type, id, name });
    if (res.error) alert(res.error);
    mappingForm.reset();
    editing = false;
    loadMappings();
  }

  function startEdit(type) {
    ipcRenderer.invoke('get-mappings').then(mappings => {
      if (!mappings[type]) return;
      typeInput.value = type;
      idInput.value = mappings[type].id;
      nameInput.value = mappings[type].name;
      editTypeInput.value = type;
      editing = true;
    });
  }

  async function deleteMapping(type) {
    if (!confirm(`Delete mapping for type "${type}"?`)) return;
    await ipcRenderer.invoke('reload-map-file');
    const res = await ipcRenderer.invoke('delete-mapping', type);
    if (res.error) alert(res.error);
    loadMappings();
  }

  cancelEditBtn.onclick = () => {
    mappingForm.reset();
    editing = false;
  };

  mappingForm.onsubmit = saveMapping;

  // Server controls
  async function updateServerStatus() {
    const res = await ipcRenderer.invoke('get-server-status');
    serverStatus.textContent = res.running ? 'Server: Running' : 'Server: Stopped';
  }

  startServerBtn.onclick = async () => {
    const res = await ipcRenderer.invoke('start-server');
    if (res.error) alert(res.error);
    updateServerStatus();
  };
  stopServerBtn.onclick = async () => {
    const res = await ipcRenderer.invoke('stop-server');
    if (res.error) alert(res.error);
    updateServerStatus();
  };

  // Settings dialog logic
  document.getElementById('settings-btn').onclick = openSettingsDialog;
  document.getElementById('close-settings').onclick = closeSettingsDialog;
  document.getElementById('add-type-settings').onclick = async () => {
    const newType = document.getElementById('new-type-input').value.trim();
    if (newType && !types.includes(newType)) {
      types.push(newType);
      await saveTypes();
      renderTypesList();
      updateTypeDropdown();
      document.getElementById('new-type-input').value = '';
    }
  };
  document.getElementById('restore-types').onclick = async () => {
    types = [...DEFAULT_TYPES];
    await saveTypes();
    renderTypesList();
    updateTypeDropdown();
  };
  const addTypeBtn = document.getElementById('add-type-btn');
  if (addTypeBtn) addTypeBtn.style.display = 'none';

  // Refresh button
  document.getElementById('refresh-btn').onclick = () => loadMappings();

  // Bookmarklet copy logic for new button
  const copyBookmarkletBtn = document.getElementById('copy-bookmarklet');
  if (copyBookmarkletBtn) {
    copyBookmarkletBtn.onclick = () => {
      const script = `javascript:(()=>{function g(sel){return document.querySelector(sel);}function getId(){let m=window.location.pathname.match(/credentials\\/([a-zA-Z0-9_-]+)/);return m?m[1]:null;}function getName(){let n=g('[data-test-id="credential-name"]')||g('input[name="name"]')||g('input[placeholder="Name"]');return n?(n.value||n.textContent||'').trim():'';}let id=getId(),name=getName();if(!id)id=prompt('Credential ID?');if(!name)name=prompt('Credential Name?');if(!id||!name)return;fetch('http://localhost:32192/map',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,name}),mode:'cors'}).then(()=>alert('Sent!')).catch(()=>alert('Failed to contact mapping server. Is it running?'));})();`;
      navigator.clipboard.writeText(script).then(() => showToast('Bookmarklet script copied!'));
    };
  }
  // Remove old bookmarklet input/label if present
  const oldBookmarkletInput = document.getElementById('bookmarklet-text');
  if (oldBookmarkletInput && oldBookmarkletInput.parentElement) {
    oldBookmarkletInput.parentElement.style.display = 'none';
  }

  // Auto-refresh on mappings-updated
  require('electron').ipcRenderer.on('mappings-updated', () => loadMappings());

  // Remove one-shot logic
  // Remove oneShotCheckbox and related code
  if (document.getElementById('one-shot')) document.getElementById('one-shot').remove();

  // Listen for a new mapping request from the server (via IPC)
  ipcRenderer.on('incoming-mapping', async (event, { id, name }) => {
    // Show a dialog to select type from enabled types
    const enabledTypes = types.filter(t => isTypeEnabled(t));
    const dlg = document.createElement('div');
    dlg.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);z-index:3000;display:flex;align-items:center;justify-content:center;';
    dlg.innerHTML = `<div style="background:#fff;padding:28px 32px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.18);min-width:320px;">
      <h3>Select Credential Type</h3>
      <div style="margin-bottom:12px;">ID: <b>${id}</b><br>Name: <b>${name}</b></div>
      <select id="incoming-type-select" style="width:100%;margin-bottom:18px;">
        ${enabledTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <button id="incoming-type-save">Save</button>
      <button id="incoming-type-cancel">Cancel</button>
    </div>`;
    document.body.appendChild(dlg);
    document.getElementById('incoming-type-save').onclick = async () => {
      const type = document.getElementById('incoming-type-select').value;
      await ipcRenderer.invoke('save-mapping', { type, id, name });
      document.body.removeChild(dlg);
      showToast('Mapping saved!');
      loadMappings();
    };
    document.getElementById('incoming-type-cancel').onclick = () => {
      document.body.removeChild(dlg);
    };
  });

  // 5. Settings dialog: default types are toggleable, not deletable; custom types are both toggleable and deletable
  function isDefaultType(type) {
    return DEFAULT_TYPES.includes(type);
  }
  function isTypeEnabled(type) {
    return typeStates[type] !== false;
  }
  function setTypeEnabled(type, enabled) {
    typeStates[type] = !!enabled;
    saveTypes();
  }

  // Initial load
  loadTypes().then(loadMappings);
  updateServerStatus();
}); 