// JavaScript logic for サブスクBOX (Subscription BOX)

// Category Display Maps
let USD_TO_JPY_RATE = 150; // 1ドル = 150円目安 (リアルタイムレートAPIで上書きされます)
let isRateRealtime = false; // 為替レートがAPIから正常取得されたかどうか

const CATEGORIES = {
  ai: { label: 'AI関係', color: '#a855f7', class: 'badge-ai' },
  music: { label: '音楽', color: '#22c55e', class: 'badge-music' },
  video: { label: '画像', color: '#ef4444', class: 'badge-video' },
  amazon: { label: 'アマゾン', color: '#eab308', class: 'badge-amazon' },
  other: { label: 'その他', color: '#06b6d4', class: 'badge-other' }
};

// Preset catalog data
const SUB_PRESETS = [
  // AI関係 (ai)
  { id: 'p_gemini', name: 'Gemini Advanced', category: 'ai', price: 2900, cycle: 'monthly', note: 'Googleの最先端AI / AI Premiumプラン' },
  { id: 'p_chatgpt', name: 'ChatGPT Plus', category: 'ai', price: 3000, cycle: 'monthly', note: 'AIアシスタント / $20相当' },
  { id: 'p_claude', name: 'Claude Pro', category: 'ai', price: 3000, cycle: 'monthly', note: '高性能AI / $20相当' },
  { id: 'p_copilot', name: 'GitHub Copilot', category: 'ai', price: 1500, cycle: 'monthly', note: '開発支援AI' },
  { id: 'p_midjourney', name: 'Midjourney (Standard)', category: 'ai', price: 4500, cycle: 'monthly', note: '画像生成AI / $30相当' },
  { id: 'p_perplexity', name: 'Perplexity Pro', category: 'ai', price: 3000, cycle: 'monthly', note: '対話型検索AI / $20相当' },
  { id: 'p_deepl', name: 'DeepL Pro (Starter)', category: 'ai', price: 1200, cycle: 'monthly', note: '高精度AI翻訳' },

  // 音楽 (music)
  { id: 'p_spotify', name: 'Spotify Premium', category: 'music', price: 980, cycle: 'monthly', note: '音楽聴き放題（スタンダード）' },
  { id: 'p_applemusic', name: 'Apple Music', category: 'music', price: 1080, cycle: 'monthly', note: '音楽ストリーミング（個人）' },
  { id: 'p_ytmusic', name: 'YouTube Music Premium', category: 'music', price: 1080, cycle: 'monthly', note: 'YouTube音楽専用' },
  { id: 'p_linemusic', name: 'LINE MUSIC', category: 'music', price: 1080, cycle: 'monthly', note: 'LINEスタンプ特典付き音楽プラン' },
  { id: 'p_amazonmusic', name: 'Amazon Music Unlimited', category: 'music', price: 1080, cycle: 'monthly', note: '高音質音楽聴き放題' },
  { id: 'p_awa', name: 'AWA (Standard)', category: 'music', price: 980, cycle: 'monthly', note: '日本最大級の配信数' },

  // 画像 (video - internally video, displayed as 画像)
  { id: 'p_netflix_s', name: 'Netflix Standard', category: 'video', price: 1490, cycle: 'monthly', note: '動画ストリーミング（HD画質）' },
  { id: 'p_netflix_p', name: 'Netflix Premium', category: 'video', price: 1980, cycle: 'monthly', note: '動画ストリーミング（4K画質）' },
  { id: 'p_ytpremium', name: 'YouTube Premium', category: 'video', price: 1280, cycle: 'monthly', note: '広告なし＆バックグラウンド再生' },
  { id: 'p_unext', name: 'U-NEXT', category: 'video', price: 2189, cycle: 'monthly', note: '動画配信＋毎月1200ポイント還元' },
  { id: 'p_disney', name: 'Disney+ Standard', category: 'video', price: 990, cycle: 'monthly', note: 'ディズニー・マーベル作品見放題' },
  { id: 'p_hulu', name: 'Hulu', category: 'video', price: 1026, cycle: 'monthly', note: '人気ドラマ・映画・バラエティ' },
  { id: 'p_abema', name: 'ABEMAプレミアム', category: 'video', price: 960, cycle: 'monthly', note: 'オリジナル番組・ドラマ見逃し配信' },
  { id: 'p_danime', name: 'dアニメストア', category: 'video', price: 550, cycle: 'monthly', note: '国内最大級のアニメ特化見放題' },
  { id: 'p_canva', name: 'Canva Pro', category: 'video', price: 1500, cycle: 'monthly', note: 'オンライン画像・デザイン編集ツール' },
  { id: 'p_dazn', name: 'DAZN Standard', category: 'video', price: 4200, cycle: 'monthly', note: 'スポーツ生中継・Jリーグ等' },

  // アマゾン (amazon)
  { id: 'p_amazon_m', name: 'Amazon Prime (月会費)', category: 'amazon', price: 600, cycle: 'monthly', note: 'お急ぎ便無料・Prime Video等' },
  { id: 'p_amazon_y', name: 'Amazon Prime (年会費)', category: 'amazon', price: 5900, cycle: 'annual', note: 'お急ぎ便無料・Prime Video等（お得）' },
  { id: 'p_kindle', name: 'Kindle Unlimited', category: 'amazon', price: 980, cycle: 'monthly', note: '200万冊以上の書籍・雑誌読み放題' },
  { id: 'p_audible', name: 'Amazon Audible', category: 'amazon', price: 1500, cycle: 'monthly', note: 'オーディオブック（聴く読書）' },

  // その他 (other)
  { id: 'p_switch_y', name: 'Nintendo Switch Online', category: 'other', price: 2400, cycle: 'annual', note: 'オンラインプレイ・ファミコン等' },
  { id: 'p_switch_plus_y', name: 'Switch Online + 追加パック', category: 'other', price: 4900, cycle: 'annual', note: 'メガドライブ・N64・追加DLC等' },
  { id: 'p_psplus_y', name: 'PlayStation Plus (Essential/年)', category: 'other', price: 6800, cycle: 'annual', note: '毎月のフリープレイ・マルチプレイ' },
  { id: 'p_psplus_ex_y', name: 'PlayStation Plus (Extra/年)', category: 'other', price: 11700, cycle: 'annual', note: 'ゲームカタログ400本以上が遊び放題' },
  { id: 'p_m365_m', name: 'Microsoft 365 Personal (月)', category: 'other', price: 1490, cycle: 'monthly', note: 'Officeアプリ＋1TBクラウド' },
  { id: 'p_m365_y', name: 'Microsoft 365 Personal (年)', category: 'other', price: 14900, cycle: 'annual', note: 'Officeアプリ＋1TBクラウド（お得）' },
  { id: 'p_adobe', name: 'Adobe Creative Cloud', category: 'other', price: 7780, cycle: 'monthly', note: 'Photoshop/Illustrator等全アプリ' },
  { id: 'p_icloud_50', name: 'iCloud+ (50GB)', category: 'other', price: 130, cycle: 'monthly', note: 'Appleデバイス用追加クラウド' },
  { id: 'p_icloud_200', name: 'iCloud+ (200GB)', category: 'other', price: 400, cycle: 'monthly', note: 'Appleファミリー共有対応ストレージ' },
  { id: 'p_google_100', name: 'Google One (100GB)', category: 'other', price: 250, cycle: 'monthly', note: 'Googleドライブ・フォト容量追加' },
  { id: 'p_dropbox', name: 'Dropbox Plus', category: 'other', price: 1500, cycle: 'monthly', note: '2TBオンラインストレージ' },
  { id: 'p_nikkei', name: '日本経済新聞 電子版', category: 'other', price: 4277, cycle: 'monthly', note: 'ビジネスの経済ニュース・速報' },
  { id: 'p_cookpad', name: 'クックパッド プレミアム', category: 'other', price: 308, cycle: 'monthly', note: '人気レシピ順検索・殿堂入りレシピ' },
  { id: 'p_radiko', name: 'Radiko プレミアム', category: 'other', price: 385, cycle: 'monthly', note: 'エリアフリーで全国のラジオ聴き放題' }
];

