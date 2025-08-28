
const state = {
  sales: [],
  stock: []
};

function saveData() {
  localStorage.setItem('sales', JSON.stringify(state.sales));
  localStorage.setItem('stock', JSON.stringify(state.stock));
}
function loadData() {
  try {
    state.sales = JSON.parse(localStorage.getItem('sales')) || [];
    state.stock = JSON.parse(localStorage.getItem('stock')) || [];
  } catch (e) {
    state.sales = [];
    state.stock = [];
  }
}

function showScreen(id) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.remove('hidden');

  if (id === 'stockScreen') renderStock();
  if (id === 'salesScreen') renderSales();
  if (id === 'reportsScreen') renderReports();
}

function renderSales() {
  const ul = document.getElementById('salesList');
  if (!ul) return;
  ul.innerHTML = state.sales.length === 0
    ? '<li>Nenhuma venda registrada.</li>'
    : state.sales.map(s => `<li>${escapeHTML(s.product)} - ${s.qty} un. (${s.date})</li>`).join('');
}
function renderStock() {
  const ul = document.getElementById('stockList');
  if (!ul) return;
  ul.innerHTML = state.stock.length === 0
    ? '<li>Nenhum item em estoque.</li>'
    : state.stock.map(s => `<li>${escapeHTML(s.product)} - ${s.qty} un.</li>`).join('');
}
function renderReports() {
  const rSales = document.getElementById('reportSales');
  const rStock = document.getElementById('reportStock');
  if (rSales) rSales.innerHTML = state.sales.length
    ? state.sales.map(s => `<li>${escapeHTML(s.product)} - ${s.qty} un. (${s.date})</li>`).join('')
    : '<li>Sem vendas registradas.</li>';
  if (rStock) rStock.innerHTML = state.stock.length
    ? state.stock.map(s => `<li>${escapeHTML(s.product)} - ${s.qty} un.</li>`).join('')
    : '<li>Sem estoque disponível.</li>';
}

function addSale() {
  const productEl = document.getElementById('saleProduct');
  const qtyEl = document.getElementById('saleQty');
  const product = (productEl?.value || '').trim();
  const qty = parseInt(qtyEl?.value || '0', 10);

  if (!product || !Number.isFinite(qty) || qty <= 0) {
    alert('Preencha produto e quantidade válidos.');
    return;
  }

  const item = state.stock.find(x => x.product.toLowerCase() === product.toLowerCase());
  if (!item || item.qty < qty) {
    alert('Estoque insuficiente para esta venda.');
    return;
  }
  item.qty -= qty;
  state.sales.push({ product, qty, date: new Date().toLocaleString() });

  saveData();
  productEl.value = '';
  qtyEl.value = '';
  renderSales();
  renderStock();
}

function addStock() {
  const productEl = document.getElementById('stockProduct');
  const qtyEl = document.getElementById('stockQty');
  const product = (productEl?.value || '').trim();
  const qty = parseInt(qtyEl?.value || '0', 10);

  if (!product || !Number.isFinite(qty) || qty <= 0) {
    alert('Preencha produto e quantidade válidos.');
    return;
  }

  const item = state.stock.find(x => x.product.toLowerCase() === product.toLowerCase());
  if (item) item.qty += qty;
  else state.stock.push({ product, qty });

  saveData();
  productEl.value = '';
  qtyEl.value = '';
  renderStock();
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[s])
  );
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('loginBtn')?.addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('logoutBtn')?.addEventListener('click', () => showScreen('loginScreen'));
  document.getElementById('toSalesBtn')?.addEventListener('click', () => showScreen('salesScreen'));
  document.getElementById('toStockBtn')?.addEventListener('click', () => showScreen('stockScreen'));
  document.getElementById('toReportsBtn')?.addEventListener('click', () => showScreen('reportsScreen'));
  document.getElementById('backFromSalesBtn')?.addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('backFromStockBtn')?.addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('backFromReportsBtn')?.addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('addSaleBtn')?.addEventListener('click', addSale);
  document.getElementById('addStockBtn')?.addEventListener('click', addStock);

  showScreen('loginScreen');

  // Partículas
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 133, density: { enable: true, value_area: 710 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, out_mode: "out" }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } },
      },
      retina_detect: false
    });
  }

  // Stats
  try {
    const stats = new Stats();
    stats.showPanel(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    const count_particles = document.querySelector('.js-count-particles');
    function update() {
      stats.begin();
      stats.end();
      if (window.pJSDom?.[0]?.pJS?.particles?.array) {
        count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
      }
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  } catch (e) {}
});
