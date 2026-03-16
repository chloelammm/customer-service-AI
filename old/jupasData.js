// jupasData.js
let jupasData = [];

async function loadJupasData() {
  if (jupasData.length > 0) return jupasData;
  const res = await fetch('Copy of RP-Formula (11Mar) - jups_prog26_27.csv'); // update path if different
  const text = await res.text();
  const rows = text.split('\n').filter(r => r.trim() !== '').map(r => r.split(','));
  const header = rows[0].map(h => h.trim().toLowerCase());
  jupasData = rows.slice(1).map(r => {
    const obj = {};
    header.forEach((h, i) => obj[h] = (r[i] || '').trim());
    return obj;
  });
  return jupasData;
}

function normalize(str) {
  return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

async function findCourse(query) {
  const data = await loadJupasData();
  const q = normalize(query);

  // try by code
  let byCode = data.find(row => normalize(row.code) === q);
  if (byCode) return byCode;

  // try by exact programme name
  let byName = data.find(row => normalize(row.programme_name) === q);
  if (byName) return byName;

  // partial name match
  let partial = data.find(row => normalize(row.programme_name).includes(q));
  return partial || null;
}

export { findCourse };