// Initial demo subscriptions for first load
const DEMO_SUBSCRIPTIONS = [
  { id: 'sub_1', name: 'Amazon Prime (年会費)', category: 'amazon', price: 5900, cycle: 'annual', note: 'Prime Video & 配送料無料', isActive: true },
  { id: 'sub_2', name: 'Netflix Standard', category: 'video', price: 1490, cycle: 'monthly', note: '高画質動画見放題', isActive: true },
  { id: 'sub_3', name: 'Spotify Premium', category: 'music', price: 980, cycle: 'monthly', note: '音楽ストリーミング', isActive: true },
  { id: 'sub_4', name: 'ChatGPT Plus', category: 'ai', price: 3000, cycle: 'monthly', note: 'GPT-4モデル利用', isActive: true }
];

// Global State
let subscriptions = [];
let currentFilter = 'all';
let searchQuery = '';
let presetSearchQuery = '';
let editTargetId = null;
let deleteTargetId = null;

// DOM Elements
const totalMonthlyEl = document.getElementById('total-monthly');
const totalAnnualEl = document.getElementById('total-annual');
const subscListEl = document.getElementById('subsc-cards');
const filterBarEl = document.getElementById('filter-bar');

// Add Form elements
const addModePresetBtn = document.getElementById('mode-preset');
const addModeCustomBtn = document.getElementById('mode-custom');
const addPresetArea = document.getElementById('add-preset-area');
const addCustomArea = document.getElementById('add-custom-area');
const presetsGrid = document.getElementById('presets-grid');
const customCategorySel = document.getElementById('custom-category');
const customCurrencySel = document.getElementById('custom-currency');
const customNameInput = document.getElementById('custom-name');
const customPriceInput = document.getElementById('custom-price');
const customCycleSel = document.getElementById('custom-cycle');
const customNoteInput = document.getElementById('custom-note');
const addForm = document.getElementById('add-subscription-form');

