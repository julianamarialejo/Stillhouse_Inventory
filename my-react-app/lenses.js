// read category from ?cat=cameras (optional)
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat") || "cameras";

// category title
const categoryTitle = document.getElementById("categoryTitle");
categoryTitle.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);

// elements
const itemList = document.getElementById("itemList");

const unitNo = document.getElementById("unitNo");
const brand = document.getElementById("brand");
const model = document.getElementById("model");
const type = document.getElementById("type");
const statusPill = document.getElementById("statusPill");

const purchased = document.getElementById("purchased");
const completed = document.getElementById("completed");
const daysRented = document.getElementById("daysRented");
const price = document.getElementById("price");

const historyRows = document.getElementById("historyRows");

// Dropdown menu controls
const catMenuBtn = document.getElementById("catMenuBtn");
const catMenu = document.getElementById("catMenu");
const addItemBtn = document.getElementById("addItemBtn");
const editItemBtn = document.getElementById("editItemBtn");

function openMenu() {
  catMenu.classList.remove("hidden");
}
function closeMenu() {
  catMenu.classList.add("hidden");
}
function toggleMenu() {
  catMenu.classList.toggle("hidden");
}

catMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

// close when clicking outside
document.addEventListener("click", () => closeMenu());

// prevent click inside menu from closing immediately
catMenu.addEventListener("click", (e) => e.stopPropagation());

// actions (replace these later with modals / navigation)
addItemBtn.addEventListener("click", () => {
  closeMenu();
  alert("Add New Item (you can open a modal here)");
});

editItemBtn.addEventListener("click", () => {
  closeMenu();
  alert("Edit Item (edit selected item here)");
});

const items = [
  {
    id: "canon-ef-50",
    icon: "images/50mm.png",
    name: "50mm f/1.8",
    sub: "Canon lens",
    status: "Available",
    info: {
      unitNo: "L-001",
      brand: "Canon",
      model: "50mm f/1.8",
      type: "Prime Lens",
      purchased: "May, 2024",
      completed: "10",
      daysRented: "28",
      price: "₱300 / day",
    },
    history: [
      {
        days: "03",
        code: "#LR0101",
        date: "Mar 5 - Mar 7",
        status: "Completed",
        start: "2026-03-05",
        end: "2026-03-07"
      }
    ]
  }
];

let activeId = items[0].id;

function badgeClass(status){
  const s = status.toLowerCase();
  if (s.includes("avail")) return "good";
  if (s.includes("unavail")) return "bad";
  return "warn";
}

function statusClass(status){
  const s = status.toLowerCase();
  if (s.includes("avail")) return "";
  if (s.includes("unavail")) return "bad";
  return "warn";
}

function renderList(){
  itemList.innerHTML = "";

  items.forEach(it => {
    const row = document.createElement("div");
    row.className = "item-row" + (it.id === activeId ? " active" : "");

    row.innerHTML = `
      <div class="item-left">
        <div class="thumb">
          <img src="${it.icon}" alt="">
        </div>
        <div class="it-text">
          <p class="it-name">${it.name}</p>
          <p class="it-sub">${it.sub}</p>
        </div>
      </div>
      <div class="badge ${badgeClass(it.status)}">${it.status}</div>
    `;

    row.addEventListener("click", () => {
      activeId = it.id;
      renderList();
      renderInfo();
      renderHistory();
    });

    itemList.appendChild(row);
  });
}

function renderInfo(){
  const it = items.find(x => x.id === activeId);
  if(!it) return;

  unitNo.textContent = it.info.unitNo;
  brand.textContent = it.info.brand;
  model.textContent = it.info.model;
  type.textContent = it.info.type;

  statusPill.textContent = it.status;
  statusPill.className = "status-pill " + statusClass(it.status);

  purchased.textContent = it.info.purchased;
  completed.textContent = it.info.completed;
  daysRented.textContent = it.info.daysRented;
  price.textContent = it.info.price;
}

function renderHistory(){
  const it = items.find(x => x.id === activeId);
  if(!it) return;

  historyRows.innerHTML = "";

  it.history.forEach(h => {
    const tr = document.createElement("div");
    tr.className = "tr";

    const pill = h.status.toLowerCase().includes("cancel")
      ? `<div class="small-pill red">${h.status}</div>`
      : `<div class="small-pill blue">${h.status}</div>`;

    tr.innerHTML = `
      <div class="days">${h.days}</div>
      <div>
        <div class="detail-top">${h.code}</div>
        <div class="detail-sub">${h.date}</div>
      </div>
      ${pill}
    `;

    historyRows.appendChild(tr);
  });
}

/* Calendar: October 2025 (like screenshot) */
const calTitle = document.getElementById("calTitle");
const calDays = document.getElementById("calDays");
let calYear = 2025;
let calMonth = 9; // 0-based (9 = October)

function buildCalendar(){
  const monthNames = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];
  calTitle.textContent = `${monthNames[calMonth]} ${calYear}`;
  calDays.innerHTML = "";

  const first = new Date(calYear, calMonth, 1);
  const startDow = first.getDay(); // 0 Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // prev month filler
  const prevDays = new Date(calYear, calMonth, 0).getDate();
  for(let i=0;i<startDow;i++){
    const d = document.createElement("div");
    d.className = "day muted";
    d.textContent = String(prevDays - startDow + 1 + i);
    calDays.appendChild(d);
  }

  // month days
  for(let day=1; day<=daysInMonth; day++){
    const d = document.createElement("div");
    d.className = "day";

    // match screenshot highlight around 21-ish (we'll mark 21)
    if (calYear === 2025 && calMonth === 9 && day === 21){
      d.classList.add("today");
    }

    d.textContent = String(day);
    calDays.appendChild(d);
  }

  // next month filler (to complete rows nicely)
  const totalCells = startDow + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for(let i=1;i<=remaining;i++){
    const d = document.createElement("div");
    d.className = "day muted";
    d.textContent = String(i);
    calDays.appendChild(d);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => {
  calMonth--;
  if(calMonth < 0){ calMonth = 11; calYear--; }
  buildCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  calMonth++;
  if(calMonth > 11){ calMonth = 0; calYear++; }
  buildCalendar();
});

// initial render
renderList();
renderInfo();
renderHistory();
buildCalendar();
