// Yardımcılar
function toBin(n) { return n.toString(2).padStart(8, '0'); }
function toHex(n) { return n.toString(16).toUpperCase().padStart(2, '0'); }
function toOct(n) { return n.toString(8).padStart(3, '0'); }

function buildRow(ch, code) {
  const row = document.createElement("tr");

  if (code < 32 || code > 127) {
    const chCell = document.createElement("td");
    chCell.textContent = code < 32 ? "CTRL" : ch;
    row.appendChild(chCell);

    const errCell = document.createElement("td");
    errCell.colSpan = 4;
    errCell.style.color = "var(--error)";
    errCell.textContent = "Geçersiz ASCII (" + code + ")";
    row.appendChild(errCell);
  } else {
    const chCell = document.createElement("td");
    chCell.textContent = ch;
    row.appendChild(chCell);

    const decCell = document.createElement("td");
    decCell.textContent = code;
    row.appendChild(decCell);

    const binCell = document.createElement("td");
    binCell.innerHTML = '<span class="pill pill-bin">' + toBin(code) + '</span>';
    row.appendChild(binCell);

    const hexCell = document.createElement("td");
    hexCell.innerHTML = '<span class="pill pill-hex">' + toHex(code) + '</span>';
    row.appendChild(hexCell);

    const octCell = document.createElement("td");
    octCell.innerHTML = '<span class="pill pill-oct">' + toOct(code) + '</span>';
    row.appendChild(octCell);
  }

  return row;
}

// Metinden koda tablo
function convertText() {
  const text = document.getElementById("inputText").value;
  const tbody = document.getElementById("result");
  tbody.innerHTML = "";

  if (!text) {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Sonuçları görmek için yukarıya bir şeyler yazın ✍️";
    emptyRow.appendChild(cell);
    tbody.appendChild(emptyRow);
    return;
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    tbody.appendChild(buildRow(ch, ch.charCodeAt(0)));
  }
}

// Girilen değerin tabana göre geçerli olup olmadığını kontrol et
function isValidForBase(str, base) {
  const maps = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };
  return maps[base].test(str);
}

// Menülü: sayıdan harfe
function convertCode() {
  const val = document.getElementById("codeInput").value.trim();
  const base = parseInt(document.getElementById("baseSelect").value, 10);
  const out = document.getElementById("charResult");
  const copyBtn = document.getElementById("copyBtn");

  if (!val) {
    out.textContent = "";
    copyBtn.hidden = true;
    return;
  }
  if (!isValidForBase(val, base)) {
    out.textContent = "❌ Girilen değer seçilen tabana uygun değil.";
    out.style.color = "var(--error)";
    copyBtn.hidden = true;
    return;
  }

  const num = parseInt(val, base);
  if (isNaN(num) || num < 32 || num > 127) {
    out.textContent = "❌ Geçersiz ASCII aralığı (" + num + "). 32–127 olmalı.";
    out.style.color = "var(--error)";
    copyBtn.hidden = true;
  } else {
    const ch = String.fromCharCode(num);
    out.textContent = "✅ Karakter: " + ch +
      "  (Dec: " + num + ", Bin: " + toBin(num) + ", Hex: " + toHex(num) + ", Oct: " + toOct(num) + ")";
    out.style.color = "var(--success)";
    copyBtn.hidden = false;
    copyBtn.dataset.value = ch;
  }
}

async function copyResult() {
  const copyBtn = document.getElementById("copyBtn");
  const value = copyBtn.dataset.value || "";
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    const original = copyBtn.textContent;
    copyBtn.textContent = "✅";
    setTimeout(() => { copyBtn.textContent = original; }, 1200);
  } catch (err) {
    // Pano erişimi engellenmişse sessizce yok say
  }
}

// ASCII referans tablosu (32-127)
function buildReferenceTable() {
  const tbody = document.getElementById("refTable");
  const fragment = document.createDocumentFragment();
  for (let code = 32; code <= 127; code++) {
    const ch = code === 32 ? "SPACE" : code === 127 ? "DEL" : String.fromCharCode(code);
    fragment.appendChild(buildRow(ch, code));
  }
  tbody.appendChild(fragment);
}

function toggleReferenceTable() {
  const wrap = document.getElementById("refTableWrap");
  const btn = document.getElementById("toggleRefTable");
  const isHidden = wrap.hidden;
  wrap.hidden = !isHidden;
  btn.textContent = isHidden ? "Gizle" : "Göster";
  btn.setAttribute("aria-expanded", String(isHidden));
}

// Tema
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (err) { /* özel gezinti modu olabilir */ }
}

function initTheme() {
  let theme = "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved) {
      theme = saved;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch (err) { /* özel gezinti modu olabilir */ }
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  buildReferenceTable();
  convertText();

  document.getElementById("inputText").addEventListener("input", convertText);

  const codeInput = document.getElementById("codeInput");
  codeInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") convertCode();
  });

  document.getElementById("convertBtn").addEventListener("click", convertCode);
  document.getElementById("copyBtn").addEventListener("click", copyResult);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("toggleRefTable").addEventListener("click", toggleReferenceTable);
});