// Edit Modal elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-subscription-form');
const editIdInput = document.getElementById('edit-id');
const editNameInput = document.getElementById('edit-name');
const editCategorySel = document.getElementById('edit-category');
const editCurrencySel = document.getElementById('edit-currency');
const editPriceInput = document.getElementById('edit-price');
const editCycleSel = document.getElementById('edit-cycle');
const editNoteInput = document.getElementById('edit-note');

// JSON Backup elements
const fileInput = document.getElementById('import-file');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderPresets();
  renderFilters();
  updateUI();
  setupEventListeners();
  setupConfirmModal();
  
  // Fetch real-time accurate USD/JPY rate from public API
  fetchExchangeRate();
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Load data from localStorage
function loadData() {
  const data = localStorage.getItem('subscbox_subscriptions');
  if (data) {
    try {
      subscriptions = JSON.parse(data).map(item => {
        const currency = item.currency || 'jpy';
        const price = parseFloat(item.price) || 0;
        return {
          ...item,
          currency: currency,
          convertedPrice: item.convertedPrice || (currency === 'usd' ? price * USD_TO_JPY_RATE : price),
          isPinned: !!item.isPinned
        };
      });
    } catch (e) {
      console.error('Error parsing subscription data:', e);
      subscriptions = DEMO_SUBSCRIPTIONS.map(item => ({ ...item, currency: 'jpy', convertedPrice: item.price, isPinned: false }));
    }
  } else {
    // Populate demo data
    subscriptions = DEMO_SUBSCRIPTIONS.map(item => ({ ...item, currency: 'jpy', convertedPrice: item.price, isPinned: false }));
    saveData();
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('subscbox_subscriptions', JSON.stringify(subscriptions));
}

// Render subscription presets in select catalog
function renderPresets() {
  presetsGrid.innerHTML = '';
  
  const q = presetSearchQuery.toLowerCase().trim();
  const filteredPresets = SUB_PRESETS.filter(preset => {
    if (!q) return true;
    const cat = CATEGORIES[preset.category];
    return preset.name.toLowerCase().includes(q) || 
           (cat && cat.label.toLowerCase().includes(q));
  });
  
  if (filteredPresets.length === 0) {
    presetsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
        該当するサブスクが見つかりません。
      </div>
    `;
    return;
  }

  filteredPresets.forEach(preset => {
    const card = document.createElement('div');
    card.className = 'preset-chip';
    card.dataset.id = preset.id;
    
    const cat = CATEGORIES[preset.category];
    const cycleLabel = preset.cycle === 'monthly' ? '月額' : '年額';
    
    card.innerHTML = `
      <span class="preset-chip-name">${preset.name}</span>
      <span class="preset-chip-price">¥${preset.price.toLocaleString()} / ${cycleLabel}</span>
      <span class="preset-chip-badge ${cat.class}">${cat.label}</span>
    `;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      // Auto fill inputs behind the scenes just in case they switch modes,
      // or for submission.
      customNameInput.value = preset.name;
      customCategorySel.value = preset.category;
      customPriceInput.value = preset.price;
      customCycleSel.value = preset.cycle;
      customNoteInput.value = preset.note;
    });
    
    presetsGrid.appendChild(card);
  });
  
  // Select first preset by default
  if (presetsGrid.firstChild) {
    presetsGrid.firstChild.click();
  }
}

// Render dynamic category filter tabs
function renderFilters() {
  filterBarEl.innerHTML = '';
  
  // Add 'All' filter
  const allTab = document.createElement('button');
  allTab.className = `filter-tab ${currentFilter === 'all' ? 'active' : ''}`;
  allTab.textContent = 'すべて';
  allTab.addEventListener('click', () => setFilter('all'));
  filterBarEl.appendChild(allTab);
  
  // Add category filters
  Object.entries(CATEGORIES).forEach(([key, value]) => {
    const tab = document.createElement('button');
    tab.className = `filter-tab ${currentFilter === key ? 'active' : ''}`;
    tab.textContent = value.label;
    tab.addEventListener('click', () => setFilter(key));
    filterBarEl.appendChild(tab);
  });
}

function setFilter(filter) {
  currentFilter = filter;
  renderFilters();
  renderSubscriptionCards();
}

// Calculation logic
function calculateTotals() {
  let monthlyTotal = 0;
  let annualTotal = 0;
  
  subscriptions.forEach(sub => {
    if (!sub.isActive) return;
    
    const price = parseFloat(sub.convertedPrice) || 0;
    if (sub.cycle === 'monthly') {
      monthlyTotal += price;
      annualTotal += price * 12;
    } else {
      monthlyTotal += price / 12;
      annualTotal += price;
    }
  });
  
  return {
    monthly: Math.round(monthlyTotal),
    annual: Math.round(annualTotal)
  };
}

// Render dynamic Donut SVG Chart
function renderDonutChart() {
  const chartContainer = document.querySelector('.chart-panel');
  if (!chartContainer) return;
  
  // Calculate expenses per category (monthly terms)
  const categoryTotals = { ai: 0, music: 0, video: 0, amazon: 0, other: 0 };
  let grandTotal = 0;
  
  subscriptions.forEach(sub => {
    if (!sub.isActive) return;
    const price = parseFloat(sub.convertedPrice) || 0;
    const monthlyPrice = sub.cycle === 'monthly' ? price : price / 12;
    
    if (categoryTotals[sub.category] !== undefined) {
      categoryTotals[sub.category] += monthlyPrice;
      grandTotal += monthlyPrice;
    } else {
      categoryTotals.other += monthlyPrice;
      grandTotal += monthlyPrice;
    }
  });
  
  const svgContainer = document.querySelector('.chart-container');
  if (grandTotal === 0) {
    svgContainer.style.display = 'none';
    const noDataText = document.getElementById('chart-no-data');
    if (noDataText) noDataText.style.display = 'block';
    return;
  }
  
  svgContainer.style.display = 'block';
  const noDataText = document.getElementById('chart-no-data');
  if (noDataText) noDataText.style.display = 'none';
  
  // Update Center text
  document.getElementById('chart-center-value').textContent = `¥${Math.round(grandTotal).toLocaleString()}`;
  
  // Render SVG elements
  const donutSvg = svgContainer.querySelector('.donut-svg');
  // Clear old segments (keep ring and hole)
  const oldSegments = donutSvg.querySelectorAll('.donut-segment');
  oldSegments.forEach(el => el.remove());
  
  // Circumference: 2 * PI * R. R=40, C=251.327
  const R = 40;
  const C = 2 * Math.PI * R;
  let accumulatedPercent = 0;
  
  // Legend numbers updating
  const legendGrid = document.querySelector('.chart-legend');
  legendGrid.innerHTML = '';
  
  Object.entries(categoryTotals).forEach(([catKey, catValue]) => {
    if (catValue === 0) return;
    
    const percentage = (catValue / grandTotal) * 100;
    const strokeDashArray = `${(percentage * C) / 100} ${C}`;
    const strokeDashOffset = -((accumulatedPercent * C) / 100);
    
    // Create Circle segment
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'donut-segment');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', R.toString());
    circle.setAttribute('stroke', CATEGORIES[catKey].color);
    circle.setAttribute('stroke-dasharray', strokeDashArray);
    circle.setAttribute('stroke-dashoffset', strokeDashOffset.toString());
    
    donutSvg.appendChild(circle);
    accumulatedPercent += percentage;
    
    // Add to Dynamic Legend
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background-color: ${CATEGORIES[catKey].color}"></div>
      <div>
        <span style="font-weight: 600;">${CATEGORIES[catKey].label}</span>
        <span style="color: var(--text-secondary); font-size: 0.75rem;">${Math.round(percentage)}%</span>
      </div>
    `;
    legendGrid.appendChild(legendItem);
  });
}

