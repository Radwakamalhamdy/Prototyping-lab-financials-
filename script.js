/* =========================================================
   Prototyping Lab Financials — script.js
   Pure vanilla JS · All data in localStorage
   ========================================================= */

(() => {
  'use strict';

  // ── Constants ──
  const TOTAL_RECEIVED = 92000;
  const LS_KEY = 'plf_data_v4';

  const TABLE_IDS = ['lab', 'uec', 'dr'];
  const TABLE_LABELS = {
    lab: 'Prototyping Lab Financials',
    uec: 'UEC Financials',
    dr: 'Dr. Ahmed Gomaa Financials'
  };

  // ── Default (seed) data ──
  const SEED_DATA = {
    lab: [
      { item: 'اوبر توصيل', price: 80, img: '' },
      { item: 'اوبر توصيل الاوردر', price: 130, img: '' },
      { item: 'سيرنجات', price: 710, img: '' },
      { item: 'اوبر السيرنجات', price: 190, img: '' },
      { item: 'دكتور مريم ال website', price: 1059, img: '' },
      { item: 'الخلاط', price: 4300, img: '' },
      { item: 'مشترك', price: 320, img: '' },
      { item: 'توصيل المشترك', price: 100, img: '' },
      { item: 'رحمه شحن خط', price: 150, img: '' },
      { item: 'دومين ايفو بوتكس', price: 750, img: '' },
      { item: 'توصيل اوبر', price: 85, img: '' },
      { item: 'اوبر مصاريف المعمل', price: 130, img: '' },
      { item: 'شمع', price: 150, img: '' },
      { item: 'توصيل الشمع', price: 70, img: '' },
      { item: 'كاميرا الاماكن الضيقه', price: 950, img: '' },
      { item: 'اوبر', price: 80, img: '' },
      { item: 'توصيل', price: 100, img: '' },
      { item: 'سكر وشاي للمعمل', price: 120, img: '' },
      { item: 'سيرنجات', price: 800, img: '' },
      { item: 'توصيل السيرنجات', price: 300, img: '' },
      { item: 'معدات', price: 1825, img: '' },
      { item: 'وصله فيجا', price: 50, img: '' },
      { item: 'اوبر اللؤلؤه', price: 190, img: '' },
      { item: 'معدات', price: 365, img: '' },
      { item: 'اوبر', price: 80, img: '' },
      { item: 'مفتاح فك وتركيب', price: 145, img: '' },
      { item: 'سدادات', price: 100, img: '' },
      { item: 'اوبر', price: 110, img: '' },
      { item: 'خالد اكراميه', price: 100, img: '' },
      { item: 'pressure sensor', price: 960, img: '' },
      { item: 'رام الكترونيك', price: 650, img: '' },
      { item: 'اوبر رام و البرويشور سسنسور', price: 300, img: '' },
      { item: 'كمبروسور مشروع محمد', price: 3750, img: '' },
      { item: 'توصيل الكمبروسور', price: 300, img: '' }
    ],
    uec: [
      { item: 'بوست المصري اليوم (1) - 12/9', price: 500, img: '' },
      { item: 'بوست المصري اليوم (2) - 12/9', price: 1000, img: '' },
      { item: 'بوست خمسينه نيوز (1) - 12/9', price: 500, img: '' },
      { item: 'بوست خمسينه نيوز (2) - 12/9', price: 500, img: '' },
      { item: 'بوست خمسينه نيوز (3) - 12/9', price: 500, img: '' },
      { item: 'Video Editor', price: 500, img: '' },
      { item: 'بوست المصري اليوم (3) - 16/9', price: 500, img: '' },
      { item: 'بوست المصري اليوم (4) - 16/9', price: 500, img: '' },
      { item: 'بوست المصري اليوم (5) - 17/9', price: 500, img: '' },
      { item: 'بوست Private Universities - 17/9', price: 5000, img: '' }
    ],
    dr: [
      { item: 'شاورما', price: 140, img: '' },
      { item: 'هديه كارما', price: 550, img: '' },
      { item: 'بيتزا', price: 480, img: '' },
      { item: 'Vending Machine', price: 50, img: '' },
      { item: 'سحب للدكتور', price: 5000, img: '' },
      { item: 'Vending Machine', price: 40, img: '' },
      { item: 'بيتزا', price: 680, img: '' },
      { item: 'رحيمه اكل الدكتور', price: 110, img: '' },
      { item: 'Vending Machine', price: 50, img: '' },
      { item: 'سحبتهم للدكتور', price: 4500, img: '' },
      { item: 'اكل الدكتور', price: 100, img: '' },
      { item: 'سحبتهم للدكتور', price: 3000, img: '' },
      { item: 'ساندوتش كوفته', price: 130, img: '' },
      { item: 'شيبسي', price: 20, img: '' },
      { item: 'مكرونه سجق', price: 80, img: '' },
      { item: 'مكرونه سجق', price: 80, img: '' },
      { item: 'مكرونه سجق', price: 80, img: '' },
      { item: 'فول وطعميه توصيل', price: 90, img: '' }
    ]
  };

  // ── Cloud Database Constants ──
  const FIREBASE_BASE_URL = 'https://prototyping-lab-financials-default-rtdb.firebaseio.com';
  const FIREBASE_DATA_URL = `${FIREBASE_BASE_URL}/financial_data.json`;

  // ── State ──
  let data = {};          // { lab: [...], uec: [...], dr: [...] }
  let sortState = {};     // { lab: { key, dir }, ... }
  let editTarget = null;  // { tableId, index } or null
  let tempImg = '';        // base64 for modal preview
  let sseSource = null;
  let isSavingToCloud = false;

  // ── Cloud Sync Status UI ──
  function updateSyncUI(status, customMsg) {
    const badge = document.getElementById('sync-status-badge');
    const textEl = document.getElementById('sync-status-text');
    const dotEl = badge ? badge.querySelector('.sync-dot') : null;
    if (!badge || !textEl || !dotEl) return;

    dotEl.className = 'sync-dot';
    if (status === 'synced') {
      dotEl.classList.add('synced');
      textEl.textContent = customMsg || 'Live Cloud Synced';
      badge.title = 'Real-time sync active. Edits sync automatically across mobile & laptop.';
    } else if (status === 'saving') {
      dotEl.classList.add('saving');
      textEl.textContent = customMsg || 'Syncing to Cloud…';
      badge.title = 'Uploading changes to cloud database…';
    } else if (status === 'connecting') {
      dotEl.classList.add('saving');
      textEl.textContent = customMsg || 'Connecting…';
    } else if (status === 'offline') {
      dotEl.classList.add('offline');
      textEl.textContent = customMsg || 'Saved Locally (Offline)';
      badge.title = 'Offline mode: Changes saved in this browser.';
    }
  }

  // ── Init ──
  function init() {
    loadData();
    TABLE_IDS.forEach(id => { sortState[id] = { key: null, dir: 1 }; });
    renderAll();
    bindGlobalEvents();
    fetchCloudDataOnStart();
    initRealtimeSync();
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        data = JSON.parse(raw);
        TABLE_IDS.forEach(id => { if (!Array.isArray(data[id])) data[id] = []; });
        const totalItems = data.lab.length + data.uec.length + data.dr.length;
        if (totalItems === 0) {
          data = JSON.parse(JSON.stringify(SEED_DATA));
          localStorage.setItem(LS_KEY, JSON.stringify(data));
        }
      } else {
        data = JSON.parse(JSON.stringify(SEED_DATA));
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      }
    } catch {
      data = JSON.parse(JSON.stringify(SEED_DATA));
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    }
  }

  async function fetchCloudDataOnStart() {
    try {
      const resp = await fetch(FIREBASE_DATA_URL);
      if (resp.ok) {
        const cloudData = await resp.json();
        if (cloudData && typeof cloudData === 'object') {
          let hasAny = false;
          TABLE_IDS.forEach(id => {
            if (Array.isArray(cloudData[id]) && cloudData[id].length > 0) {
              data[id] = cloudData[id];
              hasAny = true;
            }
          });
          if (hasAny) {
            localStorage.setItem(LS_KEY, JSON.stringify(data));
            renderAll();
            updateSyncUI('synced');
          }
        }
      }
    } catch (e) {
      console.warn('Initial cloud fetch notice (using cache):', e);
    }
  }

  function initRealtimeSync() {
    if (typeof EventSource === 'undefined') {
      updateSyncUI('offline', 'Local Mode');
      return;
    }

    try {
      if (sseSource) sseSource.close();
      updateSyncUI('connecting');
      sseSource = new EventSource(FIREBASE_DATA_URL);

      sseSource.addEventListener('put', (e) => {
        try {
          if (isSavingToCloud) return; // Ignore incoming reflection while pushing local edit
          const payload = JSON.parse(e.data);
          if (!payload) return;

          if (payload.path === '/' && payload.data) {
            const cd = payload.data;
            let updated = false;
            TABLE_IDS.forEach(id => {
              if (Array.isArray(cd[id])) {
                data[id] = cd[id];
                updated = true;
              }
            });
            if (updated) {
              localStorage.setItem(LS_KEY, JSON.stringify(data));
              renderAll();
              updateSyncUI('synced');
            }
          } else if (payload.path && payload.data !== undefined) {
            const parts = payload.path.replace(/^\//, '').split('/');
            const tId = parts[0];
            if (TABLE_IDS.includes(tId)) {
              if (parts.length === 1 && Array.isArray(payload.data)) {
                data[tId] = payload.data;
              } else if (parts.length === 2) {
                const idx = parseInt(parts[1], 10);
                if (!isNaN(idx)) {
                  if (payload.data === null) {
                    data[tId].splice(idx, 1);
                  } else {
                    data[tId][idx] = payload.data;
                  }
                }
              }
              localStorage.setItem(LS_KEY, JSON.stringify(data));
              renderAll();
              updateSyncUI('synced');
            }
          }
        } catch (err) {
          console.error('SSE put parse error:', err);
        }
      });

      sseSource.addEventListener('open', () => {
        updateSyncUI('synced');
      });

      sseSource.addEventListener('error', () => {
        updateSyncUI('offline', 'Reconnecting…');
      });
    } catch (err) {
      console.error('SSE initialization error:', err);
      updateSyncUI('offline');
    }
  }

  function resetDefaults() {
    showConfirm(
      '🔄 Reset to Default Data?',
      'This will reload all pre-populated transactions and sync them to all devices.',
      () => {
        data = JSON.parse(JSON.stringify(SEED_DATA));
        saveData();
        renderAll();
      }
    );
  }

  function saveData() {
    // 1. Immediately cache locally
    localStorage.setItem(LS_KEY, JSON.stringify(data));

    // 2. Sync to Firebase Cloud Database in background
    syncDataToCloud();
  }

  async function syncDataToCloud() {
    updateSyncUI('saving');
    isSavingToCloud = true;
    try {
      const resp = await fetch(FIREBASE_DATA_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        updateSyncUI('synced');
      } else {
        updateSyncUI('offline', 'Sync Error');
      }
    } catch (err) {
      console.error('Error saving to cloud:', err);
      updateSyncUI('offline', 'Saved Locally');
    } finally {
      setTimeout(() => { isSavingToCloud = false; }, 800);
    }
  }

  // ── Formatting ──
  function fmt(n) {
    return Number(n).toLocaleString('en-US') + ' EGP';
  }

  function totalOf(tableId) {
    return (data[tableId] || []).reduce((s, t) => s + Number(t.price || 0), 0);
  }

  // ── Render ──
  function renderAll() {
    TABLE_IDS.forEach(renderTable);
    renderSummary();
    applySearch();
  }

  function renderTable(tableId) {
    const tbody = document.getElementById(`tbody-${tableId}`);
    const items = getSorted(tableId);
    const badge = document.getElementById(`badge-${tableId}`);
    const totalEl = document.getElementById(`total-${tableId}`);
    const empty = document.getElementById(`empty-${tableId}`);

    badge.textContent = `${items.length} transaction${items.length !== 1 ? 's' : ''}`;
    totalEl.textContent = fmt(totalOf(tableId));

    if (items.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = items.map((t, vi) => {
      const realIdx = t._idx;
      const imgHtml = t.img
        ? `<img class="thumb" src="${t.img}" alt="Receipt" onclick="event.stopPropagation(); PLF.openLightbox(this.src)" title="Click to view full receipt">`
        : `<div class="no-img" title="No image uploaded">📷</div>`;
      return `<tr onclick="PLF.selectCell('${tableId}', ${vi + 1}, '${escHtml(t.item).replace(/'/g, "\\'")}', ${t.price})">
        <td class="row-num">${vi + 1}</td>
        <td class="item-name" dir="auto">${escHtml(t.item)}</td>
        <td class="price-cell">${fmt(t.price)}</td>
        <td class="img-cell">${imgHtml}</td>
        <td class="act-cell"><div class="actions-cell">
          <button class="act-btn edit" onclick="event.stopPropagation(); PLF.editTx('${tableId}',${realIdx})">✏️ Edit</button>
          <button class="act-btn delete" onclick="event.stopPropagation(); PLF.deleteTx('${tableId}',${realIdx})">🗑️ Delete</button>
        </div></td>
      </tr>`;
    }).join('');
  }

  function selectCell(tableId, rowNum, item, price) {
    const fxName = document.getElementById('fx-cell-name');
    const fxText = document.getElementById('fx-formula-text');
    const sheetLabels = { lab: 'Lab', uec: 'UEC', dr: 'Dr_Gomaa' };
    const tabName = sheetLabels[tableId] || tableId;
    if (fxName) fxName.textContent = `${tabName}!B${rowNum + 1}`;
    if (fxText) fxText.innerHTML = `<strong>${escHtml(item)}</strong> &nbsp;=&nbsp; <span style="color:#1a73e8; font-weight:700;">${fmt(price)}</span> &nbsp;|&nbsp; <em>Row ${rowNum} in ${TABLE_LABELS[tableId]}</em>`;
  }

  function getSorted(tableId) {
    const items = data[tableId].map((t, i) => ({ ...t, _idx: i }));
    const s = sortState[tableId];
    if (s.key) {
      items.sort((a, b) => {
        let va = a[s.key], vb = b[s.key];
        if (s.key === 'price') { va = Number(va); vb = Number(vb); return (va - vb) * s.dir; }
        return String(va).localeCompare(String(vb), 'ar') * s.dir;
      });
    }
    return items;
  }

  function renderSummary() {
    const labT = totalOf('lab');
    const uecT = totalOf('uec');
    const drT  = totalOf('dr');
    const spent = labT + uecT + drT;
    const remaining = TOTAL_RECEIVED - spent;

    const pct = TOTAL_RECEIVED > 0 ? (spent / TOTAL_RECEIVED) * 100 : 0;
    const labPct = TOTAL_RECEIVED > 0 ? (labT / TOTAL_RECEIVED) * 100 : 0;
    const uecPct = TOTAL_RECEIVED > 0 ? (uecT / TOTAL_RECEIVED) * 100 : 0;
    const drPct  = TOTAL_RECEIVED > 0 ? (drT / TOTAL_RECEIVED) * 100 : 0;
    const remPct = TOTAL_RECEIVED > 0 ? (remaining / TOTAL_RECEIVED) * 100 : 0;

    // Top Cards
    document.getElementById('sum-received').textContent = fmt(TOTAL_RECEIVED);
    document.getElementById('sum-lab').textContent = fmt(labT);
    document.getElementById('sum-uec').textContent = fmt(uecT);
    document.getElementById('sum-dr').textContent = fmt(drT);
    document.getElementById('sum-spent').textContent = fmt(spent);
    document.getElementById('sum-remaining').textContent = fmt(remaining);

    // Card Hints
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('hint-lab', labPct.toFixed(1) + '% of budget');
    setTxt('hint-uec', uecPct.toFixed(1) + '% of budget');
    setTxt('hint-dr', drPct.toFixed(1) + '% of budget');
    setTxt('hint-spent', pct.toFixed(1) + '% utilized');
    setTxt('hint-remaining', remaining >= 0 ? `${remPct.toFixed(1)}% available` : 'Deficit!');

    // Header badge
    document.getElementById('header-remaining').textContent = fmt(remaining);

    // Warning Banner
    const warn = document.getElementById('warning-banner');
    const remCard = document.getElementById('card-remaining');
    if (remaining < 0) {
      warn.classList.add('visible');
      remCard.classList.add('negative');
    } else {
      warn.classList.remove('visible');
      remCard.classList.remove('negative');
    }

    // Google Sheets Breakdown Table Values
    setTxt('tbl-sum-received', fmt(TOTAL_RECEIVED));
    setTxt('tbl-sum-lab', fmt(labT));
    setTxt('tbl-share-lab', labPct.toFixed(1) + '%');
    setTxt('tbl-sum-uec', fmt(uecT));
    setTxt('tbl-share-uec', uecPct.toFixed(1) + '%');
    setTxt('tbl-sum-dr', fmt(drT));
    setTxt('tbl-share-dr', drPct.toFixed(1) + '%');
    setTxt('tbl-sum-spent', fmt(spent));
    setTxt('tbl-share-spent', pct.toFixed(1) + '%');
    setTxt('tbl-sum-remaining', fmt(remaining));
    setTxt('tbl-share-remaining', remPct.toFixed(1) + '%');

    // Budget utilization bar
    setTxt('bp-percent', pct.toFixed(1) + '%');
    setTxt('bp-spent', fmt(spent));
    setTxt('bp-remaining', fmt(remaining));
    const bpFill = document.getElementById('budget-fill');
    if (bpFill) {
      bpFill.style.width = Math.min(Math.max(pct, 0), 100) + '%';
      bpFill.style.background = remaining < 0 ? '#ef4444' : pct > 85 ? '#f59e0b' : '#10b981';
    }

    // Status Pill
    const statusCell = document.getElementById('tbl-status-cell');
    if (statusCell) {
      statusCell.innerHTML = remaining >= 0
        ? '<span class="sheet-pill pill-green">Surplus Balance</span>'
        : '<span class="sheet-pill pill-red">Deficit Warning</span>';
    }
  }

  // ── Search / Filter ──
  function applySearch() {
    const q = (document.getElementById('search-input').value || '').trim().toLowerCase();
    TABLE_IDS.forEach(tableId => {
      const rows = document.querySelectorAll(`#tbody-${tableId} tr`);
      rows.forEach(row => {
        if (!q) { row.style.display = ''; return; }
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // ── Sort ──
  function sortBy(tableId, key) {
    const s = sortState[tableId];
    if (s.key === key) { s.dir *= -1; }
    else { s.key = key; s.dir = 1; }
    updateSortButtons(tableId);
    renderTable(tableId);
    applySearch();
  }

  function updateSortButtons(tableId) {
    const s = sortState[tableId];
    document.querySelectorAll(`#sort-${tableId} .sort-btn`).forEach(btn => {
      const k = btn.dataset.key;
      btn.classList.toggle('active', k === s.key);
      const arrow = btn.querySelector('.arrow');
      if (k === s.key) arrow.textContent = s.dir === 1 ? '▲' : '▼';
      else arrow.textContent = '▲';
    });
  }

  // ── Modal (Add/Edit) ──
  function openModal(tableId, index) {
    editTarget = index !== undefined ? { tableId, index } : { tableId, index: -1 };
    tempImg = '';

    const modal = document.getElementById('tx-modal');
    const titleEl = document.getElementById('modal-title');
    const itemInput = document.getElementById('modal-item');
    const priceInput = document.getElementById('modal-price');
    const preview = document.getElementById('modal-img-preview');

    if (index !== undefined) {
      const tx = data[tableId][index];
      titleEl.textContent = `Edit Transaction — ${TABLE_LABELS[tableId]}`;
      itemInput.value = tx.item;
      priceInput.value = tx.price;
      if (tx.img) {
        tempImg = tx.img;
        preview.innerHTML = `<img src="${tx.img}" alt="Preview"><button class="remove-img" onclick="PLF.removePreviewImg()">✕ Remove Image</button>`;
      } else {
        preview.innerHTML = '';
      }
    } else {
      titleEl.textContent = `Add Transaction — ${TABLE_LABELS[tableId]}`;
      itemInput.value = '';
      priceInput.value = '';
      preview.innerHTML = '';
    }

    modal.classList.add('active');
    itemInput.focus();
  }

  function closeModal() {
    document.getElementById('tx-modal').classList.remove('active');
    editTarget = null;
    tempImg = '';
  }

  function saveModal() {
    if (!editTarget) return;
    const item = document.getElementById('modal-item').value.trim();
    const price = parseFloat(document.getElementById('modal-price').value) || 0;
    if (!item) { alert('Please enter an item name.'); return; }

    const tx = { item, price, img: tempImg };

    if (editTarget.index >= 0) {
      data[editTarget.tableId][editTarget.index] = tx;
    } else {
      data[editTarget.tableId].push(tx);
    }
    saveData();
    closeModal();
    renderAll();
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 900;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          } else {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        tempImg = canvas.toDataURL('image/jpeg', 0.78);
        const preview = document.getElementById('modal-img-preview');
        preview.innerHTML = `<img src="${tempImg}" alt="Preview"><button class="remove-img" onclick="PLF.removePreviewImg()">✕ Remove Image</button>`;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removePreviewImg() {
    tempImg = '';
    document.getElementById('modal-img-preview').innerHTML = '';
    document.getElementById('modal-file').value = '';
  }

  // ── Delete ──
  function deleteTx(tableId, index) {
    const tx = data[tableId][index];
    const name = tx.item;
    showConfirm(
      `Delete "${name}"?`,
      'This transaction will be permanently removed.',
      () => {
        data[tableId].splice(index, 1);
        saveData();
        renderAll();
      }
    );
  }

  // ── Confirm Dialog ──
  let confirmCb = null;

  function showConfirm(title, msg, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent = msg;
    confirmCb = onConfirm;
    document.getElementById('confirm-overlay').classList.add('active');
  }

  function confirmYes() {
    document.getElementById('confirm-overlay').classList.remove('active');
    if (confirmCb) confirmCb();
    confirmCb = null;
  }

  function confirmNo() {
    document.getElementById('confirm-overlay').classList.remove('active');
    confirmCb = null;
  }

  // ── Lightbox ──
  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-overlay').classList.add('active');
  }

  function closeLightbox() {
    document.getElementById('lightbox-overlay').classList.remove('active');
  }

  // ── CSV Export ──
  function exportCSV() {
    let csv = '\uFEFF'; // BOM for Arabic
    csv += 'Table,Item,Price (EGP)\n';
    TABLE_IDS.forEach(id => {
      data[id].forEach(t => {
        csv += `"${TABLE_LABELS[id]}","${t.item}","${t.price}"\n`;
      });
    });
    const labT = totalOf('lab'), uecT = totalOf('uec'), drT = totalOf('dr');
    const spent = labT + uecT + drT;
    csv += `\n"Total Prototyping Lab Financials","","${labT}"\n`;
    csv += `"Total UEC Financials","","${uecT}"\n`;
    csv += `"Total Dr. Ahmed Gomaa Financials","","${drT}"\n`;
    csv += `"Total Spent","","${spent}"\n`;
    csv += `"Total Received","","${TOTAL_RECEIVED}"\n`;
    csv += `"Remaining Funds","","${TOTAL_RECEIVED - spent}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Prototyping_Lab_Financials.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Shared HTML builder for exports (Google Sheets style) ──
  function buildExportHTML() {
    const labT = totalOf('lab'), uecT = totalOf('uec'), drT = totalOf('dr');
    const spent = labT + uecT + drT;
    const remaining = TOTAL_RECEIVED - spent;
    const now = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });

    const sectionColors = {
      lab:  { hdr: '#1a56db', accent: '#dbeafe' },
      uec:  { hdr: '#7c3aed', accent: '#ede9fe' },
      dr:   { hdr: '#0891b2', accent: '#cffafe' }
    };

    let html = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8">\n';
    html += '<title>Prototyping Lab Financials Report</title>\n';
    html += '<style>\n';
    html += '@page { size: A4; margin: 15mm 12mm; }\n';
    html += '* { box-sizing: border-box; margin: 0; padding: 0; }\n';
    html += 'body { font-family: "Segoe UI", "Roboto", Arial, sans-serif; color: #202124; background: #fff; font-size: 10pt; line-height: 1.45; }\n';
    html += '.rh { background: linear-gradient(135deg, #1e3a8a, #1a56db); color: #fff; padding: 22px 30px; display: flex; align-items: center; justify-content: space-between; }\n';
    html += '.rh h1 { font-size: 18pt; font-weight: 800; }\n';
    html += '.rh .org { font-size: 9pt; opacity: 0.85; margin-top: 2px; }\n';
    html += '.rh .rt { text-align: right; }\n';
    html += '.rh .date { font-size: 8.5pt; opacity: 0.75; }\n';
    html += '.rh .pill { display: inline-block; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 5px 16px; font-weight: 700; font-size: 11pt; margin-top: 6px; }\n';
    html += '.rh .pill .g { color: #86efac; }\n';
    html += '.ts { display: flex; border: 1px solid #dadce0; border-top: none; background: #f8f9fa; margin-bottom: 20px; }\n';
    html += '.ts .c { flex: 1; padding: 12px 16px; border-right: 1px solid #dadce0; text-align: center; }\n';
    html += '.ts .c:last-child { border-right: none; }\n';
    html += '.ts .cl { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.6px; color: #5f6368; font-weight: 600; margin-bottom: 3px; }\n';
    html += '.ts .cv { font-size: 13pt; font-weight: 800; }\n';
    html += '.ts .cv.bl { color: #1a56db; } .ts .cv.or { color: #e37400; } .ts .cv.gn { color: #0f9d58; } .ts .cv.rd { color: #d93025; }\n';
    html += '.cnt { padding: 0 6px; }\n';
    html += '.sec { margin-bottom: 22px; page-break-inside: avoid; }\n';
    html += '.sb { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border-radius: 4px 4px 0 0; font-weight: 700; font-size: 10.5pt; color: #fff; }\n';
    html += '.sb .cnt2 { font-size: 8pt; font-weight: 500; opacity: 0.85; }\n';
    html += '.st { width: 100%; border-collapse: collapse; border: 1px solid #dadce0; border-top: none; }\n';
    html += '.st th { background: #f1f3f4; color: #3c4043; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 7px 12px; text-align: left; border: 1px solid #dadce0; border-top: none; }\n';
    html += '.st th.nc { text-align: center; width: 40px; } .st th.pc { text-align: right; width: 140px; }\n';
    html += '.st td { padding: 6px 12px; border: 1px solid #e8eaed; font-size: 9.5pt; }\n';
    html += '.st tr:nth-child(even) td { background: #f8f9fa; }\n';
    html += '.st td.nc { text-align: center; color: #80868b; font-size: 8.5pt; }\n';
    html += '.st td.pc { text-align: right; font-weight: 600; font-family: Consolas, "Courier New", monospace; }\n';
    html += '.tb { display: flex; justify-content: flex-end; align-items: center; padding: 8px 14px; border: 1px solid #dadce0; border-top: 2px solid; border-radius: 0 0 4px 4px; font-weight: 800; font-size: 10.5pt; }\n';
    html += '.tb .tl { margin-right: 8px; font-weight: 600; color: #5f6368; font-size: 9pt; }\n';
    html += '.tb .tv { font-family: Consolas, "Courier New", monospace; }\n';
    html += '.em { padding: 16px; text-align: center; color: #9aa0a6; font-style: italic; border: 1px solid #dadce0; border-top: none; border-radius: 0 0 4px 4px; font-size: 9pt; }\n';
    html += '.ss { margin-top: 25px; page-break-inside: avoid; }\n';
    html += '.ssb { background: linear-gradient(135deg, #1e3a8a, #1a56db); color: #fff; padding: 8px 14px; border-radius: 4px 4px 0 0; font-weight: 700; font-size: 10.5pt; }\n';
    html += '.sst { width: 100%; border-collapse: collapse; border: 1px solid #dadce0; border-top: none; }\n';
    html += '.sst tr { border-bottom: 1px solid #e8eaed; } .sst tr:last-child { border-bottom: none; }\n';
    html += '.sst td { padding: 10px 16px; font-size: 10pt; border: 1px solid #e8eaed; }\n';
    html += '.sst tr:nth-child(even) td { background: #f8f9fa; }\n';
    html += '.sst .si { width: 30px; text-align: center; font-size: 13pt; } .sst .sl { font-weight: 600; color: #3c4043; } .sst .sv { text-align: right; font-weight: 800; font-family: Consolas, "Courier New", monospace; font-size: 11pt; }\n';
    html += '.sst .dv td { background: #e8eaed; padding: 1px; }\n';
    html += '.sst .hl td { background: #fef7cd; }\n';
    html += '.sst .rr td { background: #e6f4ea; } .sst .rr.neg td { background: #fce8e6; }\n';
    html += '.rf { margin-top: 25px; padding-top: 10px; border-top: 1px solid #dadce0; display: flex; justify-content: space-between; color: #9aa0a6; font-size: 7.5pt; }\n';
    html += '</style></head><body>\n';

    // Header
    html += '<div class="rh"><div><h1>Prototyping Lab Financials</h1><div class="org">Faculty of Biotechnology, MSA University</div></div>';
    html += '<div class="rt"><div class="date">' + now + '</div><div class="pill">Total Received: <span class="g">' + fmt(TOTAL_RECEIVED) + '</span></div></div></div>\n';

    // Top summary bar
    html += '<div class="ts">';
    html += '<div class="c"><div class="cl">Total Received</div><div class="cv gn">' + fmt(TOTAL_RECEIVED) + '</div></div>';
    html += '<div class="c"><div class="cl">Total Spent</div><div class="cv or">' + fmt(spent) + '</div></div>';
    html += '<div class="c"><div class="cl">Remaining</div><div class="cv ' + (remaining >= 0 ? 'gn' : 'rd') + '">' + fmt(remaining) + '</div></div>';
    html += '<div class="c"><div class="cl">Transactions</div><div class="cv bl">' + (data.lab.length + data.uec.length + data.dr.length) + '</div></div>';
    html += '</div>\n<div class="cnt">\n';

    // Sections
    TABLE_IDS.forEach(function(id) {
      var items = data[id];
      var total = totalOf(id);
      var co = sectionColors[id];

      html += '<div class="sec"><div class="sb" style="background:' + co.hdr + '"><span>' + TABLE_LABELS[id] + '</span><span class="cnt2">' + items.length + ' transaction' + (items.length !== 1 ? 's' : '') + '</span></div>';

      if (items.length === 0) {
        html += '<div class="em">No transactions recorded</div>';
      } else {
        html += '<table class="st"><thead><tr><th class="nc">#</th><th>Item / Description</th><th class="pc">Amount (EGP)</th></tr></thead><tbody>';
        items.forEach(function(t, i) {
          html += '<tr><td class="nc">' + (i + 1) + '</td><td>' + escHtml(t.item) + '</td><td class="pc">' + fmt(t.price) + '</td></tr>';
        });
        html += '</tbody></table>';
        html += '<div class="tb" style="border-top-color:' + co.hdr + '; background:' + co.accent + '"><span class="tl">Total ' + TABLE_LABELS[id] + ':</span><span class="tv" style="color:' + co.hdr + '">' + fmt(total) + '</span></div>';
      }
      html += '</div>\n';
    });

    // Summary
    html += '<div class="ss"><div class="ssb">📊 Overall Financial Summary</div>';
    html += '<table class="sst">';
    html += '<tr><td class="si">💰</td><td class="sl">Total Received Funds</td><td class="sv" style="color:#0f9d58">' + fmt(TOTAL_RECEIVED) + '</td></tr>';
    html += '<tr class="dv"><td colspan="3"></td></tr>';
    html += '<tr><td class="si">🏗️</td><td class="sl">Prototyping Lab Financials</td><td class="sv" style="color:#1a56db">' + fmt(labT) + '</td></tr>';
    html += '<tr><td class="si">🏛️</td><td class="sl">UEC Financials</td><td class="sv" style="color:#7c3aed">' + fmt(uecT) + '</td></tr>';
    html += '<tr><td class="si">👨‍🏫</td><td class="sl">Dr. Ahmed Gomaa Financials</td><td class="sv" style="color:#0891b2">' + fmt(drT) + '</td></tr>';
    html += '<tr class="dv"><td colspan="3"></td></tr>';
    html += '<tr class="hl"><td class="si">📉</td><td class="sl" style="font-weight:800">Total Spent</td><td class="sv" style="color:#e37400; font-size:12pt">' + fmt(spent) + '</td></tr>';
    html += '<tr class="rr' + (remaining < 0 ? ' neg' : '') + '"><td class="si">' + (remaining >= 0 ? '✅' : '⚠️') + '</td><td class="sl" style="font-weight:800; font-size:11pt">Remaining Funds</td><td class="sv" style="color:' + (remaining >= 0 ? '#0f9d58' : '#d93025') + '; font-size:13pt">' + fmt(remaining) + '</td></tr>';
    html += '</table></div>\n';

    // Footer
    html += '<div class="rf"><span>Prototyping Lab Financials — Faculty of Biotechnology, MSA University</span><span>Generated: ' + now + '</span></div>';
    html += '</div></body></html>';
    return html;
  }

  // ── Excel Export ──
  function exportExcel() {
    const html = buildExportHTML();
    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Prototyping_Lab_Financials.xls';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Word Export ──
  function exportWord() {
    const html = buildExportHTML();
    const blob = new Blob(['\uFEFF' + html], { type: 'application/msword;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Prototyping_Lab_Financials.doc';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── PDF Export (via clean print window) ──
  function exportPDF() {
    const html = buildExportHTML();
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) { alert('Please allow pop-ups to export PDF.'); return; }
    printWin.document.write(html);
    printWin.document.close();
    printWin.onload = () => {
      setTimeout(() => {
        printWin.print();
      }, 300);
    };
    // Fallback if onload doesn't fire (some browsers)
    setTimeout(() => {
      try { printWin.print(); } catch(e) {}
    }, 800);
  }

  // ── Clear All ──
  function clearAll() {
    showConfirm(
      '⚠️ Clear All Data?',
      'This will permanently delete ALL transactions from ALL tables. This action cannot be undone!',
      () => {
        showConfirm(
          '🔴 Are you absolutely sure?',
          'All financial records will be permanently erased. Type "yes" won\'t be required, but this is your final chance to cancel.',
          () => {
            data = { lab: [], uec: [], dr: [] };
            saveData();
            renderAll();
          }
        );
      }
    );
  }

  // ── Helpers ──
  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Global Events ──
  function bindGlobalEvents() {
    // Search
    document.getElementById('search-input').addEventListener('input', applySearch);

    // File upload
    document.getElementById('modal-file').addEventListener('change', handleFileUpload);

    // Close modal on overlay click
    document.getElementById('tx-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('tx-modal')) closeModal();
    });

    // Lightbox close on overlay click
    document.getElementById('lightbox-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('lightbox-overlay') || e.target.classList.contains('lightbox-close')) closeLightbox();
    });

    // Confirm overlay click
    document.getElementById('confirm-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('confirm-overlay')) confirmNo();
    });

    // Keyboard: Escape closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeModal();
        confirmNo();
      }
    });

    // Save on Enter key in modal
    document.getElementById('modal-price').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveModal();
    });
  }

  // ── Public API ──
  window.PLF = {
    addTx: (tableId) => openModal(tableId),
    editTx: (tableId, index) => openModal(tableId, index),
    deleteTx: deleteTx,
    closeModal,
    saveModal,
    openLightbox,
    closeLightbox,
    confirmYes,
    confirmNo,
    removePreviewImg,
    sortBy,
    exportCSV,
    exportExcel,
    exportWord,
    exportPDF,
    selectCell,
    resetDefaults,
    clearAll
  };

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', init);
})();
