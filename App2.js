import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — change these before deploying
// ─────────────────────────────────────────────────────────────────────────────

const MASTER_PASSWORD = process.env.REACT_APP_MASTER_PASSWORD || "corkd-master-2026";
const COURSES = ["Appetizers","Salads","Entrées","Sushi","Pizza","Pasta","Mains","Desserts","Sides"];
const DRINK_TYPES = ["White","Red","Rosé","Sparkling","Saké","Beer","Cocktail"];
const PLANS = ["Pilot","Starter","Growth","Pro"];

function uid() { return Math.random().toString(36).slice(2, 8); }

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — uses localStorage since this is a separate deployment
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "corkd_admin_restaurants_v1";

function loadRestaurants() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function saveRestaurants(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_RESTAURANTS = [
  {
    id: "chucks_fish",
    name: "Chuck's Fish",
    location: "Tallahassee, FL",
    emoji: "🐟",
    password: "chucks2026",
    plan: "Pilot",
    since: "Jun 2026",
    menu: [
      { id: "m1", course: "Appetizers", name: "Uptown Shrimp", desc: "Panko-fried, Asian slaw, wonton bowl", price: "18" },
      { id: "m2", course: "Appetizers", name: "Smoked Yellowfin Tuna Dip", desc: "Candied jalapeños, potato chips", price: "18" },
      { id: "m3", course: "Entrées", name: "Sesame-Seared Yellowfin Tuna", desc: "Soy glaze, stir-fried vegetables, sticky rice", price: "37" },
      { id: "m4", course: "Entrées", name: "Stuffed Shrimp", desc: "Crab meat, bacon-wrapped, red pepper aïoli, garlic mashed potatoes", price: "39" },
      { id: "m5", course: "Entrées", name: "Crab Cakes", desc: "Red pepper aïoli, risotto, vegetable of the day", price: "40" },
      { id: "m6", course: "Entrées", name: "Ribeye", desc: "14 oz aged ribloin, garlic mashed potatoes, asparagus", price: "51" },
      { id: "m7", course: "Sushi", name: "Rainbow Roll", desc: "Shrimp, cucumber, topped: tuna, yellowtail, fresh salmon", price: "24" },
      { id: "m8", course: "Sushi", name: "Black Dragon Roll", desc: "Soft-shell crab, cucumber, topped: baked eel, avocado", price: "22" },
      { id: "m9", course: "Desserts", name: "Blondie Sundae", desc: "Brown sugar brownie, caramel, pecans, vanilla ice cream", price: "12" },
    ],
    drinks: [
      { id: "d1", name: "Broadbent Vinho Verde", region: "Portugal", type: "White", glass: "8", bottle: "32" },
      { id: "d2", name: "Paco + Lola Albariño", region: "Spain", type: "White", glass: "12", bottle: "48" },
      { id: "d3", name: "Honig Sauvignon Blanc", region: "Napa Valley", type: "White", glass: "16", bottle: "64" },
      { id: "d4", name: "Sonoma Cutrer Chardonnay", region: "Sonoma County", type: "White", glass: "16", bottle: "64" },
      { id: "d5", name: "Unshackled Rosé", region: "California", type: "Rosé", glass: "12", bottle: "48" },
      { id: "d6", name: "Zardetto Prosecco", region: "Italy", type: "Sparkling", glass: "12", bottle: "48" },
      { id: "d7", name: "Benton-Lane Pinot Noir", region: "Willamette Valley", type: "Red", glass: "14", bottle: "56" },
      { id: "d8", name: "Justin Cabernet", region: "Paso Robles", type: "Red", glass: "18", bottle: "72" },
      { id: "d9", name: "Hot Saké", region: "Japan", type: "Saké", glass: "13", bottle: "" },
      { id: "d10", name: "Yuzu Saké", region: "Japan", type: "Saké", glass: "20", bottle: "" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────

const inp = { background:"#0f0f0f", border:"1px solid #2a2a2a", color:"#f0f0f0", borderRadius:7, padding:"9px 12px", fontSize:13, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box" };
const lbl = { fontSize:10, color:"#555", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:5, display:"block", marginTop:12 };

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANT LOGIN
// ─────────────────────────────────────────────────────────────────────────────

function RestaurantLogin({ restaurants, onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function login() {
    setErr("");
    const r = restaurants.find(r => r.id === id.toLowerCase().trim());
    if (!r || pw !== r.password) {
      setErr("Invalid ID or password. Contact Cork'd if you need help.");
      return;
    }
    onLogin({ role: "restaurant", restaurantId: r.id });
  }

  return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Inter',sans-serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background:"#0e0e0e", border:"1px solid #1e1e1e", borderRadius:16, padding:"40px 32px", width:"100%", maxWidth:400 }}>
        <div style={{ fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.01em", marginBottom:4 }}>Cork'd</div>
        <div style={{ fontSize:11, color:"#444", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 }}>Restaurant Portal</div>
        <div style={{ fontSize:13, color:"#555", marginBottom:32, lineHeight:1.5 }}>Manage your menu and drink list</div>

        <label style={{ ...lbl, marginTop:0 }}>Restaurant ID</label>
        <input style={{ ...inp, fontSize:14, padding:"12px 14px" }} value={id}
          onChange={e => setId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Your unique ID"
          autoComplete="username" />

        <label style={{ ...lbl, marginTop:16 }}>Password</label>
        <input type="password" style={{ ...inp, fontSize:14, padding:"12px 14px" }} value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Your restaurant password"
          autoComplete="current-password" />

        {err && <div style={{ color:"#c06050", fontSize:12, marginTop:10, textAlign:"center" }}>{err}</div>}

        <button onClick={login} style={{ width:"100%", background:"#d4a84c", color:"#0c0b09", border:"none", borderRadius:8, padding:"14px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:22 }}>
          Log In →
        </button>

        <div style={{ fontSize:11, color:"#2a2a2a", textAlign:"center", marginTop:16, lineHeight:1.7 }}>
          Your ID and password were provided when you joined Cork'd.<br />
          Need help? Email <span style={{ color:"#3a3a3a" }}>hello@corkd.ai</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER LOGIN — understated, accessed via /master route
// ─────────────────────────────────────────────────────────────────────────────

function MasterLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function login() {
    if (pw === MASTER_PASSWORD) onLogin({ role: "master" });
    else setErr("Incorrect password.");
  }

  return (
    <div style={{ minHeight:"100vh", background:"#050505", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Inter',sans-serif" }}>
      <style>{globalCSS}</style>
      <div style={{ background:"#0a0a0a", border:"1px solid #141414", borderRadius:14, padding:"36px 28px", width:"100%", maxWidth:340 }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#2a2a2a", marginBottom:4 }}>Cork'd</div>
        <div style={{ fontSize:10, color:"#1e1e1e", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:28 }}>Internal</div>
        <label style={{ ...lbl, color:"#333", marginTop:0 }}>Password</label>
        <input type="password"
          style={{ ...inp, background:"#0d0d0d", border:"1px solid #1a1a1a", color:"#666", fontSize:14, padding:"12px 14px" }}
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="••••••••••••"
          autoFocus />
        {err && <div style={{ color:"#c06050", fontSize:11, marginTop:8, textAlign:"center" }}>{err}</div>}
        <button onClick={login} style={{ width:"100%", background:"#141414", color:"#444", border:"1px solid #1e1e1e", borderRadius:8, padding:"12px", fontSize:13, cursor:"pointer", fontFamily:"inherit", marginTop:18 }}>
          Enter
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU EDITOR
// ─────────────────────────────────────────────────────────────────────────────

function MenuEditor({ restaurant, onChange }) {
  const [tab, setTab] = useState("menu");
  const [saved, setSaved] = useState(false);

  function addItem() { onChange({ ...restaurant, menu: [...restaurant.menu, { id:uid(), course:"Entrées", name:"", desc:"", price:"" }] }); }
  function updateItem(id, f, v) { onChange({ ...restaurant, menu: restaurant.menu.map(m => m.id===id ? { ...m, [f]:v } : m) }); }
  function removeItem(id) { onChange({ ...restaurant, menu: restaurant.menu.filter(m => m.id!==id) }); }
  function addDrink() { onChange({ ...restaurant, drinks: [...restaurant.drinks, { id:uid(), name:"", region:"", type:"White", glass:"", bottle:"" }] }); }
  function updateDrink(id, f, v) { onChange({ ...restaurant, drinks: restaurant.drinks.map(d => d.id===id ? { ...d, [f]:v } : d) }); }
  function removeDrink(id) { onChange({ ...restaurant, drinks: restaurant.drinks.filter(d => d.id!==id) }); }
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const removeBtn = { background:"none", border:"1px solid #2a2a2a", color:"#444", borderRadius:7, padding:"8px 10px", cursor:"pointer", fontSize:13, alignSelf:"flex-end" };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 24px", borderBottom:"1px solid #1a1a1a", background:"#0e0e0e", flexShrink:0 }}>
        <span style={{ fontSize:24 }}>{restaurant.emoji}</span>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{restaurant.name}</div>
          <div style={{ fontSize:11, color:"#444" }}>{restaurant.location} · {restaurant.plan} · Since {restaurant.since}</div>
        </div>
        <button onClick={handleSave} style={{ marginLeft:"auto", background: saved ? "#0a1a0a" : "#d4a84c", color: saved ? "#5AC890" : "#0c0b09", border: saved ? "1px solid #5AC890" : "none", borderRadius:8, padding:"9px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #1a1a1a", padding:"0 24px", background:"#0e0e0e", flexShrink:0 }}>
        {[["menu","🍽 Menu Items"],["drinks","🍷 Drink List"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background:"none", border:"none", color: tab===v ? "#d4a84c" : "#555", fontSize:13, padding:"11px 16px 9px", cursor:"pointer", fontFamily:"inherit", borderBottom:`2px solid ${tab===v ? "#d4a84c" : "transparent"}`, marginBottom:-1 }}>
            {l}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 60px" }}>

        {tab === "menu" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:13, color:"#444" }}>{restaurant.menu.length} items</div>
              <button onClick={addItem} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#d4a84c", borderRadius:7, padding:"7px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>+ Add Item</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {restaurant.menu.map(item => (
                <div key={item.id} style={{ background:"#0f0f0f", border:"1px solid #1e1e1e", borderRadius:10, padding:"14px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 70px auto", gap:8, alignItems:"flex-end" }}>
                    <div>
                      <label style={lbl}>Course</label>
                      <select value={item.course} onChange={e => updateItem(item.id,"course",e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                        {COURSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Dish Name</label>
                      <input style={inp} value={item.name} onChange={e => updateItem(item.id,"name",e.target.value)} placeholder="e.g. Grilled Salmon" />
                    </div>
                    <div>
                      <label style={lbl}>Price ($)</label>
                      <input style={inp} value={item.price} onChange={e => updateItem(item.id,"price",e.target.value)} placeholder="28" />
                    </div>
                    <button onClick={() => removeItem(item.id)} style={removeBtn}>✕</button>
                  </div>
                  <div style={{ marginTop:8 }}>
                    <label style={lbl}>Description</label>
                    <input style={inp} value={item.desc} onChange={e => updateItem(item.id,"desc",e.target.value)} placeholder="e.g. Lemon butter, asparagus, rice pilaf" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "drinks" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:13, color:"#444" }}>{restaurant.drinks.length} drinks</div>
              <button onClick={addDrink} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#d4a84c", borderRadius:7, padding:"7px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>+ Add Drink</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {restaurant.drinks.map(drink => (
                <div key={drink.id} style={{ background:"#0f0f0f", border:"1px solid #1e1e1e", borderRadius:10, padding:"14px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                    <div>
                      <label style={lbl}>Name</label>
                      <input style={inp} value={drink.name} onChange={e => updateDrink(drink.id,"name",e.target.value)} placeholder="e.g. Honig Sauvignon Blanc" />
                    </div>
                    <div>
                      <label style={lbl}>Region</label>
                      <input style={inp} value={drink.region} onChange={e => updateDrink(drink.id,"region",e.target.value)} placeholder="e.g. Napa Valley" />
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px auto", gap:8, alignItems:"flex-end" }}>
                    <div>
                      <label style={lbl}>Type</label>
                      <select value={drink.type} onChange={e => updateDrink(drink.id,"type",e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                        {DRINK_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>$/Glass</label>
                      <input style={inp} value={drink.glass} onChange={e => updateDrink(drink.id,"glass",e.target.value)} placeholder="12" />
                    </div>
                    <div>
                      <label style={lbl}>$/Bottle</label>
                      <input style={inp} value={drink.bottle} onChange={e => updateDrink(drink.id,"bottle",e.target.value)} placeholder="48" />
                    </div>
                    <button onClick={() => removeDrink(drink.id)} style={removeBtn}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANT VIEW
// ─────────────────────────────────────────────────────────────────────────────

function RestaurantView({ restaurant, onUpdate, onLogout }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#080808", fontFamily:"'Inter',sans-serif" }}>
      <style>{globalCSS}</style>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <MenuEditor restaurant={restaurant} onChange={onUpdate} />
      </div>
      <div style={{ padding:"12px 24px", borderTop:"1px solid #1a1a1a", background:"#0e0e0e", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:11, color:"#2a2a2a" }}>Powered by <span style={{ color:"#3a3a3a" }}>Cork'd</span></div>
        <button onClick={onLogout} style={{ background:"none", border:"none", color:"#333", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Log out</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER VIEW
// ─────────────────────────────────────────────────────────────────────────────

function MasterView({ restaurants, onUpdate, onAdd, onLogout }) {
  const [activeId, setActiveId] = useState(restaurants[0]?.id);
  const [showAdd, setShowAdd] = useState(false);
  const [newR, setNewR] = useState({ name:"", location:"", emoji:"🍽", password:"", plan:"Pilot" });
  const [copied, setCopied] = useState(null);

  const active = restaurants.find(r => r.id === activeId) || restaurants[0];

  function addRestaurant() {
    if (!newR.name || !newR.password) return;
    const baseId = newR.name.toLowerCase().replace(/[^a-z0-9]/g,"_").replace(/_+/g,"_").slice(0,20);
    const r = { ...newR, id: `${baseId}_${uid()}`, since: new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}), menu:[], drinks:[] };
    onAdd(r);
    setActiveId(r.id);
    setShowAdd(false);
    setNewR({ name:"", location:"", emoji:"🍽", password:"", plan:"Pilot" });
  }

  function copyId(id) {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#080808", color:"#e0e0e0", fontFamily:"'Inter',sans-serif" }}>
      <style>{globalCSS}</style>

      {/* Sidebar */}
      <div style={{ width:240, background:"#0e0e0e", borderRight:"1px solid #1a1a1a", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Cork'd</div>
          <div style={{ fontSize:9, color:"#333", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:2 }}>Master Admin</div>
        </div>

        <div style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          <div style={{ fontSize:9, color:"#2a2a2a", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0 4px 8px" }}>
            Restaurants ({restaurants.length})
          </div>
          {restaurants.map(r => (
            <button key={r.id} onClick={() => setActiveId(r.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, background: r.id===activeId ? "#1a1a1a" : "none", border: r.id===activeId ? "1px solid #2a2a2a" : "1px solid transparent", borderRadius:8, padding:"10px", cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:4, color: r.id===activeId ? "#fff" : "#555" }}>
              <span style={{ fontSize:16 }}>{r.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
                <div style={{ fontSize:10, color:"#333", marginTop:2 }}>{r.plan} · Since {r.since}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding:"10px" }}>
          <button onClick={() => setShowAdd(true)} style={{ width:"100%", background:"none", border:"1px dashed #2a2a2a", color:"#444", borderRadius:8, padding:"9px", fontSize:12, cursor:"pointer", fontFamily:"inherit", marginBottom:8 }}>
            + New Restaurant
          </button>
          <button onClick={onLogout} style={{ width:"100%", background:"none", border:"none", color:"#2a2a2a", fontSize:11, cursor:"pointer", fontFamily:"inherit", padding:"4px" }}>
            Log out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {active && (
          <>
            {/* Credentials bar — shows ID and password for easy sharing */}
            <div style={{ background:"#0a0a0a", borderBottom:"1px solid #141414", padding:"10px 24px", display:"flex", alignItems:"center", gap:20, flexShrink:0 }}>
              <div style={{ fontSize:10, color:"#333", letterSpacing:"0.1em", textTransform:"uppercase" }}>Share with restaurant:</div>
              <div style={{ display:"flex", gap:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, color:"#333" }}>ID</span>
                  <code style={{ fontSize:11, color:"#555", background:"#111", padding:"3px 8px", borderRadius:4 }}>{active.id}</code>
                  <button onClick={() => copyId(active.id)} style={{ background:"none", border:"none", color: copied===active.id ? "#5AC890" : "#444", fontSize:11, cursor:"pointer", fontFamily:"inherit", padding:0 }}>
                    {copied===active.id ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, color:"#333" }}>Password</span>
                  <code style={{ fontSize:11, color:"#555", background:"#111", padding:"3px 8px", borderRadius:4 }}>{active.password}</code>
                </div>
              </div>
            </div>
            <MenuEditor restaurant={active} onChange={onUpdate} />
          </>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#0e0e0e", border:"1px solid #2a2a2a", borderRadius:16, padding:"28px 24px", maxWidth:440, width:"100%" }}>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:4 }}>Add New Restaurant</div>
            <div style={{ fontSize:12, color:"#444", marginBottom:20 }}>A unique ID will be auto-generated. You'll share it with the restaurant along with their password.</div>

            {[["Restaurant Name","name","e.g. Savour"],["Location","location","e.g. Tallahassee, FL"],["Emoji","emoji","🍽"],["Login Password","password","Create a password for them"]].map(([label,field,ph]) => (
              <div key={field}>
                <label style={lbl}>{label}</label>
                <input style={inp} value={newR[field]} placeholder={ph} onChange={e => setNewR(p => ({ ...p, [field]:e.target.value }))} />
              </div>
            ))}

            <label style={lbl}>Plan</label>
            <select value={newR.plan} onChange={e => setNewR(p => ({ ...p, plan:e.target.value }))} style={{ ...inp, cursor:"pointer" }}>
              {PLANS.map(p => <option key={p}>{p}</option>)}
            </select>

            <div style={{ display:"flex", gap:10, marginTop:22 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, background:"none", border:"1px solid #2a2a2a", color:"#555", borderRadius:8, padding:"11px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={addRestaurant} style={{ flex:2, background:"#d4a84c", color:"#0c0b09", border:"none", borderRadius:8, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Add Restaurant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────

const globalCSS = `
  input:focus, select:focus { border-color: #d4a84c88 !important; outline: none; }
  button:hover { opacity: 0.88; }
  button:active { transform: scale(0.97); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
  select option { background: #111; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// APP — /master path = master login, everything else = restaurant login
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState(null);
  const [restaurants, setRestaurants] = useState(() => loadRestaurants() || DEFAULT_RESTAURANTS);

  // Detect route
  const path = window.location.pathname;
  const isMasterRoute = path === "/master" || path === "/master/";

  // Save whenever restaurants change
  useEffect(() => { saveRestaurants(restaurants); }, [restaurants]);

  function updateRestaurant(updated) { setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r)); }
  function addRestaurant(r) { setRestaurants(prev => [...prev, r]); }

  // ── Master flow ──────────────────────────────────────────────────────────
  if (isMasterRoute) {
    if (!session || session.role !== "master") {
      return <MasterLogin onLogin={setSession} />;
    }
    return (
      <MasterView
        restaurants={restaurants}
        onUpdate={updateRestaurant}
        onAdd={addRestaurant}
        onLogout={() => setSession(null)}
      />
    );
  }

  // ── Restaurant flow ──────────────────────────────────────────────────────
  if (!session) {
    return <RestaurantLogin restaurants={restaurants} onLogin={setSession} />;
  }

  const restaurant = restaurants.find(r => r.id === session.restaurantId);
  if (!restaurant) { setSession(null); return null; }

  return (
    <RestaurantView
      restaurant={restaurant}
      onUpdate={updateRestaurant}
      onLogout={() => setSession(null)}
    />
  );
}