// Render dynamic lists of subscriptions
function renderSubscriptionCards() {
  subscListEl.innerHTML = '';
  
  const filtered = subscriptions.filter(sub => {
    // 1. Category Filter
    const matchesCategory = currentFilter === 'all' || sub.category === currentFilter;
    
    // 2. Search Query Filter (Matches service name, category label, price/fee, or note)
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    
    const catLabel = CATEGORIES[sub.category]?.label || '';
    const priceStr = sub.price.toString();
    const matchesSearch = 
      sub.name.toLowerCase().includes(q) ||
      catLabel.toLowerCase().includes(q) ||
      priceStr.includes(q) ||
      (sub.note && sub.note.toLowerCase().includes(q));
      
    return matchesCategory && matchesSearch;
  });
  
  // Sort pinned first, preserving stable index array order
  filtered.sort((a, b) => {
    const aPinned = a.isPinned ? 1 : 0;
    const bPinned = b.isPinned ? 1 : 0;
    return bPinned - aPinned; // Pinned comes first
  });
  
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state animate-fade-in';
    empty.innerHTML = `
      <div class="empty-state-icon">
        <i data-lucide="package-open"></i>
      </div>
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 600; color: white;">サブスクが見つかりません</h3>
        <p style="font-size: 0.85rem; margin-top: 0.25rem;">上のフォームから新しいサブスクを追加しましょう！</p>
      </div>
    `;
    subscListEl.appendChild(empty);
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  
  filtered.forEach(sub => {
    const card = document.createElement('div');
    card.className = `glass-panel subsc-card animate-fade-in ${!sub.isActive ? 'paused' : ''} ${sub.isPinned ? 'pinned' : ''}`;
    card.style.setProperty('--cat-color', CATEGORIES[sub.category].color);
    
    const cat = CATEGORIES[sub.category];
    const cycleText = sub.cycle === 'monthly' ? '月額' : '年額';
    
    card.innerHTML = `
      <div class="card-top" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
        <div class="card-service-info">
          <span class="card-service-name" style="display: flex; align-items: center; gap: 0.35rem;">
            ${sub.isPinned ? `<i data-lucide="pin" style="color: var(--color-ai); width: 14px; height: 14px; fill: var(--color-ai); transform: rotate(45deg);"></i>` : ''}
            ${escapeHTML(sub.name)}
          </span>
          <span class="card-category-badge ${cat.class}">${cat.label}</span>
        </div>
        <div class="card-reorder-controls" style="display: flex; gap: 0.25rem; align-items: center;">
          <button class="icon-btn pin-toggle-btn ${sub.isPinned ? 'active' : ''}" data-id="${sub.id}" title="${sub.isPinned ? 'ピン留め解除' : 'ピン留め'}" style="width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0;">
            <i data-lucide="pin" style="width: 11px; height: 11px;"></i>
          </button>
          <button class="icon-btn move-up-btn" data-id="${sub.id}" title="上に移動" style="width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0;">
            <i data-lucide="arrow-up" style="width: 11px; height: 11px;"></i>
          </button>
          <button class="icon-btn move-down-btn" data-id="${sub.id}" title="下に移動" style="width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0;">
            <i data-lucide="arrow-down" style="width: 11px; height: 11px;"></i>
          </button>
        </div>
      </div>
      <div class="card-middle">
        <div class="card-price" style="display: block;">
          <div style="display: flex; align-items: baseline; gap: 0.25rem;">
            ${sub.currency === 'usd' ? `$${parseInt(sub.price).toLocaleString()}` : `¥${parseInt(sub.price).toLocaleString()}`}<span>/ ${cycleText}</span>
          </div>
          ${sub.currency === 'usd' ? `<span style="font-size: 0.75rem; font-weight: 500; color: var(--color-ai); display: block; margin-top: 0.25rem;">(約¥${Math.round(sub.convertedPrice).toLocaleString()})</span>` : ''}
        </div>
        ${sub.note ? `<div class="card-notes">${escapeHTML(sub.note)}</div>` : ''}
      </div>
      <div class="card-bottom">
        <label class="switch-label">
          <span class="switch">
            <input type="checkbox" ${sub.isActive ? 'checked' : ''} data-id="${sub.id}" class="status-toggle">
            <span class="slider"></span>
          </span>
          <span>${sub.isActive ? '有効' : '停止中'}</span>
        </label>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm edit" data-id="${sub.id}" title="修正">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>修正
          </button>
          <button class="btn btn-danger btn-sm delete" data-id="${sub.id}" title="削除">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>削除
          </button>
        </div>
      </div>
    `;
    
    // Attach Event Listeners
    // Toggle active state
    const toggle = card.querySelector('.status-toggle');
    toggle.addEventListener('change', (e) => {
      toggleSubscriptionStatus(sub.id, e.target.checked);
    });
    
    // Edit action
    const editBtn = card.querySelector('.edit');
    editBtn.addEventListener('click', () => {
      openEditModal(sub.id);
    });
    
    // Delete action
    const deleteBtn = card.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
      deleteSubscription(sub.id);
    });

    // Pin Toggle Action
    const pinToggleBtn = card.querySelector('.pin-toggle-btn');
    pinToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePinStatus(sub.id);
    });

    // Move Up Action
    const moveUpBtn = card.querySelector('.move-up-btn');
    moveUpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moveSubscription(sub.id, 'up');
    });

    // Move Down Action
    const moveDownBtn = card.querySelector('.move-down-btn');
    moveDownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moveSubscription(sub.id, 'down');
    });
    
    subscListEl.appendChild(card);
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Update totals on Dashboard
function updateUI() {
  const totals = calculateTotals();
  totalMonthlyEl.textContent = `¥${totals.monthly.toLocaleString()}`;
  totalAnnualEl.textContent = `¥${totals.annual.toLocaleString()}`;
  
  renderSubscriptionCards();
  renderDonutChart();
}

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Setup Event Listeners
function setupEventListeners() {
  // Search bar input listener
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderSubscriptionCards();
    });
  }

  // Preset Catalog search input listener
  const presetSearchInput = document.getElementById('preset-search-input');
  if (presetSearchInput) {
    presetSearchInput.addEventListener('input', (e) => {
      presetSearchQuery = e.target.value;
      renderPresets();
    });
  }
  
  // Google search price button in custom form
  const btnWebSearchPrice = document.getElementById('btn-web-search-price');
  if (btnWebSearchPrice) {
    btnWebSearchPrice.addEventListener('click', () => {
      const serviceName = customNameInput.value.trim();
      const query = serviceName ? `${serviceName} 料金` : 'サブスクリプション 料金';
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    });
  }
  
  // Google search price button in edit modal form
  const btnEditWebSearchPrice = document.getElementById('btn-edit-web-search-price');
  if (btnEditWebSearchPrice) {
    btnEditWebSearchPrice.addEventListener('click', () => {
      const serviceName = editNameInput.value.trim();
      const query = serviceName ? `${serviceName} 料金` : 'サブスクリプション 料金';
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    });
  }

  // Toggle forms between preset catalog and custom handwritten input
  addModePresetBtn.addEventListener('click', () => {
    addModePresetBtn.classList.add('active');
    addModeCustomBtn.classList.remove('active');
    addPresetArea.style.display = 'block';
    addCustomArea.style.display = 'none';
    
    // Trigger first preset selected trigger to fill custom input backing fields
    const selectedPreset = presetsGrid.querySelector('.preset-chip.selected');
    if (selectedPreset) {
      selectedPreset.click();
    }
  });
  
  addModeCustomBtn.addEventListener('click', () => {
    addModeCustomBtn.classList.add('active');
    addModePresetBtn.classList.remove('active');
    addPresetArea.style.display = 'none';
    addCustomArea.style.display = 'block';
    
    // Clear standard form inputs to allow completely custom entries
    customNameInput.value = '';
    customPriceInput.value = '';
    customNoteInput.value = '';
  });
  
  // Add new subscription submission
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isPresetMode = addModePresetBtn.classList.contains('active');
    let name, category, price, cycle, note, currency, convertedPrice;
    
    if (isPresetMode) {
      const selectedPreset = presetsGrid.querySelector('.preset-chip.selected');
      if (!selectedPreset) {
        alert('プリセットを選択してください。');
        return;
      }
      const presetId = selectedPreset.dataset.id;
      const preset = SUB_PRESETS.find(p => p.id === presetId);
      
      name = preset.name;
      category = preset.category;
      price = preset.price;
      cycle = preset.cycle;
      note = preset.note;
      currency = 'jpy';
      convertedPrice = price;
    } else {
      name = customNameInput.value.trim();
      category = customCategorySel.value;
      price = parseInt(customPriceInput.value);
      cycle = customCycleSel.value;
      note = customNoteInput.value.trim();
      currency = customCurrencySel.value;
      convertedPrice = currency === 'usd' ? price * USD_TO_JPY_RATE : price;
      
      if (!name) {
        alert('サービス名を入力してください。');
        return;
      }
      if (isNaN(price) || price < 0) {
        alert('有効な料金を入力してください。');
        return;
      }
    }
    
    const isPinned = !isPresetMode && document.getElementById('custom-pinned').checked;
    const newSub = {
      id: 'sub_' + Date.now(),
      name,
      category,
      price,
      cycle,
      note,
      currency,
      convertedPrice,
      isActive: true,
      isPinned: isPinned
    };
    
    subscriptions.push(newSub);
    saveData();
    updateUI();
    
    // Clear form if in custom mode
    if (!isPresetMode) {
      customNameInput.value = '';
      customPriceInput.value = '';
      customNoteInput.value = '';
      customCurrencySel.value = 'jpy';
      document.getElementById('custom-usd-note').style.display = 'none';
      document.getElementById('custom-pinned').checked = false;
    }
    
    // Visual cue
    showToast('サブスクリプションを追加しました');
  });
  
  // Close Modal trigger
  document.getElementById('modal-close-btn').addEventListener('click', closeEditModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeEditModal);
  
  // Modal Delete trigger
  document.getElementById('modal-delete-btn').addEventListener('click', () => {
    const id = editIdInput.value;
    deleteSubscription(id);
    closeEditModal();
  });
  
  // Handle edit submission
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = editIdInput.value;
    const name = editNameInput.value.trim();
    const category = editCategorySel.value;
    const price = parseInt(editPriceInput.value);
    const cycle = editCycleSel.value;
    const note = editNoteInput.value.trim();
    const currency = editCurrencySel.value;
    const convertedPrice = currency === 'usd' ? price * USD_TO_JPY_RATE : price;
    const isPinned = document.getElementById('edit-pinned').checked;
    
    if (!name) {
      alert('サービス名を入力してください。');
      return;
    }
    if (isNaN(price) || price < 0) {
      alert('有効な料金を入力してください。');
      return;
    }
    
    const index = subscriptions.findIndex(sub => sub.id === id);
    if (index !== -1) {
      subscriptions[index] = {
        ...subscriptions[index],
        name,
        category,
        price,
        cycle,
        note,
        currency,
        convertedPrice,
        isPinned
      };
      
      saveData();
      updateUI();
      closeEditModal();
      showToast('変更を保存しました');
    }
  });

  // Currency select change listeners to show/hide USD conversion notes
  if (customCurrencySel) {
    customCurrencySel.addEventListener('change', (e) => {
      document.getElementById('custom-usd-note').style.display = e.target.value === 'usd' ? 'block' : 'none';
    });
  }
  
  if (editCurrencySel) {
    editCurrencySel.addEventListener('change', (e) => {
      document.getElementById('edit-usd-note').style.display = e.target.value === 'usd' ? 'block' : 'none';
    });
  }
  
  // Export backup data
  document.getElementById('btn-export').addEventListener('click', exportData);
  
  // Import backup data trigger
  fileInput.addEventListener('change', importData);

  // Initialize Calculators
  initCalculator('btn-custom-calc', 'custom-calc-popover', 'btn-custom-calc-apply', 'custom-price');
  initCalculator('btn-edit-calc', 'edit-calc-popover', 'btn-edit-calc-apply', 'edit-price');
}

