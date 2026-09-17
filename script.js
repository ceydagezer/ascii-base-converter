// Yardımcılar
function toBin(n) { return n.toString(2).padStart(8, '0'); }
function toHex(n) { return n.toString(16).toUpperCase().padStart(2, '0'); }
function toOct(n) { return n.toString(8).padStart(3, '0'); }

// Metinden koda tablo
function convertText() {
  const text = document.getElementById("inputText").value;
  const tbody = document.getElementById("result");
  tbody.innerHTML = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    const row = document.createElement("tr");

    if (code < 32 || code > 127) {
      const chCell = document.createElement("td");
      chCell.textContent = code < 32 ? "CTRL" : ch;
      row.appendChild(chCell);

      const errCell = document.createElement("td");
      errCell.colSpan = 4;
      errCell.style.color = "red";
      errCell.textContent = "Geçersiz ASCII (" + code + ")";
      row.appendChild(errCell);
    } else {
      const values = [ch, code, toBin(code), toHex(code), toOct(code)];
      for (const val of values) {
        const cell = document.createElement("td");
        cell.textContent = val;
        row.appendChild(cell);
      }
    }

    tbody.appendChild(row);
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

  if (!val) {
    out.textContent = "";
    return;
  }
  if (!isValidForBase(val, base)) {
    out.textContent = "❌ Girilen değer seçilen tabana uygun değil.";
    out.style.color = "red";
    return;
  }

  const num = parseInt(val, base);
  if (isNaN(num) || num < 32 || num > 127) {
    out.textContent = "❌ Geçersiz ASCII aralığı (" + num + "). 32–127 olmalı.";
    out.style.color = "red";
  } else {
    out.textContent = "✅ Karakter: " + String.fromCharCode(num) +
      "  (Dec: " + num + ", Bin: " + toBin(num) + ", Hex: " + toHex(num) + ", Oct: " + toOct(num) + ")";
    out.style.color = "green";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inputText").addEventListener("input", convertText);

  const codeInput = document.getElementById("codeInput");
  codeInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") convertCode();
  });

  document.getElementById("convertBtn").addEventListener("click", convertCode);
});
