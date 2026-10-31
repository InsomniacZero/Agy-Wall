/* Antigravity animated themes. All artwork and preferences stay on this device. */
(() => {
  'use strict';
  if (!window.__agyPrependPatched) {
    window.__agyPrependPatched = true;
    const origPrepend = Element.prototype.prepend;
    Element.prototype.prepend = function(...nodes) {
      for (const n of nodes) {
        if (n && n.id === 'agy-ascii-scene') {
          const existing = this.querySelector(':scope > #agy-ascii-scene');
          if (existing && existing !== n) return;
        }
      }
      return origPrepend.apply(this, nodes);
    };
  }
  if (window.__agyAsciiInstalled) return;
  window.__agyAsciiInstalled = true;
  const KEY='asciiWallpaperPreferences.v1';
  const themes=[
    {id:'clouds',name:'Cloud Drift',light:true,sky:'#b4d9ee',floor:'#cceaf8',beam:'#62b9f1',chrome:'#b7e1f3',panel:'#f1faff',card:'#f0faff',fg:'#203645',muted:'#476475',border:'#9bbdce',accent:'#367ca6',ink:'#fffef7',glyph:'#648798'},
    {id:'aurora',name:'Aurora',light:false,sky:'#061220',floor:'#0d2233',beam:'#1f6b62',chrome:'#0a1724',panel:'#0b1826',card:'#16283a',fg:'#e9f4f2',muted:'#a9c4c4',border:'#35506a',accent:'#7cf2b4',ink:'#7cf2b4',glyph:'#10202e'},
    {id:'lagoon',name:'Honu Lagoon',light:false,sky:'#286f70',floor:'#084d63',beam:'#45e0d9',chrome:'#1d6666',panel:'#103c45',card:'#225560',fg:'#effaf6',muted:'#bfdfdb',border:'#49868a',accent:'#a2e2c2',ink:'#e3dcaa',glyph:'#375957'},
    {id:'koi',name:'Koi Pond',light:false,sky:'#315c4f',floor:'#1c493e',beam:'#8ce2bd',chrome:'#2d584b',panel:'#193d34',card:'#315b4e',fg:'#f0f7e9',muted:'#c2d8c3',border:'#638c71',accent:'#dfc890',ink:'#ead0a1',glyph:'#475e39'},
    {id:'jelly',name:'Jellyfish',light:false,sky:'#0c2e3e',floor:'#07111f',beam:'#286db0',chrome:'#0b2c3e',panel:'#0b1520',card:'#172b39',fg:'#edf1f7',muted:'#b6c6d6',border:'#42566e',accent:'#e8a7d0',ink:'#bca5d2',glyph:'#2d3148'},
    {id:'boats',name:'Paper Boats',light:true,sky:'#badbd5',floor:'#d4e8df',beam:'#7ebdc1',chrome:'#c4dfd8',panel:'#f2faf5',card:'#f0f8f3',fg:'#263f3b',muted:'#49665e',border:'#a0bdb2',accent:'#3e7a71',ink:'#fffef2',glyph:'#69887c'},
    {id:'sakura',name:'Sakura',light:true,sky:'#f6dfe7',floor:'#fbeef2',beam:'#f3b8cc',chrome:'#f4dbe4',panel:'#fff7fa',card:'#fff4f7',fg:'#4a2d38',muted:'#7a5866',border:'#e2b8c7',accent:'#c2557d',ink:'#ffffff',glyph:'#a1576f'},
    {id:'fireflies',name:'Fireflies',light:false,sky:'#071a17',floor:'#102b21',beam:'#1b493a',chrome:'#0a1c17',panel:'#0b1b15',card:'#172c22',fg:'#f0f2df',muted:'#b9c8ad',border:'#425e48',accent:'#d5e59d',ink:'#d6df9c',glyph:'#374c2c'},
    {id:'moon',name:'Moonlit',light:false,sky:'#090c1a',floor:'#1e2c60',beam:'#263f91',chrome:'#101528',panel:'#0d1224',card:'#1e263c',fg:'#edf0fa',muted:'#bdc6df',border:'#465375',accent:'#ddd8ad',ink:'#8b9bc8',glyph:'#212943'},
    {id:'dunes',name:'Ember Dunes',light:false,sky:'#2b1534',floor:'#8a4a32',beam:'#c86a3e',chrome:'#231228',panel:'#1f1024',card:'#352032',fg:'#fbeadb',muted:'#d8b8a4',border:'#6a4352',accent:'#ffb46b',ink:'#ffd9a8',glyph:'#3a1f22'},
    {id:'rain',name:'Night Rain',light:false,sky:'#0a1120',floor:'#141d31',beam:'#24365a',chrome:'#0c1322',panel:'#0d1424',card:'#1a2438',fg:'#e8eef8',muted:'#aebbd2',border:'#3a4a68',accent:'#ffd27a',ink:'#8fb4e6',glyph:'#0d1526'},
    {id:'snow',name:'Snowfall',light:true,sky:'#c7d9e8',floor:'#eef4f9',beam:'#ffffff',chrome:'#d6e4ef',panel:'#f6fafd',card:'#f3f8fc',fg:'#1f3242',muted:'#4b6275',border:'#a9bfd0',accent:'#3a6f96',ink:'#ffffff',glyph:'#5e7d94'},
    {id:'lanterns',name:'Sky Lanterns',light:false,sky:'#0b1030',floor:'#141a40',beam:'#3a3470',chrome:'#0c1028',panel:'#0d1230',card:'#1b2146',fg:'#f4eee4',muted:'#c2bccf',border:'#3d4170',accent:'#ffb35c',ink:'#ffcf8a',glyph:'#1c1a3a'},
    {id:'meadow',name:'Windy Meadow',light:true,sky:'#cfe9f3',floor:'#dcefd0',beam:'#9fd38a',chrome:'#d4ebde',panel:'#f6fbf2',card:'#f3f9ee',fg:'#213a24',muted:'#4b6a4c',border:'#a9c9a0',accent:'#3f7f3a',ink:'#ffffff',glyph:'#5e8a52'},
    {id:'galaxy',name:'Spiral Galaxy',light:false,sky:'#06051a',floor:'#0e0a26',beam:'#3a2a7a',chrome:'#09071c',panel:'#0a081e',card:'#181436',fg:'#eeeaff',muted:'#b8b0d8',border:'#3c3570',accent:'#b9a3ff',ink:'#cbbcff',glyph:'#141030'},
    {id:'bamboo',name:'Bamboo Grove',light:true,sky:'#dcebdc',floor:'#e8f1e0',beam:'#b5d6a5',chrome:'#dbe9d6',panel:'#f6faf2',card:'#f2f8ee',fg:'#1f3520',muted:'#4d6a4a',border:'#a7c4a0',accent:'#3e7a36',ink:'#f4fbef',glyph:'#5f8754'},
    {id:'code',name:'Digital Rain',light:false,sky:'#020b06',floor:'#04140b',beam:'#0f5a2a',chrome:'#030d07',panel:'#04110a',card:'#0c2214',fg:'#d9ffe4',muted:'#8fc9a2',border:'#1f5a34',accent:'#5dff8a',ink:'#5dff8a',glyph:'#062a12'},
    {id:'tide',name:'Morning Tide',light:true,sky:'#fbe2d0',floor:'#cfe6ea',beam:'#ffd2b0',chrome:'#f5e0d4',panel:'#fffaf6',card:'#fdf6f0',fg:'#2a3440',muted:'#5a6670',border:'#d9c3b5',accent:'#2f7f95',ink:'#ffffff',glyph:'#7a8f99'},
    {id:'autumn',name:'Autumn Leaves',light:true,sky:'#f6e3c8',floor:'#efd3b0',beam:'#f0b070',chrome:'#f2dcc0',panel:'#fff8ef',card:'#fdf3e6',fg:'#3a2416',muted:'#6e5040',border:'#ddb994',accent:'#c0502a',ink:'#fff6e8',glyph:'#9a6040'},
    {id:'alpine',name:'Alpine Dawn',light:true,sky:'#d6cfee',floor:'#f8e2d4',beam:'#f3c9c6',chrome:'#e2d9f0',panel:'#fbf8ff',card:'#f7f3fd',fg:'#2a2545',muted:'#5a5478',border:'#c4b9de',accent:'#6a5aa8',ink:'#ffffff',glyph:'#8a80b4'},
    {id:'retro',name:'Retro Sunset',light:false,sky:'#0d0221',floor:'#1a0630',beam:'#7a1f8a',chrome:'#10032a',panel:'#10042a',card:'#22104a',fg:'#fbeaff',muted:'#d0b4e0',border:'#5a2a7a',accent:'#ff5ad8',ink:'#ff7ad8',glyph:'#2a0a3a'},
    {id:'lava',name:'Lava Lamp',light:false,sky:'#1a0726',floor:'#3a0d22',beam:'#8a2a3a',chrome:'#16061e',panel:'#170620',card:'#2c1230',fg:'#ffeede',muted:'#d8b4b4',border:'#5e2a44',accent:'#ff9a3c',ink:'#ffb070',glyph:'#2a0a18'},
    {id:'catnap',name:'Starry Catnap',light:false,sky:'#070a24',floor:'#1a1a50',beam:'#4b3fb0',chrome:'#0a0c28',panel:'#0b0e2a',card:'#1b1e44',fg:'#f1eeff',muted:'#bfbcdc',border:'#3f4078',accent:'#f0a95e',ink:'#ffc88a',glyph:'#1b1f4a'}
  ];
  const native=typeof electron_1!=='undefined'?{
    get:()=>electron_1.ipcRenderer.invoke('ascii-wallpapers:get'),
    save:value=>electron_1.ipcRenderer.invoke('ascii-wallpapers:save',{[KEY]:value})
  }:null;
  const windowAPI=typeof electronNativeAPI!=='undefined'?electronNativeAPI:window.electronNative;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let prefs={theme:'clouds',intensity:100,paused:false};
  let alive=true,open=false,sheet,canvas,ctx,host,shadow,style,observer,resizeObserver;
  let sceneWidth=0,sceneHeight=0,calmBox=null;
  let raf=0,last=0,time=0,layoutTimer=0,saveQueue=Promise.resolve(),lastPreview=-1;
  const cleanups=[],modeNodes=new Map();
  let originalChrome;
  const current=()=>themes.find(t=>t.id===prefs.theme)||themes[0];
  function validate(p){return {theme:p?.theme==='off'||themes.some(t=>t.id===p?.theme)?p.theme:'clouds',intensity:Number.isFinite(p?.intensity)?Math.min(100,Math.max(15,p.intensity)):100,paused:typeof p?.paused==='boolean'?p.paused:false};}
  const make=(tag,attrs={},text='')=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;return e;};
  function listen(e,name,fn,options){e.addEventListener(name,fn,options);cleanups.push(()=>e.removeEventListener(name,fn,options));}
  function save(){const value=JSON.stringify(prefs);try{localStorage.setItem(KEY,value);}catch{}if(native){saveQueue=saveQueue.catch(()=>{}).then(()=>native.save(value)).catch(()=>{shadow.querySelector('.status').textContent='Could not save this theme. Please try again.';});}}
  const paletteIcon='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/></svg>';
  const closeIcon='<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>';
  function build(){
    host=make('div',{id:'agy-ascii-controls'});host.style.visibility='hidden';document.body.append(host);shadow=host.attachShadow({mode:'open'});
    const css=make('style');css.textContent=`
      :host{all:initial;position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;pointer-events:none;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:var(--aw-fg,#edf0fa);--aw-panel:#0d1224;--aw-card:#1e263c;--aw-fg:#edf0fa;--aw-muted:#bdc6df;--aw-border:#465375;--aw-accent:#ddd8ad}
      *{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid var(--aw-accent);outline-offset:3px}button:disabled{opacity:.45;cursor:default}[hidden]{display:none!important}
      .trigger{position:fixed;top:5px;right:155px;z-index:2147483647;pointer-events:auto;-webkit-app-region:no-drag;display:flex;align-items:center;gap:6px;height:25px;padding:0 9px;border:1px solid transparent;border-radius:5px;color:var(--aw-fg);background:transparent;font-size:11px}
      .trigger:hover,.trigger[aria-expanded=true]{background:color-mix(in srgb,var(--aw-fg) 10%,transparent)}
      .panel{position:fixed;pointer-events:auto;-webkit-app-region:no-drag;padding:10px;border:1px solid var(--aw-border);border-radius:8px;background:var(--aw-panel);color:var(--aw-fg);box-shadow:0 6px 20px #0000001a}
      .header{display:flex;align-items:center;gap:8px;height:22px;margin:0 2px 8px;font-size:12px;white-space:nowrap}.current{overflow:hidden;text-overflow:ellipsis}.kind{color:var(--aw-muted);font-size:11px}.spacer{flex:1}
      .tools{display:flex;gap:2px}.tool{display:flex;align-items:center;justify-content:center;height:22px;padding:0 7px;border:0;border-radius:4px;color:var(--aw-muted);background:none;font-size:11px}.tool:hover{color:var(--aw-fg);background:color-mix(in srgb,var(--aw-fg) 8%,transparent)}.tool[aria-pressed=true]{color:var(--aw-fg)}
      .choices{display:grid;grid-template-columns:repeat(12,1fr);gap:6px}
      .choice{padding:0;border:0;border-radius:4px;background:none;aspect-ratio:8/5;min-width:0}.choice:focus-visible{outline-offset:2px}
      .preview{display:block;width:100%;height:100%;border-radius:4px;opacity:.8;transition:opacity .12s}.choice:hover .preview,.choice:focus-visible .preview,.choice[aria-pressed=true] .preview{opacity:1}
      .choice[aria-pressed=true]{box-shadow:0 0 0 2px var(--aw-panel),0 0 0 3px var(--aw-fg)}
      .settings{display:flex;align-items:center;gap:10px;margin:10px 2px 0;font-size:11px;color:var(--aw-muted)}.settings label{display:flex;align-items:center;gap:8px}.settings input{width:160px;accent-color:var(--aw-fg)}.value{font-variant-numeric:tabular-nums}.status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
      @media(max-width:900px){.choices{grid-template-columns:repeat(auto-fill,minmax(54px,1fr))}}
      @media(max-width:650px){.kind{display:none}.trigger span{display:none}.trigger{right:145px}.settings input{width:100px}}
      @media(prefers-reduced-motion:reduce){.preview{transition:none}}
    `;shadow.append(css);
    const trigger=make('button',{class:'trigger',type:'button','aria-label':'Choose theme','aria-expanded':'false','aria-controls':'theme-picker',title:'Themes · Ctrl+Alt+W'});trigger.innerHTML=paletteIcon+'<span>Themes</span>';
    const panel=make('section',{class:'panel',id:'theme-picker','aria-label':'ASCII wallpaper themes',hidden:''});
    const header=make('div',{class:'header'});header.append(make('span',{class:'current'}),make('span',{class:'kind'}),make('span',{class:'spacer'}));
    const tools=make('div',{class:'tools'});
    const pause=make('button',{class:'tool pause',type:'button',title:'Pause or resume the wallpaper','aria-pressed':'false'},'Pause');
    const settings=make('button',{class:'tool settings-toggle',type:'button','aria-expanded':'false','aria-controls':'theme-settings'},'Adjust');
    const off=make('button',{class:'tool reset',type:'button',title:'Restore Antigravity’s original appearance'},'Off');
    const close=make('button',{class:'tool close',type:'button','aria-label':'Close theme picker'});close.innerHTML=closeIcon;
    tools.append(pause,settings,off,close);header.append(tools);panel.append(header);
    const choices=make('div',{class:'choices','aria-label':'Themes'});
    // Thumbnails only; the header names whichever one is hovered or focused.
    for(const t of themes){const b=make('button',{class:'choice',type:'button','data-theme':t.id,'aria-pressed':'false','aria-label':`${t.name}, ${t.light?'light':'dark'}`});const preview=make('canvas',{class:'preview',width:'160',height:'100','aria-hidden':'true'});b.append(preview);listen(b,'click',()=>select(t.id));listen(b,'pointerenter',()=>label(t));listen(b,'focus',()=>label(t));choices.append(b);drawAsciiScene(preview.getContext('2d'),160,100,t,10,1);}
    listen(choices,'pointerleave',()=>label());listen(choices,'focusout',e=>{if(!choices.contains(e.relatedTarget))label();});
    panel.append(choices);
    const adjust=make('div',{class:'settings',id:'theme-settings',hidden:''});const intensity=make('label',{},'Intensity');const range=make('input',{type:'range',min:'15',max:'100',step:'1','aria-label':'Wallpaper intensity'});intensity.append(range);adjust.append(intensity,make('span',{class:'value'}));panel.append(adjust,make('div',{class:'status','aria-live':'polite'}));
    shadow.append(trigger,panel);
    listen(trigger,'click',()=>toggle(!open));listen(close,'click',()=>toggle(false));listen(off,'click',()=>select('off'));
    listen(pause,'click',()=>{prefs.paused=!prefs.paused;apply();save();});
    listen(settings,'click',()=>{adjust.hidden=!adjust.hidden;settings.setAttribute('aria-expanded',String(!adjust.hidden));syncLayout();});
    listen(range,'input',()=>{prefs.intensity=Number(range.value);shadow.querySelector('.value').textContent=prefs.intensity+'%';render();});listen(range,'change',save);
    listen(choices,'keydown',e=>{const all=[...choices.children],i=all.indexOf(e.target.closest('.choice'));if(i<0)return;let next=i;if(e.key==='ArrowRight')next=(i+1)%all.length;else if(e.key==='ArrowLeft')next=(i-1+all.length)%all.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=all.length-1;else return;e.preventDefault();all[next].focus();select(all[next].dataset.theme);});
    listen(document,'pointerdown',e=>{if(open&&!e.composedPath().includes(host))toggle(false,false);});
    listen(document,'keydown',e=>{
      if(e.ctrlKey&&e.altKey&&e.code==='KeyW'){e.preventDefault();toggle(!open);}
      if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();toggle(false);}
      const editor=e.target.closest?.('[contenteditable=true],textarea');
      if(e.key==='Enter'&&editor&&(editor.value??editor.textContent).trim()==='/theme'){
        e.preventDefault();e.stopImmediatePropagation();
        if(editor.matches('textarea')){const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(editor,'');editor.dispatchEvent(new Event('input',{bubbles:true}));}
        else{const range=document.createRange();range.selectNodeContents(editor);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);document.execCommand('delete');}
        toggle(true);
      }
    },true);
  }
  function toggle(value,focus=true){open=value;shadow.querySelector('.panel').hidden=!open;shadow.querySelector('.trigger').setAttribute('aria-expanded',String(open));syncLayout();if(open){const b=shadow.querySelector(`[data-theme="${prefs.theme==='off'?'clouds':prefs.theme}"]`);b?.focus({preventScroll:true});b?.scrollIntoView({block:'nearest',inline:'center'});previews(true);}else if(focus)shadow.querySelector('.trigger').focus();}
  function select(id){prefs.theme=id;apply();save();}
  function label(t=prefs.theme==='off'?null:current()){shadow.querySelector('.current').textContent=t?t.name:'Original';shadow.querySelector('.kind').textContent=t?(t.light?'Light':'Dark'):'Antigravity';}
  function syncLayout(){
    if(!host||!sheet)return;
    const bounds=sheet.getBoundingClientRect(),composerElement=sheet.querySelector('.surface-composer, [data-testid="agent-input-box"], #antigravity\\.agentSidePanelInputBox') || document.querySelector('[data-testid="agent-input-box"], #antigravity\\.agentSidePanelInputBox'),composer=composerElement?.getBoundingClientRect();
    const panel=shadow.querySelector('.panel');const width=Math.min(760,bounds.width-38,innerWidth-24);
    const center=composer?composer.x+composer.width/2:bounds.x+bounds.width/2;
    const left=Math.max(bounds.x+16,Math.min(center-width/2,innerWidth-width-16));
    panel.style.width=width+'px';panel.style.left=left+'px';
    const panelHeight=panel.hidden?(innerWidth<=650?220:142):panel.getBoundingClientRect().height;
    const composerGroup=composerElement?.closest('[style*="--max-conversation-width"]')?.getBoundingClientRect();
    // The artwork keeps the live text column calm, whatever the window width.
    const column=composerGroup?.width?composerGroup:composer;
    const next=column?.width?{l:Math.round(column.left-bounds.left),r:Math.round(column.right-bounds.left)}:null;
    if(next?.l!==calmBox?.l||next?.r!==calmBox?.r){calmBox=next;render();}
    const bottomAnchor=composerGroup&&composerGroup.height<350?Math.min(composerGroup.top,composer?.top??innerHeight-85):composer?.top??innerHeight-85;
    const top=Math.max(48,bottomAnchor-panelHeight-12);panel.style.top=top+'px';
  }
  function setMode(t,off){
    const names=['dark','light','dark-theme','light-theme','theme-dark','theme-light'];
    if(off){for(const [e,old]of modeNodes){if(e.isConnected){e.classList.remove(...names);e.classList.add(...old);}}modeNodes.clear();return;}
    const nodes=[document.body,...document.querySelectorAll('#root .dark,#root .light')];
    for(const e of nodes){if(!modeNodes.has(e))modeNodes.set(e,names.filter(c=>e.classList.contains(c)));e.classList.remove(...names);e.classList.add(t.light?'light':'dark');if(e===document.body)e.classList.add(t.light?'light-theme':'dark-theme',t.light?'theme-light':'theme-dark');}
  }
  function appearance(t,off){
    setMode(t,off);
    if(off){delete document.body.dataset.awTheme;delete document.body.dataset.awMode;style.textContent='';host.style.colorScheme='normal';}
    else{
      document.body.dataset.awTheme=t.id;document.body.dataset.awMode=t.light?'light':'dark';host.style.colorScheme=t.light?'light':'dark';
      const tokens={secondary:`color-mix(in srgb,${t.accent} ${t.light?'18':'22'}%,${t.panel})`,background:t.chrome,foreground:t.fg,'secondary-foreground':t.muted,'muted-foreground':t.muted,muted:t.card,card:t.card,'card-border':t.border,border:t.border,sidebar:t.chrome,'sidebar-muted':t.card,'sidebar-secondary':t.panel,primary:t.accent,'primary-foreground':t.fg,'cta-foreground':t.light?'#ffffff':t.sky,popover:t.panel,'popover-foreground':t.fg,accent:t.card,'accent-foreground':t.fg,input:t.border,ring:t.accent};
      const declarations=Object.entries(tokens).flatMap(([k,v])=>[`--${k}:${v}!important`,`--color-${k}:${v}!important`]).join(';');
      const editor=`--editor-code-block-background:${t.panel}!important;--code-foreground:${t.light?'#875632':'#e7c59e'}!important;--editor-selection-background:${t.light?'#538da52e':'#9fbae133'}!important;--color-selection-background:${t.light?'#538da52e':'#9fbae133'}!important;--glass-border:${t.border}!important;--focus-ring-color:${t.accent}!important;--editor-line-number-foreground:${t.muted}!important;--color-editorLineNumber-foreground:${t.muted}!important;`;
      style.textContent=`
        body[data-aw-theme],body[data-aw-theme] #root .dark,body[data-aw-theme] #root .light,body[data-aw-theme] .agy-shell,body[data-aw-theme] [data-testid="title-menu-bar"]{${declarations};${editor}color-scheme:${t.light?'light':'dark'};color:${t.fg}}
        body[data-aw-theme] .agy-shell,body[data-aw-theme] [data-testid="title-menu-bar"]{background:${t.chrome}!important;--max-conversation-width:min(60rem,50vw)!important}
        body[data-aw-theme] [data-aw-sheet],body[data-aw-theme] .agy-sheet,body[data-aw-theme] [data-testid="overview-panel-host"]{isolation:isolate;position:relative;background:${t.sky}!important}
        body[data-aw-theme] [data-aw-sheet] [data-testid="conversation-view"],body[data-aw-theme] [data-aw-sheet] [data-testid="autoscroll-viewport"],body[data-aw-theme] [data-aw-sheet] [class*="pt-[30vh]"]{background:transparent!important}
        body[data-aw-theme] [data-testid="conversation-view"]:not([data-testid="overview-panel-host"] *){isolation:isolate;position:relative;background:${t.sky}!important}
        @media(max-width:900px){body[data-aw-theme] .agy-shell{--max-conversation-width:100%!important}}
        body[data-aw-theme] .agy-sheet,body[data-aw-theme] [data-testid="overview-panel-host"],body[data-aw-theme] [data-testid="conversation-view"]{text-shadow:0 0 2px ${t.light?t.floor:t.sky},0 0 6px ${t.light?t.floor:t.sky},0 0 12px ${t.light?t.floor:t.sky}}
        body[data-aw-theme] .surface-composer,body[data-aw-theme] [data-testid="agent-input-box"]{text-shadow:none}
        body[data-aw-theme] .md-sticky-message-bleed,body[data-aw-theme] .md-sticky-message-bleed::before,body[data-aw-theme] .md-sticky-message-bleed::after{background:transparent!important}
        body[data-aw-theme] .agy-sheet [class*=bottom-0][class*=pointer-events-none],body[data-aw-theme] [data-testid="overview-panel-host"] [class*=bottom-0][class*=pointer-events-none]{background-image:none!important}
        body[data-aw-theme] .surface-composer,body[data-aw-theme] [data-testid="agent-input-box"],body[data-aw-theme] [data-testid="agent-input-box"] .bg-card-border{background:color-mix(in srgb,${t.border} 60%,transparent)!important;box-shadow:0 10px 26px #00000012}
        body[data-aw-theme] .surface-composer-card,body[data-aw-theme] [data-testid="agent-input-box"] .bg-card{background:color-mix(in srgb,${t.card} 92%,transparent)!important}
        body[data-aw-theme] .agy-sidebar-row{--row-bg:${t.chrome}}body[data-aw-theme] ::selection{background:${t.light?'#72b5d34d':'#a4bbe645'}}
        body[data-aw-theme] ::-webkit-scrollbar-thumb{background:color-mix(in srgb,${t.muted} 45%,transparent);border-radius:8px}body[data-aw-theme] input,body[data-aw-theme] textarea,body[data-aw-theme] [contenteditable=true]{caret-color:${t.fg}}
        body[data-aw-mode=light] pre,body[data-aw-mode=light] code{--syntax-string:#477148;--syntax-keyword:#795498;--syntax-comment:#627b72}
      `;
    }
    for(const k of ['panel','card','fg','muted','border','accent'])host.style.setProperty('--aw-'+k,t[k]);
    const colors=off?originalChrome:{color:t.chrome,symbolColor:t.fg};
    if(colors)windowAPI?.setTitleBarOverlay(colors)?.catch?.(()=>{});
  }
  function apply(){
    if(!shadow)return;
    const t=current(),off=prefs.theme==='off';appearance(t,off);
    if(canvas)canvas.hidden=off;
    shadow.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===prefs.theme)));
    const pause=shadow.querySelector('.pause');pause.textContent=prefs.paused?'Play':'Pause';pause.setAttribute('aria-pressed',String(prefs.paused));pause.disabled=off;
    shadow.querySelector('input').value=String(prefs.intensity);shadow.querySelector('input').disabled=off;
    shadow.querySelector('.value').textContent=prefs.intensity+'%';label();
    shadow.querySelector('.status').textContent=off?'Original appearance restored':`${t.name}, ${t.light?'light':'dark'} appearance`;
    render();syncLayout();schedule();
  }
  function mount(){
    const pt30=document.querySelector('[class*="pt-[30vh]"]');
    const mobileHome=document.querySelector('.overflow-y-auto.flex.flex-col.gap-3.pt-3');
    const next=document.querySelector('.agy-sheet, [data-testid="overview-panel-host"], [data-testid="conversation-view"]')
      || pt30?.parentElement || mobileHome?.parentElement;
    if(!next)return;host.style.visibility='visible';
    const existing=next.querySelector(':scope > #agy-ascii-scene');
    if(sheet!==next||!existing||!canvas?.isConnected){
      resizeObserver?.disconnect();
      document.querySelectorAll('#agy-ascii-scene').forEach(c=>{if(c!==existing)c.remove();});
      sheet?.removeAttribute?.('data-aw-sheet');
      sheet=next;
      sheet.setAttribute('data-aw-sheet','');
      if(!existing){
        canvas=make('canvas',{id:'agy-ascii-scene','aria-hidden':'true'});
        Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'-1',pointerEvents:'none'});
        sheet.prepend(canvas);
      } else {
        canvas=existing;
      }
      ctx=canvas.getContext('2d',{alpha:false});
      resizeObserver=new ResizeObserver(()=>{resize();render();syncLayout();});
      resizeObserver.observe(sheet);
      resize();
      apply();
    }
    else{syncLayout();}
  }
  function resize(){const r=sheet.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);sceneWidth=r.width;sceneHeight=r.height;canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);}
  function render(){if(ctx&&canvas&&!canvas.hidden){drawAsciiScene(ctx,sceneWidth,sceneHeight,current(),time,.35+.65*prefs.intensity/100,calmBox);}}
  function previews(all=false){if(!shadow||!open)return;for(const t of themes){if(!all&&t.id!==prefs.theme)continue;const c=shadow.querySelector(`[data-theme="${t.id}"] canvas`);drawAsciiScene(c.getContext('2d'),c.width,c.height,t,time,1);}}
  function schedule(){cancelAnimationFrame(raf);raf=0;last=performance.now();if(alive&&!document.hidden&&!prefs.paused&&prefs.theme!=='off')raf=requestAnimationFrame(tick);}
  function tick(now){if(now-last>=33){time+=Math.min((now-last)/1000,.1);last=now;render();if(open&&Math.floor(time*5)!==lastPreview){lastPreview=Math.floor(time*5);previews();}}raf=requestAnimationFrame(tick);}
  function dispose(){alive=false;cancelAnimationFrame(raf);clearTimeout(layoutTimer);observer?.disconnect();resizeObserver?.disconnect();cleanups.forEach(f=>f());setMode(current(),true);delete document.body.dataset.awTheme;delete document.body.dataset.awMode;sheet?.removeAttribute?.('data-aw-sheet');document.querySelectorAll('#agy-ascii-scene').forEach(c=>c.remove());host?.remove();style?.remove();if(originalChrome)windowAPI?.setTitleBarOverlay(originalChrome)?.catch?.(()=>{});window.__agyAsciiInstalled=false;}
  async function start(){
    try{const data=native?await native.get():null;const raw=data?.[KEY]||localStorage.getItem(KEY);if(raw)prefs=validate(JSON.parse(raw));}catch{}
    const shell=document.querySelector('.agy-shell, [data-testid="title-menu-bar"]')||document.body;const computed=getComputedStyle(shell);originalChrome={color:computed.getPropertyValue('--background').trim()||'#101010',symbolColor:computed.getPropertyValue('--foreground').trim()||'#cccccc'};
    style=make('style',{id:'agy-ascii-style'});document.head.append(style);build();apply();mount();
    observer=new MutationObserver(()=>{if(!layoutTimer)layoutTimer=setTimeout(()=>{layoutTimer=0;mount();},120);});observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
    listen(window,'resize',syncLayout);listen(document,'visibilitychange',()=>{render();syncLayout();schedule();});listen(reduced,'change',()=>{if(reduced.matches){prefs.paused=true;apply();save();}});listen(window,'pagehide',()=>{alive=false;cancelAnimationFrame(raf);observer?.disconnect();resizeObserver?.disconnect();});
    window.__agyAsciiDispose=dispose;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
