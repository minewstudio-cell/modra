mport { useState, useEffect } from "react";

/* ─── SAMPLE DATA ─── */
const SAMPLE = [
  { id: 1, url: "https://www.instagram.com/p/C8x1234abcd", title: "겨울 스킨케어 루틴 완전 정복", source: "instagram", tags: ["스킨케어", "뷰티", "겨울"], category: "뷰티", memo: "세럼 레이어링 순서 꼭 참고!", savedAt: "2025-06-03" },
  { id: 2, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "도쿄 시부야 브이로그", source: "youtube", tags: ["일본", "도쿄", "여행"], category: "여행", memo: "스카이 예약 미리미리", savedAt: "2025-06-02" },
  { id: 3, url: "https://www.youtube.com/watch?v=9bZkp7q19f0", title: "미니멀 홈오피스 레퍼런스", source: "youtube", tags: ["인테리어", "홈오피스"], category: "인테리어", memo: "", savedAt: "2025-06-01" },
  { id: 4, url: "https://blog.naver.com/ex4", title: "성수동 핫플 카페 리스트", source: "blog", tags: ["카페", "성수", "서울"], category: "맛집", memo: "주말에 꼭 가볼 것!", savedAt: "2025-05-30" },
  { id: 5, url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", title: "Dr.Althea 345 크림 솔직 후기", source: "youtube", tags: ["스킨케어", "알테아"], category: "뷰티", memo: "민감성 피부 강추", savedAt: "2025-05-29" },
  { id: 6, url: "https://www.youtube.com/watch?v=JGwWNGJdvx8", title: "5분 완성 데일리 메이크업", source: "youtube", tags: ["메이크업", "데일리"], category: "뷰티", memo: "", savedAt: "2025-05-28" },
];

const DEFAULT_CATS = ["전체", "뷰티", "여행", "인테리어", "맛집", "기타"];
const DEFAULT_EMOJI = { 뷰티: "💄", 여행: "✈️", 인테리어: "🏠", 맛집: "🍽️", 기타: "📁", 전체: "📋" };
const CAT_EMOJI_LIST = ["🗂️","📌","🎵","🎮","💪","📚","🛍️","💻","🌿","🎨","🍜","✈️","💄","🏠","🐾","⭐"];

const SRC = {
  instagram: { icon: "📸", label: "Instagram" },
  youtube:   { icon: "▶️", label: "YouTube" },
  pinterest: { icon: "📌", label: "Pinterest" },
  blog:      { icon: "📝", label: "Blog" },
  tiktok:    { icon: "🎵", label: "TikTok" },
  default:   { icon: "🔗", label: "Link" },
};

/* ─── 썸네일 URL 추출 ─── */
function getThumbnail(url, source) {
  try {
    // 유튜브: 공식 썸네일 API (빠르고 확실)
    if (source === "youtube") {
      let videoId = null;
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1).split("?")[0];
      else if (u.pathname.includes("/shorts/")) videoId = u.pathname.split("/shorts/")[1]?.split("?")[0];
      else if (u.pathname.includes("/live/")) videoId = u.pathname.split("/live/")[1]?.split("?")[0];
      else videoId = u.searchParams.get("v");
      if (videoId) return { type: "direct", src: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` };
    }
    // 인스타·틱톡: 완전 차단, 폴백만
    if (source === "instagram" || source === "tiktok") return null;
    // 나머지(핀터레스트, 블로그 등): microlink API로 OG이미지 추출
    return { type: "microlink", src: `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=false&screenshot=false` };
  } catch { return null; }
}

function detectSource(url) {
  try {
    const h = new URL(url).hostname;
    if (h.includes("instagram")) return "instagram";
    if (h.includes("youtube") || h.includes("youtu.be")) return "youtube";
    if (h.includes("pinterest")) return "pinterest";
    if (h.includes("tiktok")) return "tiktok";
    if (h.includes("naver") || h.includes("blog")) return "blog";
  } catch {}
  return "default";
}

/* ─── RABBIT SVG ─── */
function Rabbit({ mood = "normal", size = 100 }) {
  const isHappy    = mood === "happy";
  const isSearch   = mood === "searching";
  const isSleeping = mood === "sleeping";
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 160 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="57" cy="38" rx="14" ry="32" fill="#EBEBEB"/>
      <ellipse cx="57" cy="38" rx="7.5" ry="22" fill="#F2C4CE"/>
      <ellipse cx="103" cy="38" rx="14" ry="32" fill="#EBEBEB"/>
      <ellipse cx="103" cy="38" rx="7.5" ry="22" fill="#F2C4CE"/>
      <ellipse cx="80" cy="178" rx="36" ry="9" fill="#E8E8E8" opacity="0.6"/>
      <ellipse cx="80" cy="148" rx="38" ry="40" fill="#F7F7F7"/>
      <ellipse cx="80" cy="86" rx="36" ry="34" fill="#F7F7F7"/>
      <ellipse cx="80" cy="155" rx="24" ry="28" fill="#FFFFFF"/>
      <ellipse cx="46" cy="150" rx="11" ry="18" fill="#F0F0F0" transform="rotate(-12 46 150)"/>
      <ellipse cx="114" cy="150" rx="11" ry="18" fill="#F0F0F0" transform="rotate(12 114 150)"/>
      <ellipse cx="40" cy="164" rx="10" ry="7" fill="#E8E8E8"/>
      <ellipse cx="120" cy="164" rx="10" ry="7" fill="#E8E8E8"/>
      <ellipse cx="63" cy="181" rx="16" ry="9" fill="#EBEBEB"/>
      <ellipse cx="97" cy="181" rx="16" ry="9" fill="#EBEBEB"/>
      <ellipse cx="80" cy="92" rx="5" ry="3.5" fill="#F2C4CE"/>
      {isSleeping ? (
        <>
          <path d="M65 82 Q70 78 75 82" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M85 82 Q90 78 95 82" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </>
      ) : isHappy ? (
        <>
          <path d="M63 82 Q70 76 77 82" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M83 82 Q90 76 97 82" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx="68" cy="81" rx="5" ry="6" fill="#1C1C1E"/>
          <ellipse cx="92" cy="81" rx="5" ry="6" fill="#1C1C1E"/>
          <circle cx="66" cy="79" r="1.5" fill="white"/>
          <circle cx="90" cy="79" r="1.5" fill="white"/>
        </>
      )}
      {isHappy
        ? <path d="M73 97 Q80 104 87 97" stroke="#F2C4CE" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        : isSleeping
        ? <path d="M75 96 Q80 99 85 96" stroke="#F2C4CE" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : <path d="M74 96 Q80 101 86 96" stroke="#F2C4CE" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      }
      {!isSleeping && (
        <>
          <ellipse cx="57" cy="91" rx="8" ry="5" fill="#FFBDD5" opacity="0.38"/>
          <ellipse cx="103" cy="91" rx="8" ry="5" fill="#FFBDD5" opacity="0.38"/>
        </>
      )}
      {isSleeping && <text x="108" y="68" fontSize="13" fill="#BDBDBD" fontWeight="600" fontFamily="sans-serif">z z</text>}
      {isSearch && <text x="112" y="60" fontSize="15" fontFamily="sans-serif">🔍</text>}
      {isHappy && <text x="112" y="58" fontSize="14" fontFamily="sans-serif">✨</text>}
    </svg>
  );
}

/* ─── THUMBNAIL 컴포넌트 ─── */
function Thumb({ url, source }) {
  const thumb = getThumbnail(url, source);
  const [imgSrc, setImgSrc] = useState(thumb?.type === "direct" ? thumb.src : null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(thumb?.type === "microlink");
  const srcInfo = SRC[source] || SRC.default;
  const bgMap = { instagram:"#fce4ec", youtube:"#ffebee", tiktok:"#f3e5f5", pinterest:"#fce4ec", blog:"#e8f5e9", default:"#F2F2F7" };

  useEffect(() => {
    if (thumb?.type !== "microlink") return;
    fetch(thumb.src)
      .then(r => r.json())
      .then(d => {
        const img = d?.data?.image?.url || d?.data?.screenshot?.url;
        if (img) setImgSrc(img);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div style={{ ...S.gridThumb, background: bgMap[source]||bgMap.default }}>
        <span style={{ fontSize: 18, opacity: 0.4 }}>⏳</span>
      </div>
    );
  }
  if (imgSrc && !failed) {
    return (
      <div style={{ ...S.gridThumb, overflow:"hidden" }}>
        <img src={imgSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }}
          onError={() => setFailed(true)}/>
      </div>
    );
  }
  return (
    <div style={{ ...S.gridThumb, background: bgMap[source]||bgMap.default, flexDirection:"column", gap:2 }}>
      <span style={{ fontSize: 26 }}>{srcInfo.icon}</span>
      {(source === "instagram" || source === "tiktok") &&
        <span style={{ fontSize: 9, color:"#999", fontWeight:500 }}>앱에서 확인</span>}
    </div>
  );
}

/* ─── LIST THUMB ─── */
function ListThumb({ url, source }) {
  const thumb = getThumbnail(url, source);
  const [imgSrc, setImgSrc] = useState(thumb?.type === "direct" ? thumb.src : null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(thumb?.type === "microlink");
  const srcInfo = SRC[source] || SRC.default;
  const bgMap = { instagram:"#fce4ec", youtube:"#ffebee", tiktok:"#f3e5f5", pinterest:"#fce4ec", blog:"#e8f5e9", default:"#F2F2F7" };

  useEffect(() => {
    if (thumb?.type !== "microlink") return;
    fetch(thumb.src)
      .then(r => r.json())
      .then(d => {
        const img = d?.data?.image?.url || d?.data?.screenshot?.url;
        if (img) setImgSrc(img);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (imgSrc && !failed) {
    return (
      <div style={{ ...S.listThumb, overflow:"hidden" }}>
        <img src={imgSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}
          onError={() => setFailed(true)}/>
      </div>
    );
  }
  return (
    <div style={{ ...S.listThumb, background: bgMap[source]||bgMap.default }}>
      <span style={{ fontSize: loading ? 14 : 20 }}>{loading ? "⏳" : srcInfo.icon}</span>
    </div>
  );
}

/* ─── CARD ─── */
function Card({ item, onClick, onDelete, view, catEmoji }) {
  const src = SRC[item.source] || SRC.default;
  if (view === "list") {
    return (
      <div onClick={onClick} style={S.listCard}>
        <ListThumb url={item.url} source={item.source} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.listTitle}>{item.title}</div>
          <div style={S.listMeta}>
            <span style={S.listSrc}>{src.icon} {src.label}</span>
            {item.tags.slice(0, 2).map(t => <span key={t} style={S.chip}>#{t}</span>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={S.dateText}>{item.savedAt.slice(5)}</span>
          <button style={S.delX} onClick={e => { e.stopPropagation(); onDelete(item.id); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#C7C7CC" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClick} style={S.gridCard}>
      <div style={S.gridTop}>
        <span style={S.gridSrcLabel}>{src.icon} {src.label}</span>
        <button style={S.delX} onClick={e => { e.stopPropagation(); onDelete(item.id); }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#C7C7CC" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      <Thumb url={item.url} source={item.source} catEmoji={catEmoji} category={item.category} />
      <div style={S.gridTitle}>{item.title}</div>
      {item.memo ? <div style={S.gridMemo}>{item.memo}</div> : <div style={{ flex: 1 }}/>}
      <div style={S.chipRow}>
        {item.tags.slice(0, 2).map(t => <span key={t} style={S.chip}>#{t}</span>)}
      </div>
      <div style={S.dateText}>{item.savedAt}</div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Modra() {
  const [items, setItems]       = useState(SAMPLE);
  const [cats, setCats]         = useState(DEFAULT_CATS);
  const [catEmoji, setCatEmoji] = useState(DEFAULT_EMOJI);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("전체");
  const [view, setView]         = useState("grid");
  const [showAdd, setShowAdd]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [mood, setMood]         = useState("normal");
  const [bubble, setBubble]     = useState("저장한 거 어딨더라... 🤔");
  const [newUrl, setNewUrl]     = useState("");
  const [newCat, setNewCat]     = useState("기타");
  const [newTags, setNewTags]   = useState("");
  const [newMemo, setNewMemo]   = useState("");
  const [showAddCat, setShowAddCat]     = useState(false);
  const [newCatName, setNewCatName]     = useState("");
  const [newCatEmoji, setNewCatEmoji]   = useState("🗂️");
  const [catLongPress, setCatLongPress] = useState(null);

  useEffect(() => {
    if (search.length > 0) { setMood("searching"); setBubble("찾는 중이에요 🔍"); }
    else                   { setMood("normal");    setBubble("저장한 거 어딨더라... 🤔"); }
  }, [search]);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const ms = !q || i.title.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)) || i.memo.toLowerCase().includes(q);
    const mc = cat === "전체" || i.category === cat;
    return ms && mc;
  });

  function addCat() {
    const name = newCatName.trim();
    if (!name || cats.includes(name)) return;
    setCats([...cats, name]);
    setCatEmoji(prev => ({ ...prev, [name]: newCatEmoji }));
    setNewCatName(""); setNewCatEmoji("🗂️");
    setShowAddCat(false);
  }

  function deleteCat(name) {
    if (["전체", "기타"].includes(name)) return;
    setCats(cats.filter(c => c !== name));
    if (cat === name) setCat("전체");
    setItems(items.map(i => i.category === name ? { ...i, category: "기타" } : i));
    setCatLongPress(null);
  }

  function addItem() {
    if (!newUrl.trim()) return;
    const src = detectSource(newUrl);
    const newItem = {
      id: Date.now(), url: newUrl,
      title: newUrl.length > 50 ? newUrl.slice(0, 50) + "…" : newUrl,
      source: src,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      category: newCat, memo: newMemo,
      savedAt: new Date().toISOString().slice(0, 10),
    };
    setItems([newItem, ...items]);
    setNewUrl(""); setNewTags(""); setNewMemo(""); setNewCat("기타");
    setShowAdd(false);
    setMood("happy"); setBubble("저장 완료! 잘하고 있어요 ✨");
    setTimeout(() => { setMood("normal"); setBubble("저장한 거 어딨더라... 🤔"); }, 2500);
  }

  function deleteItem(id) {
    setItems(items.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  // 상세 썸네일
  const selThumb = selected ? getThumbnail(selected.url, selected.source) : null;

  return (
    <div style={S.root}>
      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerLeft}><span style={S.appName}>modra</span></div>
        <div style={S.headerRight}>
          <button style={S.iconBtn} onClick={() => setView(v => v === "grid" ? "list" : "grid")}>
            {view === "grid"
              ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 5h14M2 9h14M2 13h14" stroke="#1C1C1E" strokeWidth="1.6" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#1C1C1E" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#1C1C1E" strokeWidth="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#1C1C1E" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#1C1C1E" strokeWidth="1.5"/></svg>
            }
          </button>
          <button style={S.primaryBtn} onClick={() => setShowAdd(true)}>저장하기</button>
        </div>
      </header>

      {/* RABBIT */}
      <div style={S.rabbitZone}>
        <Rabbit mood={mood} size={96}/>
        <div style={S.bubble}>
          <span style={S.bubbleTxt}>{bubble}</span>
          <div style={S.bubbleArrow}/>
        </div>
      </div>

      {/* SEARCH */}
      <div style={S.searchWrap}>
        <div style={S.searchBar}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="4.5" stroke="#8E8E93" strokeWidth="1.5"/>
            <path d="M10 10l3.5 3.5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input style={S.searchInput} placeholder="검색" value={search} onChange={e => setSearch(e.target.value)}/>
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#C7C7CC"/><path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={S.tabScroll}>
        {cats.map(c => (
          <button key={c} style={{ ...S.tab, ...(cat === c ? S.tabActive : {}) }}
            onClick={() => setCat(c)}
            onContextMenu={e => { e.preventDefault(); if (!["전체","기타"].includes(c)) setCatLongPress(c); }}>
            {catEmoji[c] || "📁"} {c}
            <span style={{ ...S.tabBadge, ...(cat === c ? S.tabBadgeActive : {}) }}>
              {c === "전체" ? items.length : items.filter(i => i.category === c).length}
            </span>
          </button>
        ))}
        <button style={S.tabAddBtn} onClick={() => setShowAddCat(true)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="#8E8E93" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* COUNT */}
      <div style={S.sectionRow}>
        <span style={S.sectionLabel}>{search ? `"${search}" 검색결과` : cat} · {filtered.length}개</span>
      </div>

      {/* CONTENT */}
      <main style={view === "grid" ? S.grid : S.listWrap}>
        {filtered.length === 0 && (
          <div style={S.empty}>
            <Rabbit mood="sleeping" size={80}/>
            <p style={S.emptyTxt}>{search ? `"${search}" 를 찾을 수 없어요` : "아직 저장된 콘텐츠가 없어요"}</p>
            <button style={S.primaryBtn} onClick={() => setShowAdd(true)}>처음 저장하기</button>
          </div>
        )}
        {filtered.map(item => (
          <Card key={item.id} item={item} view={view} catEmoji={catEmoji}
            onClick={() => setSelected(item)} onDelete={deleteItem}/>
        ))}
      </main>

      {/* DETAIL SHEET */}
      {selected && (
        <div style={S.overlay} onClick={() => setSelected(null)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle}/>
            {selThumb && (
              <div style={{ borderRadius: 12, overflow: "hidden", height: 180, background: "#F2F2F7" }}>
                <img src={selThumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }}/>
              </div>
            )}
            <div style={S.sheetSrc}>{(SRC[selected.source]||SRC.default).icon} {(SRC[selected.source]||SRC.default).label}</div>
            <div style={S.sheetTitle}>{selected.title}</div>
            <a href={selected.url} target="_blank" rel="noreferrer" style={S.sheetUrl}>{selected.url}</a>
            {selected.memo && <div style={S.sheetMemo}>{selected.memo}</div>}
            <div style={S.chipRow}>{selected.tags.map(t => <span key={t} style={S.chip}>#{t}</span>)}</div>
            <div style={S.sheetMeta}>
              <span>{catEmoji[selected.category]||"📁"} {selected.category}</span>
              <span>{selected.savedAt}</span>
            </div>
            <div style={S.sheetActions}>
              <a href={selected.url} target="_blank" rel="noreferrer"
                style={{ ...S.primaryBtn, textDecoration:"none", textAlign:"center", display:"block", flex:1, padding:"12px 0" }}>
                원본 열기
              </a>
              <button style={S.destructiveBtn} onClick={() => deleteItem(selected.id)}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SHEET */}
      {showAdd && (
        <div style={S.overlay} onClick={() => setShowAdd(false)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle}/>
            <div style={S.addTitleRow}>
              <Rabbit mood="happy" size={52}/>
              <div>
                <div style={S.sheetTitle}>저장하기</div>
                <div style={S.sheetSrc}>URL을 붙여넣어 주세요</div>
              </div>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>URL</label>
              <input style={S.formInput} placeholder="https://" value={newUrl}
                onChange={e => setNewUrl(e.target.value)} autoFocus/>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>카테고리</label>
              <div style={S.segmented}>
                {cats.filter(c => c !== "전체").map(c => (
                  <button key={c} style={{ ...S.segBtn, ...(newCat === c ? S.segBtnOn : {}) }}
                    onClick={() => setNewCat(c)}>{catEmoji[c]||"📁"} {c}</button>
                ))}
              </div>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>태그 <span style={{ color:"#8E8E93", fontWeight:400 }}>쉼표로 구분</span></label>
              <input style={S.formInput} placeholder="스킨케어, 뷰티, 추천" value={newTags}
                onChange={e => setNewTags(e.target.value)}/>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>메모</label>
              <textarea style={{ ...S.formInput, height:72, resize:"none" }}
                placeholder="나중에 기억할 메모를 적어두세요" value={newMemo}
                onChange={e => setNewMemo(e.target.value)}/>
            </div>
            <button style={{ ...S.primaryBtn, width:"100%", padding:"15px 0", fontSize:16 }} onClick={addItem}>
              저장하기
            </button>
          </div>
        </div>
      )}

      {/* ADD CAT */}
      {showAddCat && (
        <div style={S.overlay} onClick={() => setShowAddCat(false)}>
          <div style={{ ...S.sheet, gap:14 }} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle}/>
            <div style={S.sheetTitle}>카테고리 추가</div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>이름</label>
              <input style={S.formInput} placeholder="예: 운동, 독서, 쇼핑..."
                value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus maxLength={10}/>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>아이콘</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {CAT_EMOJI_LIST.map(em => (
                  <button key={em} style={{ width:42, height:42, borderRadius:10, border:"none", fontSize:20, cursor:"pointer",
                    background: newCatEmoji === em ? "#1C1C1E" : "#F2F2F7" }}
                    onClick={() => setNewCatEmoji(em)}>{em}</button>
                ))}
              </div>
            </div>
            <button style={{ ...S.primaryBtn, width:"100%", padding:"15px 0", fontSize:16, opacity: newCatName.trim() ? 1 : 0.4 }}
              onClick={addCat}>추가하기</button>
          </div>
        </div>
      )}

      {/* DELETE CAT */}
      {catLongPress && (
        <div style={S.overlay} onClick={() => setCatLongPress(null)}>
          <div style={{ ...S.sheet, gap:12 }} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle}/>
            <div style={S.sheetTitle}>"{catLongPress}" 삭제</div>
            <p style={{ fontSize:14, color:"#8E8E93", margin:0, lineHeight:1.5 }}>
              이 카테고리를 삭제하면 저장된 콘텐츠는 <b>기타</b>로 이동돼요.
            </p>
            <div style={S.sheetActions}>
              <button style={{ ...S.primaryBtn, flex:1, padding:"13px 0" }} onClick={() => setCatLongPress(null)}>취소</button>
              <button style={S.destructiveBtn} onClick={() => deleteCat(catLongPress)}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── STYLES ─── */
const S = {
  root: {
    minHeight: "100vh", background: "#FFFFFF",
    fontFamily: "-apple-system,'SF Pro Display','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
    paddingBottom: 80, WebkitFontSmoothing: "antialiased",
  },
  header: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"16px 20px", borderBottom:"1px solid #F2F2F7",
    position:"sticky", top:0, background:"rgba(255,255,255,0.92)",
    backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", zIndex:10,
  },
  headerLeft: { display:"flex", alignItems:"center" },
  appName: { fontSize:24, fontWeight:700, color:"#1C1C1E", letterSpacing:"-0.8px" },
  headerRight: { display:"flex", alignItems:"center", gap:10 },
  iconBtn: {
    width:36, height:36, borderRadius:10, border:"none", background:"#F2F2F7",
    display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
  },
  primaryBtn: {
    background:"#1C1C1E", color:"#FFFFFF", border:"none", borderRadius:12,
    padding:"9px 18px", fontSize:14, fontWeight:600, cursor:"pointer", letterSpacing:"-0.2px",
  },
  rabbitZone: { display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"24px 20px 8px" },
  bubble: { background:"#F2F2F7", borderRadius:16, padding:"12px 16px", position:"relative", maxWidth:200 },
  bubbleTxt: { fontSize:14, color:"#1C1C1E", fontWeight:500, lineHeight:1.4 },
  bubbleArrow: {
    position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)",
    width:0, height:0, borderTop:"7px solid transparent",
    borderBottom:"7px solid transparent", borderRight:"8px solid #F2F2F7",
  },
  searchWrap: { padding:"12px 20px 0" },
  searchBar: { display:"flex", alignItems:"center", gap:8, background:"#F2F2F7", borderRadius:12, padding:"0 12px", height:44 },
  searchInput: { flex:1, border:"none", outline:"none", background:"transparent", fontSize:16, color:"#1C1C1E", fontFamily:"inherit" },
  clearBtn: { background:"none", border:"none", cursor:"pointer", padding:2, display:"flex", alignItems:"center" },
  tabScroll: { display:"flex", gap:8, padding:"16px 20px 0", overflowX:"auto", scrollbarWidth:"none" },
  tab: {
    flexShrink:0, background:"none", border:"1px solid #E5E5EA", borderRadius:99,
    padding:"6px 14px", fontSize:14, fontWeight:500, color:"#6D6D72",
    cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap",
  },
  tabActive: { background:"#1C1C1E", border:"1px solid #1C1C1E", color:"#FFFFFF" },
  tabBadge: { fontSize:11, color:"#8E8E93", background:"#F2F2F7", borderRadius:99, padding:"1px 6px", fontWeight:500 },
  tabBadgeActive: { background:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)" },
  tabAddBtn: {
    flexShrink:0, width:34, height:34, background:"#F2F2F7", border:"1px solid #E5E5EA",
    borderRadius:99, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"center",
  },
  sectionRow: { padding:"14px 20px 4px" },
  sectionLabel: { fontSize:13, color:"#8E8E93", fontWeight:500 },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:12, padding:"8px 20px" },
  gridCard: {
    background:"#FFFFFF", border:"1px solid #F2F2F7", borderRadius:16, padding:"12px 12px 10px",
    cursor:"pointer", display:"flex", flexDirection:"column", gap:6,
    boxShadow:"0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
  },
  gridTop: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  gridSrcLabel: { fontSize:11, color:"#8E8E93", fontWeight:500 },
  gridThumb: {
    height:100, background:"#F9F9F9", borderRadius:10,
    display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden",
  },
  gridTitle: {
    fontSize:13, fontWeight:600, color:"#1C1C1E", lineHeight:1.35,
    display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
  },
  gridMemo: {
    fontSize:11, color:"#8E8E93", lineHeight:1.3,
    display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden", flex:1,
  },
  listWrap: { display:"flex", flexDirection:"column", padding:"8px 20px", gap:1 },
  listCard: { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #F2F2F7", cursor:"pointer" },
  listThumb: {
    width:56, height:56, borderRadius:10, background:"#F9F9F9",
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0, overflow:"hidden",
  },
  listTitle: {
    fontSize:15, fontWeight:600, color:"#1C1C1E",
    display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:4,
  },
  listMeta: { display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" },
  listSrc: { fontSize:12, color:"#8E8E93", marginRight:2 },
  chipRow: { display:"flex", flexWrap:"wrap", gap:4 },
  chip: { fontSize:11, background:"#F2F2F7", borderRadius:6, padding:"3px 8px", color:"#6D6D72", fontWeight:500 },
  dateText: { fontSize:11, color:"#C7C7CC" },
  delX: { background:"none", border:"none", cursor:"pointer", padding:2, display:"flex", alignItems:"center" },
  empty: { gridColumn:"1/-1", display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"48px 0" },
  emptyTxt: { fontSize:15, color:"#8E8E93", fontWeight:500, margin:0 },
  overlay: {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
    display:"flex", alignItems:"flex-end", justifyContent:"center",
    zIndex:100, backdropFilter:"blur(4px)",
  },
  sheet: {
    background:"#FFFFFF", borderRadius:"20px 20px 0 0", padding:"12px 20px 36px",
    width:"100%", maxWidth:480, boxShadow:"0 -4px 30px rgba(0,0,0,0.12)",
    maxHeight:"88vh", overflowY:"auto", display:"flex", flexDirection:"column", gap:12,
  },
  sheetHandle: { width:36, height:4, background:"#E5E5EA", borderRadius:99, alignSelf:"center", marginBottom:4 },
  sheetSrc: { fontSize:13, color:"#8E8E93", fontWeight:500 },
  sheetTitle: { fontSize:20, fontWeight:700, color:"#1C1C1E", lineHeight:1.25, letterSpacing:"-0.4px" },
  sheetUrl: { fontSize:12, color:"#007AFF", wordBreak:"break-all", textDecoration:"none" },
  sheetMemo: { background:"#F9F9F9", borderRadius:12, padding:"12px 14px", fontSize:14, color:"#3C3C43", lineHeight:1.5 },
  sheetMeta: { display:"flex", gap:16, fontSize:13, color:"#8E8E93" },
  sheetActions: { display:"flex", gap:10, marginTop:4 },
  destructiveBtn: {
    background:"#FFF2F2", color:"#FF3B30", border:"none", borderRadius:12,
    padding:"12px 18px", fontSize:14, fontWeight:600, cursor:"pointer",
  },
  addTitleRow: { display:"flex", alignItems:"center", gap:12, marginBottom:4 },
  formGroup: { display:"flex", flexDirection:"column", gap:6 },
  formLabel: { fontSize:13, fontWeight:600, color:"#1C1C1E" },
  formInput: {
    background:"#F2F2F7", border:"none", borderRadius:12, padding:"12px 14px",
    fontSize:15, color:"#1C1C1E", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box",
  },
  segmented: { display:"flex", flexWrap:"wrap", gap:6 },
  segBtn: { background:"#F2F2F7", border:"none", borderRadius:99, padding:"7px 13px", fontSize:13, fontWeight:500, color:"#6D6D72", cursor:"pointer" },
  segBtnOn: { background:"#1C1C1E", color:"#FFFFFF" },
};
