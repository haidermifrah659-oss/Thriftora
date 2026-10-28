/* Shared chrome is injected on every page; page content remains in its HTML. */
(function () {
  const config=window.THRIFTORA_CONFIG, page=document.body.dataset.page||'';
  const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const header=document.createElement('header');
  header.className='site-header';
  header.innerHTML=`<div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Thriftora home"><span class="brand-mark">T</span> thriftora</a>
    <nav class="nav-links" aria-label="Main navigation">
      <a href="index.html" data-nav="home">Home</a><a href="shop.html" data-nav="shop">Shop</a><a href="about.html" data-nav="about">About</a><a href="contact.html" data-nav="contact">Contact</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" type="button" data-search-open aria-label="Search products"><span aria-hidden="true">⌕</span></button>
      <button class="icon-btn" type="button" data-wishlist-open aria-label="Open wishlist">♡<span class="count" data-wishlist-count>0</span></button>
      <a class="icon-btn" href="cart.html" aria-label="Shopping cart">▱<span class="count" data-cart-count>0</span></a>
      <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle><span aria-hidden="true">☰</span></button>
    </div>
  </div>`;
  document.body.prepend(header);
  const menu=document.createElement('nav');
  menu.className='mobile-menu';menu.setAttribute('aria-label','Mobile navigation');
  menu.innerHTML='<a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a><a href="cart.html">Cart</a>';
  header.after(menu);
  const footer=document.createElement('footer');
  footer.className='site-footer';
  footer.innerHTML=`<div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><a class="brand" href="index.html"><span class="brand-mark">T</span> thriftora</a><p>Good clothes deserve a second story. Curated pre-loved finds, delivered across Pakistan.</p><span class="badge">Cash on delivery available</span></div>
      <div><h3>Explore</h3><div class="footer-links"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a></div></div>
      <div><h3>Policies</h3><div class="footer-links"><a href="policies.html#shipping">Shipping</a><a href="policies.html#returns">Returns &amp; exchange</a><a href="policies.html#terms">Terms</a><a href="policies.html#privacy">Privacy</a></div></div>
      <div><h3>Say hello</h3><div class="footer-links"><a href="contact.html#faq">FAQs</a><a href="${esc(config.socials.instagram)}" target="_blank" rel="noopener">Instagram</a><a href="${esc(config.socials.tiktok)}" target="_blank" rel="noopener">TikTok</a><a href="${esc(config.socials.facebook)}" target="_blank" rel="noopener">Facebook</a></div></div>
    </div>
    <div class="footer-bottom"><span>© <span data-year></span> Thriftora. Made for another life.</span><span>Thoughtful finds. Nationwide delivery.</span></div>
  </div>`;
  document.body.append(footer);
  const overlay=document.createElement('div');overlay.className='overlay';overlay.dataset.overlay='';
  overlay.setAttribute('aria-hidden','true');
  const drawer=document.createElement('aside');drawer.className='drawer';drawer.setAttribute('aria-label','Wishlist');drawer.setAttribute('aria-modal','true');drawer.setAttribute('role','dialog');
  drawer.innerHTML='<div class="drawer-head"><h2 style="font-size:1.6rem;margin:0">Your wishlist</h2><button class="icon-btn" type="button" data-drawer-close aria-label="Close wishlist">✕</button></div><div class="drawer-content" data-drawer-items></div><div class="drawer-foot"><a class="btn btn-primary" href="shop.html">Find more good stuff</a></div>';
  const cartDrawer=document.createElement('aside');cartDrawer.className='drawer';cartDrawer.setAttribute('aria-label','Mini cart');cartDrawer.setAttribute('aria-modal','true');cartDrawer.setAttribute('role','dialog');
  cartDrawer.innerHTML='<div class="drawer-head"><h2 style="font-size:1.6rem;margin:0">In your tote</h2><button class="icon-btn" type="button" data-cart-drawer-close aria-label="Close mini cart">✕</button></div><div class="drawer-content" data-mini-cart-items></div><div class="drawer-foot" data-mini-cart-foot></div>';
  const search=document.createElement('section');search.className='search-overlay';search.setAttribute('aria-label','Product search');search.setAttribute('aria-modal','true');search.setAttribute('role','dialog');
  search.innerHTML='<div class="search-top"><a class="brand" href="index.html"><span class="brand-mark">T</span> thriftora</a><button type="button" class="icon-btn" data-search-close aria-label="Close search">✕</button></div><label class="eyebrow" for="site-search">Find your next favourite</label><input id="site-search" class="search-input" type="search" placeholder="Try denim, dresses, jackets…" autocomplete="off"><div class="search-results" data-search-results aria-live="polite"></div>';
  const toastRegion=document.createElement('div');toastRegion.className='toast-region';toastRegion.setAttribute('aria-live','polite');toastRegion.setAttribute('aria-atomic','false');
  document.body.append(overlay,drawer,cartDrawer,search,toastRegion);
  document.querySelector('[data-year]').textContent=new Date().getFullYear();
  const active=page==='index'?'home':page;
  document.querySelectorAll('[data-nav]').forEach(link=>{if(link.dataset.nav===active){link.classList.add('active');link.setAttribute('aria-current','page')}});
  let lastFocus=null;
  const closeDrawer=()=>{drawer.classList.remove('open');overlay.classList.remove('open');document.body.classList.remove('locked');if(lastFocus)lastFocus.focus()};
  const openDrawer=()=>{lastFocus=document.activeElement;drawer.classList.add('open');overlay.classList.add('open');document.body.classList.add('locked');drawer.querySelector('[data-drawer-close]').focus()};
  const closeCartDrawer=()=>{cartDrawer.classList.remove('open');overlay.classList.remove('open');document.body.classList.remove('locked');if(lastFocus)lastFocus.focus()};
  const openCartDrawer=()=>{lastFocus=document.activeElement;cartDrawer.classList.add('open');overlay.classList.add('open');document.body.classList.add('locked');cartDrawer.querySelector('[data-cart-drawer-close]').focus()};
  window.ThriftoraOpenMiniCart=openCartDrawer;
  document.querySelector('[data-wishlist-open]').addEventListener('click',openDrawer);
  drawer.querySelector('[data-drawer-close]').addEventListener('click',closeDrawer);
  cartDrawer.querySelector('[data-cart-drawer-close]').addEventListener('click',closeCartDrawer);
  overlay.addEventListener('click',()=>{closeDrawer();closeCartDrawer()});
  const closeSearch=()=>{search.classList.remove('open');document.body.classList.remove('locked');if(lastFocus)lastFocus.focus()};
  document.querySelector('[data-search-open]').addEventListener('click',()=>{lastFocus=document.activeElement;search.classList.add('open');document.body.classList.add('locked');search.querySelector('input').focus()});
  search.querySelector('[data-search-close]').addEventListener('click',closeSearch);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeDrawer();closeCartDrawer();closeSearch();menu.classList.remove('open');document.body.classList.remove('locked');document.querySelector('[data-menu-toggle]').setAttribute('aria-expanded','false')}
    const activeDialog=drawer.classList.contains('open')?drawer:(cartDrawer.classList.contains('open')?cartDrawer:(search.classList.contains('open')?search:null));
    if(event.key==='Tab'&&activeDialog){const focusable=[...activeDialog.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
  });
  const toggle=document.querySelector('[data-menu-toggle]');
  toggle.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('locked',open)});
  let previousY=window.scrollY;
  window.addEventListener('scroll',()=>{const y=window.scrollY;if(y>120&&y>previousY)header.classList.add('header-hidden');else header.classList.remove('header-hidden');previousY=y},{passive:true});
  const imgSrc=product=>product.images[0]||window.THRIFTORA_IMAGE_FALLBACK;
  window.ThriftoraToast=(message,actionText,actionHref)=>{
    const toast=document.createElement('div');toast.className='toast';toast.append(document.createTextNode(message));
    if(actionText&&actionHref){const link=document.createElement('a');link.href=actionHref;link.textContent=actionText;toast.append(link)}
    toastRegion.append(toast);window.setTimeout(()=>toast.remove(),5000);
  };
  const renderSearch=query=>{
    const resultBox=search.querySelector('[data-search-results]'),term=query.trim().toLowerCase();
    resultBox.replaceChildren();
    if(!term)return;
    const matches=window.THRIFTORA_PRODUCTS.filter(p=>`${p.name} ${p.category} ${p.color} ${p.brand}`.toLowerCase().includes(term)).slice(0,8);
    if(!matches.length){const empty=document.createElement('p');empty.className='muted';empty.textContent='No finds for that search yet.';resultBox.append(empty);return}
    matches.forEach(p=>{const a=document.createElement('a');a.className='product-card';a.href=`product.html?id=${encodeURIComponent(p.id)}`;a.innerHTML=`<span class="product-image"><img src="${esc(imgSrc(p))}" alt="${esc(p.name)}" loading="lazy" width="600" height="760"></span><span class="product-meta"><span><strong>${esc(p.name)}</strong><small class="muted" style="display:block">${esc(p.category)}</small></span><b>${window.ThriftoraStore.formatPrice(p.price)}</b></span>`;resultBox.append(a)});
  };
  search.querySelector('input').addEventListener('input',event=>renderSearch(event.target.value));
  const renderWishlist=()=>{
    const box=drawer.querySelector('[data-drawer-items]');box.replaceChildren();
    const ids=window.ThriftoraStore.getWishlist();
    if(!ids.length){box.textContent='Save the pieces you love and they’ll show up here.';return}
    ids.forEach(id=>{const p=window.THRIFTORA_PRODUCTS.find(item=>item.id===id);if(!p)return;const row=document.createElement('div');row.className='drawer-item';row.innerHTML=`<img src="${esc(imgSrc(p))}" alt="${esc(p.name)}" width="140" height="175"><div><a href="product.html?id=${encodeURIComponent(p.id)}"><strong>${esc(p.name)}</strong></a><p>${window.ThriftoraStore.formatPrice(p.price)}</p></div><button class="icon-btn" data-remove-wish="${esc(p.id)}" aria-label="Remove ${esc(p.name)} from wishlist">×</button>`;box.append(row)});
    box.querySelectorAll('[data-remove-wish]').forEach(btn=>btn.addEventListener('click',()=>window.ThriftoraStore.toggleWish(btn.dataset.removeWish)));
  };
  const renderMiniCart=()=>{
    const box=cartDrawer.querySelector('[data-mini-cart-items]'),foot=cartDrawer.querySelector('[data-mini-cart-foot]');
    box.replaceChildren();foot.replaceChildren();
    const items=window.ThriftoraStore.getCart().map(item=>({item,p:window.THRIFTORA_PRODUCTS.find(product=>product.id===item.id)})).filter(row=>row.p);
    if(!items.length){box.textContent='Your tote is empty. The next one-of-a-kind find is waiting.';const shop=document.createElement('a');shop.className='btn btn-primary';shop.href='shop.html';shop.textContent='Explore the shop';foot.append(shop);return}
    items.forEach(({item,p})=>{const row=document.createElement('div');row.className='drawer-item';row.innerHTML=`<a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${esc(imgSrc(p))}" alt="${esc(p.name)}" width="140" height="175"></a><div><a href="product.html?id=${encodeURIComponent(p.id)}"><strong>${esc(p.name)}</strong></a><p>Size: ${esc(item.size)} · ${item.quantity}</p></div><strong>${window.ThriftoraStore.formatPrice(p.price*item.quantity)}</strong>`;box.append(row)});
    const total=window.ThriftoraStore.subtotal(),delivery=total>=config.freeDeliveryThreshold?0:config.deliveryCharge;
    const subtotal=document.createElement('div');subtotal.className='summary-row';subtotal.innerHTML=`<span>Subtotal</span><strong>${window.ThriftoraStore.formatPrice(total)}</strong>`;
    const deliveryRow=document.createElement('div');deliveryRow.className='summary-row';deliveryRow.innerHTML=`<span>Delivery</span><strong>${delivery?window.ThriftoraStore.formatPrice(delivery):'Free'}</strong>`;
    const cartLink=document.createElement('a');cartLink.className='btn btn-ghost';cartLink.href='cart.html';cartLink.style.width='100%';cartLink.textContent='View cart';
    const checkoutLink=document.createElement('a');checkoutLink.className='btn btn-primary';checkoutLink.href='checkout.html';checkoutLink.style.width='100%';checkoutLink.style.marginTop='.5rem';checkoutLink.textContent='Checkout';
    foot.append(subtotal,deliveryRow,cartLink,checkoutLink);
  };
  const updateCounts=()=>{
    const cartQty=window.ThriftoraStore.getCart().reduce((sum,item)=>sum+item.quantity,0),wishQty=window.ThriftoraStore.getWishlist().length;
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartQty);
    document.querySelectorAll('[data-wishlist-count]').forEach(el=>el.textContent=wishQty);
    renderWishlist();
    renderMiniCart();
    document.querySelectorAll('[data-wish-id]').forEach(button=>{const wished=window.ThriftoraStore.getWishlist().includes(button.dataset.wishId);button.classList.toggle('selected',wished);button.setAttribute('aria-pressed',String(wished));button.textContent=wished?'♥':'♡'});
  };
  window.addEventListener('thriftora:state',updateCounts);updateCounts();
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||link.target||link.origin!==location.origin||!/\.(html)(?:$|[?#])/.test(link.href)||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(link.href===location.href)return;
    event.preventDefault();document.body.classList.add('page-leaving');window.setTimeout(()=>location.href=link.href,160);
  });
})();
