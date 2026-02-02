const data = [
  { id:"cameras", icon:"icons/camera.png", name:"Cameras", desc:"Mirrorless, DSLR, and cinema camera units." },
  { id:"lenses", icon:"icons/lense.png", name:"Lenses", desc:"Lenses for wide, telephoto, macro, and focused shots." },
  { id:"tripods", icon:"icons/tripod.png", name:"Tripods", desc:"Support gear including tripods, stabilizers, mounts, and essential add-ons." },
  { id:"printer", icon:"icons/printer.png", name:"Printer", desc:"Full instant wide printer." },
  { id:"accessories", icon:"icons/accessories.png", name:"Accessories", desc:"Essential tools such as batteries, chargers, filters, and mounting gear." },
];

let selected = null;

const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");

/* modal hooks (optional) */
const modal = document.getElementById("modal");
const addNewBtn = document.getElementById("addNewBtn");
const closeModal = document.getElementById("closeModal");
const cancel = document.getElementById("cancel");
const form = document.getElementById("form");
const nameEl = document.getElementById("name");
const descEl = document.getElementById("desc");
const iconEl = document.getElementById("icon");

function render(q=""){
  const query = q.trim().toLowerCase();

  const filtered = data.filter(x => {
    if(!query) return true;
    return x.name.toLowerCase().includes(query) || x.desc.toLowerCase().includes(query);
  });

  list.innerHTML = "";

  filtered.forEach(x => {
    const row = document.createElement("div");
    row.className = "row" + (x.id === selected ? " selected" : "");

    row.innerHTML = `
      <div class="row-left">
        <div class="cat-ic">
          <img src="${x.icon}" class="cat-img">
        </div>
        <div class="text">
          <p class="name">${x.name}</p>
          <p class="desc">${x.desc}</p>
        </div>
      </div>

    <div class="row-right">
      <button class="view">View Items</button>
    </div>
  `;

   row.querySelector(".view").addEventListener("click", (e) => {
    e.stopPropagation();
        if (x.id === "lenses") {
      window.location.href = "lenses.html";
        } else {
          if (x.id === "cameras") {
      window.location.href = "cameras.html";
    } else if (x.id === "lenses") {
      window.location.href = "lenses.html";
    }
  }

  });

    list.appendChild(row);
  });

  if(filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "row";
    empty.innerHTML = `
      <div class="row-left">
        <div class="cat-ic">🗂️</div>
        <div class="text">
          <p class="name">No results</p>
          <p class="desc">Try a different keyword.</p>
        </div>
      </div>
      <div></div>
    `;
    list.appendChild(empty);
  }
}

searchInput.addEventListener("input", (e) => render(e.target.value));

/* optional modal */
function openModal(){ modal.classList.remove("hidden"); nameEl.value=""; descEl.value=""; iconEl.value=""; nameEl.focus(); }
function close(){ modal.classList.add("hidden"); }

addNewBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", close);
cancel.addEventListener("click", close);
modal.addEventListener("click", (e) => { if(e.target === modal) close(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = (nameEl.value.trim().toLowerCase().replace(/\s+/g,"-") || "new") + "-" + Date.now();
  data.unshift({
    id,
    icon: iconEl.value.trim() || "📦",
    name: nameEl.value.trim(),
    desc: descEl.value.trim()
  });
  selected = id;
  close();
  render(searchInput.value);
});

render();