// CRUD Operations logic
function toggleSubscriptionStatus(id, isActive) {
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index !== -1) {
    subscriptions[index].isActive = isActive;
    saveData();
    updateUI();
    showToast(isActive ? 'サブスクを再開しました' : 'サブスクを一時停止しました');
  }
}

function deleteSubscription(id) {
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) return;
  
  deleteTargetId = id;
  
  const modalText = document.getElementById('confirm-modal-text');
  if (modalText) {
    modalText.innerHTML = `<strong>${escapeHTML(sub.name)}</strong> を削除してよろしいですか？<br><span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">この操作は取り消せません。</span>`;
  }
  
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) {
    confirmModal.classList.add('active');
  }
}

function executeDelete(id) {
  subscriptions = subscriptions.filter(sub => sub.id !== id);
  saveData();
  updateUI();
  showToast('サブスクリプションを削除しました');
}

function setupConfirmModal() {
  const confirmModal = document.getElementById('confirm-modal');
  const cancelBtn = document.getElementById('confirm-cancel-btn');
  const okBtn = document.getElementById('confirm-ok-btn');
  
  if (!confirmModal || !cancelBtn || !okBtn) return;
  
  cancelBtn.addEventListener('click', () => {
    confirmModal.classList.remove('active');
    deleteTargetId = null;
  });
  
  okBtn.addEventListener('click', () => {
    if (deleteTargetId) {
      executeDelete(deleteTargetId);
    }
    confirmModal.classList.remove('active');
    deleteTargetId = null;
  });
}

