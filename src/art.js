// Görseli olmayan projeler için çizgisel "ekran" çizimleri (currentColor ile boyanır)
module.exports = function art(lang, esc) {
  return {
    counter: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Dükkân tezgâhı, CD'ler ve şüphe göstergesi çizimi" : "Drawing of a shop counter, CDs and a suspicion meter")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 150h280M20 150v34M300 150v34M40 120h240v30H40z"/>
        <circle cx="96" cy="96" r="24"/><circle cx="96" cy="96" r="5"/>
        <circle cx="150" cy="104" r="16"/><circle cx="150" cy="104" r="3"/>
        <path d="M196 70h56v50h-56zM204 80h40M204 90h28"/>
        <path d="M30 24h120v14H30z"/>
      </g>
      <path d="M32 26h78v10H32z" fill="currentColor"/>
      <text x="160" y="35" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">${lang === "tr" ? "ŞÜPHE" : "SUSPICION"}</text>
      <text x="196" y="138" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">₺ 2000s</text>
    </svg>`,
    dawn: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Ufukta doğan güneş ve bir üs duvarı çizimi" : "Drawing of a sun rising behind a base wall")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M110 140a50 50 0 0 1 100 0"/>
        <path d="M160 70v-18M118 86l-12-12M202 86l12-12M96 118H78M224 118h18"/>
        <path d="M10 140h300"/>
        <path d="M30 140v-34h14v10h14v-10h14v10h14v-10h14v34M222 140v-34h14v10h14v-10h14v10h14v-10h14v34"/>
      </g>
      <g fill="currentColor"><path d="M10 160h300v2H10zM40 176h240v2H40zM90 190h140v2H90z"/></g>
    </svg>`,
    parcel: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Izgara üzerinde bir arsa parseli ve geri sayım çizimi" : "Drawing of a land parcel on a grid with a countdown")}">
      <g stroke="currentColor" stroke-width="1" opacity=".35">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${20 + i * 35} 10v180"/>`).join("")}
        ${Array.from({ length: 6 }, (_, i) => `<path d="M10 ${20 + i * 32}h300"/>`).join("")}
      </g>
      <path d="M58 52l96-18 64 40-20 82-112 10z" fill="none" stroke="currentColor" stroke-width="3"/>
      <g fill="currentColor"><path d="M55 49h6v6h-6zM151 31h6v6h-6zM215 71h6v6h-6zM195 153h6v6h-6zM83 163h6v6h-6z"/></g>
      <path d="M110 96l12 12 22-24" fill="none" stroke="currentColor" stroke-width="4"/>
      <g fill="none" stroke="currentColor" stroke-width="2"><path d="M238 120h66v34h-66z"/></g>
      <text x="248" y="143" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="15">00:10</text>
    </svg>`,
    pipeline: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "QR menüden kasaya giden sipariş akışı çizimi" : "Drawing of orders flowing from a QR menu to the register")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 60h56v56H18zM90 76h36M118 70l8 6-8 6M140 52h64v80h-64zM218 76h36M246 70l8 6-8 6M262 56h44v44h-44zM270 100v16h28v-16"/>
        <path d="M150 66h44M150 80h44M150 94h30"/>
        <path d="M172 132v28M150 160h44M18 160h56"/>
      </g>
      <g fill="currentColor"><path d="M26 68h12v12H26zM54 68h12v12H54zM26 96h12v12H26zM44 86h6v6h-6zM56 96h4v4h-4zM62 104h4v4h-4z"/><path d="M276 66h16v4h-16zM276 76h10v4h-10z"/></g>
      <text x="140" y="176" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">go · windows</text>
      <text x="18" y="176" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">QR</text>
      <text x="258" y="132" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="11">POS</text>
    </svg>`,
    chat: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Sohbet balonlarından bir tabloya aktarım çizimi" : "Drawing of chat bubbles being exported to a spreadsheet")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 40h100v30H44l-10 10V70H20zM30 96h90v30H54l-10 10v-10H30zM20 150h80v26H20z"/>
        <path d="M140 108h34M166 100l8 8-8 8"/>
        <path d="M190 40h112v128H190zM190 64h112M190 88h112M190 112h112M190 136h112M222 40v128"/>
      </g>
      <g fill="currentColor"><path d="M30 50h60v4H30zM30 58h40v4H30zM40 106h60v4H40zM30 158h50v4H30zM198 48h16v8h-16zM198 72h16v8h-16zM198 96h16v8h-16zM198 120h16v8h-16zM198 144h16v8h-16zM230 72h50v4h-50zM230 96h40v4h-40zM230 120h56v4h-56zM230 144h30v4h-30z"/></g>
      <text x="232" y="56" fill="currentColor" font-family="IBM Plex Mono, monospace" font-size="10">.xlsx</text>
    </svg>`,
    tasks: `<svg class="art" viewBox="0 0 320 200" role="img" aria-label="${esc(lang === "tr" ? "Görev listesi ve takvim çizimi" : "Drawing of a task list and a calendar")}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 30h140v140H20zM34 52h14v14H34zM34 84h14v14H34zM34 116h14v14H34zM34 148h14v14H34z"/>
        <path d="M37 59l4 4 6-8M37 91l4 4 6-8"/>
        <path d="M180 30h120v140H180zM180 58h120M210 58v112M240 58v112M270 58v112M180 86h120M180 114h120M180 142h120"/>
      </g>
      <g fill="currentColor"><path d="M58 56h80v6H58zM58 88h64v6H58zM58 120h88v6H58zM58 152h52v6H58zM214 90h22v20h-22zM244 118h22v20h-22zM190 36h50v10h-50z"/></g>
    </svg>`,
  };
};