// Pinning and Reordering features
function togglePinStatus(id) {
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index !== -1) {
    subscriptions[index].isPinned = !subscriptions[index].isPinned;
    saveData();
    updateUI();
    showToast(subscriptions[index].isPinned ? '最上部にピン留めしました' : 'ピン留めを解除しました');
  }
}

function moveSubscription(id, direction) {
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index === -1) return;
  
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= subscriptions.length) return;
  
  // Swap
  const temp = subscriptions[index];
  subscriptions[index] = subscriptions[targetIndex];
  subscriptions[targetIndex] = temp;
  
  saveData();
  updateUI();
  showToast(direction === 'up' ? '位置を上に移動しました' : '位置を下に移動しました');
}

// Edit Modal Handlers
function openEditModal(id) {
  const sub = subscriptions.find(sub => sub.id === id);
  if (!sub) return;
  
  editIdInput.value = sub.id;
  editNameInput.value = sub.name;
  editCategorySel.value = sub.category;
  editPriceInput.value = sub.price;
  editCycleSel.value = sub.cycle;
  editNoteInput.value = sub.note || '';
  
  // Currency and USD note sync
  const currency = sub.currency || 'jpy';
  editCurrencySel.value = currency;
  document.getElementById('edit-usd-note').style.display = currency === 'usd' ? 'block' : 'none';
  
  document.getElementById('edit-pinned').checked = !!sub.isPinned;
  
  editModal.classList.add('active');
}

function closeEditModal() {
  editModal.classList.remove('active');
}

// Export subscriptions as JSON
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subscriptions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `subsc_box_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import subscriptions from JSON
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported)) {
        // Validate each item simply
        const valid = imported.every(item => item.name && item.category && item.price !== undefined);
        if (valid) {
          subscriptions = imported;
          saveData();
          updateUI();
          showToast('データを正常にインポートしました');
        } else {
          alert('ファイルの形式が正しくありません。');
        }
      } else {
        alert('ファイルの形式が正しくありません。');
      }
    } catch (err) {
      alert('ファイルの読み込みに失敗しました。');
    }
  };
  reader.readAsText(file);
}

// Notification Toast logic
function showToast(message) {
  // Remove existing toast if any
  const oldToast = document.querySelector('.toast');
  if (oldToast) oldToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'glass-panel toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--color-active);
    z-index: 2000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
  
  toast.innerHTML = `<i data-lucide="check-circle-2" style="color: var(--color-active); width: 18px; height: 18px;"></i> ${message}`;
  document.body.appendChild(toast);
  
  if (window.lucide) window.lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Inline Calculator utility function
function initCalculator(toggleBtnId, popoverId, applyBtnId, targetInputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const popover = document.getElementById(popoverId);
  if (!toggleBtn || !popover) return;
  
  const display = popover.querySelector('.calc-display');
  const applyBtn = document.getElementById(applyBtnId);
  const targetInput = document.getElementById(targetInputId);
  
  let currentExpression = '';
  
  // Toggle calculator visibility
  toggleBtn.addEventListener('click', () => {
    const isHidden = popover.style.display === 'none';
    popover.style.display = isHidden ? 'block' : 'none';
    toggleBtn.classList.toggle('active', isHidden);
    if (isHidden) {
      currentExpression = '';
      display.textContent = '0';
    }
  });
  
  // Add click handlers for calculator buttons
  popover.querySelectorAll('.calc-grid button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission inside form!
      const val = btn.dataset.val;
      
      if (val === 'C') {
        currentExpression = '';
        display.textContent = '0';
      } else if (val === 'back') {
        currentExpression = currentExpression.slice(0, -1);
        display.textContent = currentExpression || '0';
      } else if (val === '=') {
        try {
          if (currentExpression) {
            // Sanitize mathematical expression to only allow 0-9, +, -, *, /, .
            const sanitized = currentExpression.replace(/[^0-9+\-*/.]/g, '');
            const result = new Function(`return ${sanitized}`)();
            if (result === undefined || isNaN(result) || !isFinite(result)) {
              display.textContent = 'Error';
            } else {
              const roundedResult = Math.round(result * 100) / 100;
              display.textContent = roundedResult.toString();
              currentExpression = roundedResult.toString();
            }
          }
        } catch (err) {
          display.textContent = 'Error';
        }
      } else {
        const lastChar = currentExpression.slice(-1);
        const operators = ['+', '-', '*', '/'];
        if (operators.includes(val) && operators.includes(lastChar)) {
          currentExpression = currentExpression.slice(0, -1) + val;
        } else {
          currentExpression += val;
        }
        display.textContent = currentExpression;
      }
    });
  });
  
  // Apply calculated value to form input
  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      const valText = display.textContent;
      if (valText && valText !== 'Error') {
        const numericVal = Math.round(parseFloat(valText));
        if (!isNaN(numericVal) && numericVal >= 0) {
          targetInput.value = numericVal;
        }
      }
    } catch(err) {}
    
    popover.style.display = 'none';
    toggleBtn.classList.remove('active');
  });
}

// Fetch accurate USD/JPY exchange rate from public API
async function fetchExchangeRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.rates && data.rates.JPY) {
      USD_TO_JPY_RATE = Math.round(data.rates.JPY * 100) / 100;
      isRateRealtime = true;
      console.log(`Fetched real-time USD/JPY rate: ${USD_TO_JPY_RATE}`);
    }
  } catch (err) {
    console.warn('Failed to fetch real-time exchange rate, using fallback rate of 150 JPY.', err);
    isRateRealtime = false;
  } finally {
    updateExchangeRateUI();
  }
}

function updateExchangeRateUI() {
  const customNote = document.getElementById('custom-usd-note');
  const editNote = document.getElementById('edit-usd-note');
  const rateDisplay = document.getElementById('exchange-rate-display');
  
  const statusLabel = isRateRealtime ? 'リアルタイム' : '目安レート';
  const rateStr = `※ 1ドル ＝ ${USD_TO_JPY_RATE.toLocaleString()}円（${statusLabel}）で円換算します。`;
  
  if (customNote) customNote.textContent = rateStr;
  if (editNote) editNote.textContent = rateStr;
  
  // Update header exchange rate badge
  if (rateDisplay) {
    rateDisplay.style.display = 'inline-flex';
    rateDisplay.innerHTML = `
      <i data-lucide="globe"></i>
      <span>1$ = ¥${USD_TO_JPY_RATE.toFixed(2)} <span style="font-size: 0.65rem; color: var(--text-secondary); font-weight: normal;">(${statusLabel})</span></span>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
  
  // Update converted prices for all active USD subscriptions
  subscriptions.forEach(sub => {
    if (sub.currency === 'usd') {
      sub.convertedPrice = sub.price * USD_TO_JPY_RATE;
    }
  });
  saveData();
  updateUI();
}
