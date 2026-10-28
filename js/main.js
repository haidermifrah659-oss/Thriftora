/* Page-specific rendering and interactions. Catalog/user text is escaped before templating. */
(function(){
  const P=window.THRIFTORA_PRODUCTS,C=window.THRIFTORA_CONFIG,S=window.ThriftoraStore;
  const $=(selector,root=document)=>root.querySelector(selector), $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const price=value=>S.formatPrice(value), image=p=>p.images[0]||window.THRIFTORA_IMAGE_FALLBACK;
  const toast=(...args)=>window.ThriftoraToast&&window.ThriftoraToast(...args);
  const productCard=p=>`<article class="product-card"><a class="product-image" href="product.html?id=${encodeURIComponent(p.id)}"><img src="${esc(image(p))}" alt="${esc(p.name)}" loading="lazy" width="700" height="900" onerror="this.onerror=null;this.src='${esc(window.THRIFTORA_IMAGE_FALLBACK)}'"><span class="product-badges">${p.isNew?'<span class="badge badge-accent">Just in</span>':''}<span class="badge">${esc(p.condition)}</span></span></a><button class="wish-toggle" type="button" data-wish-id="${esc(p.id)}" aria-label="Add ${esc(p.name)} to wishlist" aria-pressed="false">♡</button><div class="product-meta"><div><a href="product.html?id=${encodeURIComponent(p.id)}"><h3>${esc(p.name)}</h3></a><p>${esc(p.category)} · ${esc(p.color)}</p></div><div class="product-price">${price(p.price)}${p.oldPrice?`<br><span class="old-price">${price(p.oldPrice)}</span>`:''}</div></div></article>`;
  const renderProducts=(container,items)=>{if(!container)return;container.innerHTML=items.map(productCard).join('');$$('[data-wish-id]',container).forEach(btn=>{const selected=S.getWishlist().includes(btn.dataset.wishId);btn.classList.toggle('selected',selected);btn.setAttribute('aria-pressed',String(selected));btn.textContent=selected?'♥':'♡';btn.addEventListener('click',()=>{S.toggleWish(btn.dataset.wishId);toast('Wishlist updated')})});};
  const crumbs=items=>`<nav class="breadcrumb" aria-label="Breadcrumb">${items.map((item,i)=>`${i?'<span aria-hidden="true">/</span>':''}${item.href?`<a href="${esc(item.href)}">${esc(item.label)}</a>`:`<span aria-current="page">${esc(item.label)}</span>`}`).join('')}</nav>`;
  const setTitle=(title,description)=>{document.title=title;const meta=$('meta[name="description"]');if(meta)meta.content=description};
  const renderHome=()=>{
    setTitle('Thriftora — Good clothes deserve a second story','Shop one-of-one pre-loved fashion in Pakistan. Thoughtfully curated thrift, with Cash on Delivery.');
    renderProducts($('#new-arrivals'),P.filter(p=>p.isNew).slice(0,8));
    const categories=[['Men','men'],['Women','women'],['Kids','kids'],['Jackets','jackets'],['Accessories','accessories']];
    const categoryBox=$('#category-grid');
    categoryBox.innerHTML=categories.map(([name,cat],i)=>`<a class="category-card" href="shop.html?category=${encodeURIComponent(name)}"><img src="${esc(image(P.find(p=>p.category===name)||P[i]))}" alt="${esc(name)} thrift fashion" loading="lazy" width="500" height="650"><strong>${esc(name)}</strong><span aria-hidden="true">↗</span></a>`).join('');
    const reviews=[['“My jacket arrived exactly as pictured. The little details make this feel special.”','Ayesha K. · Lahore'],['“Finally thrift shopping without the endless scrolling. Love my new-to-me finds.”','Hamza R. · Karachi'],['“The sizing notes were spot on, and delivery was quick. I’m already back for more.”','Sara M. · Islamabad']];
    let active=0;const track=$('.review-track');if(track){track.innerHTML=reviews.map(([text,name])=>`<article class="review-card"><p class="review-stars" aria-label="5 out of 5 stars">★★★★★</p><p>${esc(text)}</p><strong>${esc(name)}</strong></article>`).join('');const shift=()=>track.style.transform=`translateX(-${active*min(436,window.innerWidth*.85+16)}px)`;const min=(a,b)=>Math.min(a,b);$('[data-review-prev]').addEventListener('click',()=>{active=(active+reviews.length-1)%reviews.length;shift()});$('[data-review-next]').addEventListener('click',()=>{active=(active+1)%reviews.length;shift()});let timer=setInterval(()=>{if(!document.hidden){active=(active+1)%reviews.length;shift()}},5500);track.parentElement.addEventListener('mouseenter',()=>clearInterval(timer),{once:true});let startX=0;track.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});track.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45){active=(active+(delta<0?1:reviews.length-1))%reviews.length;shift()}},{passive:true})}
    const newsletter=$('[data-newsletter]');newsletter&&newsletter.addEventListener('submit',e=>{e.preventDefault();const email=$('#newsletter-email');if(!email.reportValidity())return;toast('You’re on the list. Thanks for being here!');newsletter.reset()});
  };
  const renderShop=()=>{
    setTitle('Shop pre-loved fashion — Thriftora','Browse one-of-one thrifted clothing and accessories. Filter by size, category and condition.');
    const params=new URLSearchParams(location.search),state={category:params.get('category')||'',size:params.get('size')||'',condition:params.get('condition')||'',max:Number(params.get('max'))||10000,sort:params.get('sort')||'newest',q:params.get('q')||'',shown:12};
    const category=$('#category-filter'),size=$('#size-filter'),condition=$('#condition-filter'),priceRange=$('#price-range'),priceLabel=$('#price-label'),sort=$('#sort-select'),search=$('#shop-search'),grid=$('#shop-products'),chips=$('#filter-chips'),load=$('#load-more');
    const categories=[...new Set(P.map(p=>p.category))].sort(),sizes=[...new Set(P.flatMap(p=>p.sizes))].sort();
    category.innerHTML='<option value="">All categories</option>'+categories.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    size.innerHTML='<option value="">All sizes</option>'+sizes.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    category.value=state.category;size.value=state.size;condition.value=state.condition;priceRange.value=String(Math.min(state.max,10000));priceLabel.textContent=price(state.max);sort.value=state.sort;search.value=state.q;
    const sync=()=>{
      state.category=category.value;state.size=size.value;state.condition=condition.value;state.max=Number(priceRange.value);state.sort=sort.value;state.q=search.value.trim();
      const current=new URLSearchParams();[['category',state.category],['size',state.size],['condition',state.condition],['max',state.max<10000?state.max:''],['sort',state.sort==='newest'?'':state.sort],['q',state.q]].forEach(([k,v])=>v&&current.set(k,v));
      history.replaceState(null,'',`${location.pathname}${current.size?'?'+current.toString():''}`);
      const filters=P.filter(p=>(!state.category||p.category===state.category)&&(!state.size||p.sizes.includes(state.size))&&(!state.condition||p.condition===state.condition)&&p.price<=state.max&&(!state.q||`${p.name} ${p.category} ${p.color} ${p.brand}`.toLowerCase().includes(state.q.toLowerCase())));
      filters.sort(state.sort==='low'?(a,b)=>a.price-b.price:state.sort==='high'?(a,b)=>b.price-a.price:(a,b)=>Number(b.isNew)-Number(a.isNew));
      chips.innerHTML='';[['category',state.category],['size',state.size],['condition',state.condition],['q',state.q],['max',state.max<10000?`Up to ${price(state.max)}`:'']].filter(x=>x[1]).forEach(([key,value])=>{const b=document.createElement('button');b.className='chip';b.type='button';b.textContent=`${value} ×`;b.addEventListener('click',()=>{if(key==='category')category.value='';if(key==='size')size.value='';if(key==='condition')condition.value='';if(key==='q')search.value='';if(key==='max')priceRange.value='10000';state.shown=12;sync()});chips.append(b)});
      $('#shop-count').textContent=`${filters.length} ${filters.length===1?'piece':'pieces'}`;
      const shown=filters.slice(0,state.shown);
      renderProducts(grid,shown);
      $('#shop-empty').hidden=filters.length>0;
      load.hidden=filters.length<=state.shown;
    };
    [category,size,condition,priceRange,sort].forEach(el=>el.addEventListener('input',()=>{state.shown=12;priceLabel.textContent=price(Number(priceRange.value));sync()}));
    search.addEventListener('input',()=>{state.shown=12;sync()});
    $('#clear-filters').addEventListener('click',()=>{category.value=size.value=condition.value='';priceRange.value='10000';search.value='';sort.value='newest';state.shown=12;sync()});
    load.addEventListener('click',()=>{state.shown+=8;sync()});
    const filters=$('.filters'),filterBtn=$('[data-mobile-filter]');filterBtn.addEventListener('click',()=>{const open=filters.classList.toggle('mobile-open');filterBtn.setAttribute('aria-expanded',String(open))});
    sync();
  };
  const renderProduct=()=>{
    const id=new URLSearchParams(location.search).get('id'),p=P.find(item=>item.id===id),target=$('#product-detail');
    if(!p){setTitle('Piece not found — Thriftora','This one-of-a-kind piece may have found a new home. Browse our shop for another find.');target.innerHTML=`<div class="empty-state"><span class="eyebrow">Looks like this piece moved on</span><h1>Find another favourite.</h1><p>Every Thriftora piece is one of a kind. There are plenty more stories to discover.</p><a class="btn btn-primary" href="shop.html">Explore the shop</a></div>`;return}
    setTitle(`${p.name} — Thriftora`,p.description);
    target.innerHTML=`<div class="container">${crumbs([{label:'Home',href:'index.html'},{label:'Shop',href:'shop.html'},{label:p.category,href:`shop.html?category=${encodeURIComponent(p.category)}`},{label:p.name}])}
      <div class="product-detail"><div><div class="gallery-main"><img id="main-product-image" src="${esc(image(p))}" alt="${esc(p.name)}" width="900" height="1100" onerror="this.onerror=null;this.src='${esc(window.THRIFTORA_IMAGE_FALLBACK)}'"></div><div class="thumbs">${p.images.map((src,i)=>`<button type="button" class="${i===0?'active':''}" data-image="${esc(src)}" aria-label="View product image ${i+1}"><img src="${esc(src)}" alt="" width="140" height="140" loading="lazy" onerror="this.onerror=null;this.src='${esc(window.THRIFTORA_IMAGE_FALLBACK)}'"></button>`).join('')}</div></div>
      <section class="detail-info"><span class="badge ${p.condition==='Like New'?'badge-accent':''}">${esc(p.condition)}</span><p class="eyebrow">${esc(p.category)} · ${esc(p.color)}</p><h1>${esc(p.name)}</h1><div class="detail-price">${price(p.price)} ${p.oldPrice?`<span class="old-price">${price(p.oldPrice)}</span>`:''}</div><p>${esc(p.description)}</p><p class="eyebrow">Only 1 piece available</p><p class="muted">Each find is one of a kind. Once it’s gone, it’s gone.</p>
        <fieldset class="field" style="border:0;padding:0"><legend class="eyebrow">Choose size</legend><div class="size-options">${p.sizes.map((s,i)=>`<label class="size-option"><input type="radio" name="size" value="${esc(s)}" ${i===0?'checked':''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>
        <label class="eyebrow" for="product-qty">Quantity · one available</label><div class="qty-control"><button type="button" disabled aria-label="Decrease quantity">−</button><input id="product-qty" type="number" min="1" max="1" value="1" readonly><button type="button" disabled aria-label="Increase quantity">+</button></div>
        <div class="detail-actions"><button class="btn btn-primary" type="button" data-add-cart>Add to cart</button><button class="btn btn-secondary" type="button" data-buy-now>Buy now</button><button class="btn btn-ghost" type="button" data-wish-id="${esc(p.id)}" aria-label="Add to wishlist" aria-pressed="false">♡</button><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Have a look at ${p.name}: ${location.href}`)}" aria-label="Share this piece on WhatsApp">Share ↗</a></div>
        <p class="muted" style="margin-top:1rem">Cash on Delivery available · Nationwide shipping</p>
        <div class="accordion"><details><summary>Piece details</summary><p>${esc(p.description)}</p><table class="measure-table">${Object.entries(p.measurements).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></details><details><summary>Shipping</summary><p>Delivery across Pakistan usually takes 3–5 working days. ${C.freeDeliveryThreshold?`Free delivery on orders over ${price(C.freeDeliveryThreshold)}.`:''} <a href="policies.html#shipping">Read shipping details</a>.</p></details><details><summary>Returns &amp; exchange</summary><p>Because thrift finds are one of a kind, please check measurements before ordering. <a href="policies.html#returns">Read our returns policy</a>.</p></details></div>
      </section></div></div><section class="container section-tight"><div class="section-head"><div><span class="eyebrow">More good finds</span><h2>You may also love</h2></div><a class="btn btn-ghost" href="shop.html?category=${encodeURIComponent(p.category)}">Shop ${esc(p.category)}</a></div><div class="product-grid" id="related-products"></div></section>`;
    const mainImage=$('#main-product-image');
    $$('[data-image]',target).forEach(btn=>btn.addEventListener('click',()=>{mainImage.src=btn.dataset.image;$$('[data-image]',target).forEach(b=>b.classList.toggle('active',b===btn))}));
    const qty=$('#product-qty');
    const add=()=>{const selected=$('input[name="size"]:checked',target);if(!selected){toast('Choose a size before adding this piece.');return}S.add(p,selected.value,Number(qty.value));toast(`${p.name} added to your cart.`,'View cart','cart.html');if(window.ThriftoraOpenMiniCart)window.ThriftoraOpenMiniCart()};
    $('[data-add-cart]',target).addEventListener('click',add);
    $('[data-buy-now]',target).addEventListener('click',()=>{add();location.href='checkout.html'});
    $('[data-wish-id]',target).addEventListener('click',event=>{const wished=S.toggleWish(p.id);event.currentTarget.textContent=wished?'♥':'♡';toast(wished?'Saved to your wishlist.':'Removed from your wishlist.')});
    mainImage.addEventListener('mousemove',event=>{if(matchMedia('(pointer:fine)').matches){const r=mainImage.getBoundingClientRect();mainImage.style.transformOrigin=`${(event.clientX-r.left)/r.width*100}% ${(event.clientY-r.top)/r.height*100}%`;mainImage.style.transform='scale(1.45)'}});
    mainImage.parentElement.addEventListener('mouseleave',()=>{mainImage.style.transform='scale(1)';mainImage.style.transformOrigin='center'});
    renderProducts($('#related-products'),P.filter(item=>item.id!==p.id&&(item.category===p.category||item.gender===p.gender)).slice(0,4));
  };
  const cartContents=()=>S.getCart().map(item=>({item,p:P.find(product=>product.id===item.id)})).filter(row=>row.p);
  const totals=()=>{const subtotal=S.subtotal(),delivery=subtotal===0||subtotal>=C.freeDeliveryThreshold?0:C.deliveryCharge;return{subtotal,delivery,total:subtotal+delivery}};
  const renderCart=()=>{
    setTitle('Your cart — Thriftora','Review your Thriftora finds before checkout.');
    const box=$('#cart-items'),summary=$('#cart-summary');
    const draw=()=>{
      const rows=cartContents();box.replaceChildren();
      if(!rows.length){box.innerHTML='<div class="empty-state"><span class="eyebrow">Nothing in your tote</span><h2>Your next favourite is out there.</h2><p>Every piece is one of a kind. Start exploring.</p><a class="btn btn-primary" href="shop.html">Continue shopping</a></div>';summary.hidden=true;return}
      summary.hidden=false;
      rows.forEach(({item,p})=>{const row=document.createElement('article');row.className='cart-item';row.innerHTML=`<a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${esc(image(p))}" alt="${esc(p.name)}" width="210" height="260"></a><div><h3><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3><p class="muted">Size: ${esc(item.size)} · ${esc(p.condition)}</p><div class="qty-control"><button type="button" data-cart-qty="-1" aria-label="Decrease quantity">−</button><span style="padding:.4rem">${item.quantity}</span><button type="button" data-cart-qty="1" aria-label="Increase quantity">+</button></div><br><button class="remove-btn" type="button" data-remove>Remove</button></div><div class="item-end"><strong class="product-price">${price(p.price*item.quantity)}</strong></div>`;row.querySelectorAll('[data-cart-qty]').forEach(btn=>btn.addEventListener('click',()=>S.setQuantity(p.id,item.size,item.quantity+Number(btn.dataset.cartQty))));row.querySelector('[data-remove]').addEventListener('click',()=>S.remove(p.id,item.size));box.append(row)});
      const t=totals();summary.innerHTML=`<h2 style="font-size:1.7rem">Order summary</h2><div class="summary-row"><span>Subtotal</span><span>${price(t.subtotal)}</span></div><div class="summary-row"><span>Delivery</span><span>${t.delivery?price(t.delivery):'Free'}</span></div>${t.subtotal<C.freeDeliveryThreshold?`<p class="muted">Free delivery over ${price(C.freeDeliveryThreshold)}.</p>`:''}<div class="summary-row summary-total"><span>Total</span><span>${price(t.total)}</span></div><a class="btn btn-primary" style="width:100%;margin-top:1rem" href="checkout.html">Proceed to checkout</a><a class="btn btn-ghost" style="width:100%;margin-top:.6rem" href="shop.html">Continue shopping</a>`;
    };
    draw();window.addEventListener('thriftora:state',draw);
  };
  const renderCheckout=()=>{
    setTitle('Checkout — Thriftora','Enter your delivery details and place a Cash on Delivery order.');
    if(!S.getCart().length){location.replace('cart.html');return}
    const form=$('#checkout-form'),summary=$('#checkout-summary');
    const draw=()=>{const rows=cartContents();summary.innerHTML=`<h2 style="font-size:1.7rem">Your order</h2>${rows.map(({item,p})=>`<div class="summary-row"><span>${esc(p.name)} <small>(${esc(item.size)} × ${item.quantity})</small></span><span>${price(p.price*item.quantity)}</span></div>`).join('')}<div class="summary-row"><span>Subtotal</span><span>${price(totals().subtotal)}</span></div><div class="summary-row"><span>Delivery</span><span>${totals().delivery?price(totals().delivery):'Free'}</span></div><div class="summary-row summary-total"><span>Total</span><span>${price(totals().total)}</span></div>`};
    draw();
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form),phone=String(data.get('phone')||'').replace(/[\s()-]/g,'');
      if(!/^(?:\+?92|0)?3\d{9}$/.test(phone)){const field=$('#phone');field.setCustomValidity('Enter a valid Pakistani mobile number, e.g. 03001234567.');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return}
      const rows=cartContents(),t=totals(),orderId=`TH-${Date.now().toString().slice(-8)}`;
      const lines=rows.map(({item,p})=>`• ${p.name} | Size: ${item.size} | Qty: ${item.quantity} | ${price(p.price*item.quantity)}`);
      const message=['*New Thriftora order*',`Order: ${orderId}`,'',...lines,'',`Subtotal: ${price(t.subtotal)}`,`Delivery: ${t.delivery?price(t.delivery):'Free'}`,`Total: ${price(t.total)}`,'',`Name: ${data.get('name')}`,`Phone: ${data.get('phone')}`,`City: ${data.get('city')}`,`Address: ${data.get('address')}`,`Notes: ${data.get('notes')||'None'}`].join('\n');
      const wa=`https://wa.me/${encodeURIComponent(C.whatsapp)}?text=${encodeURIComponent(message)}`;
      const popup=window.open(wa,'_blank');
      if(popup)popup.opener=null;
      if(!popup){toast('Allow pop-ups to send your order on WhatsApp. Your order is ready to send.')}
      S.clear();
      $('#checkout-content').innerHTML=`<section class="success-card"><span class="badge">Order received</span><h1>That’s a wrap.</h1><p class="lead">Your order reference is <strong>${esc(orderId)}</strong>. ${popup?'We’ve opened WhatsApp so you can send your order details.':'Send your order details to us on WhatsApp to confirm.'}</p><p><a class="btn btn-secondary" href="${esc(wa)}" target="_blank" rel="noopener">Send order on WhatsApp</a></p><p><a class="btn btn-primary" href="shop.html">Find another favourite</a> <a class="btn btn-ghost" href="index.html">Back home</a></p></section>`;
    });
  };
  const renderContact=()=>{
    setTitle('Contact Thriftora','Questions about a piece, delivery or your order? We would love to hear from you.');
    const form=$('[data-contact-form]');
    form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const msg=`Hello Thriftora!\\nName: ${data.get('name')}\\nEmail: ${data.get('email')}\\nMessage: ${data.get('message')}`;window.open(`https://wa.me/${encodeURIComponent(C.whatsapp)}?text=${encodeURIComponent(msg)}`,'_blank','noopener');toast('Your message is ready to send on WhatsApp.');form.reset()});
  };
  const page=document.body.dataset.page;
  if(page==='index')renderHome();
  if(page==='shop')renderShop();
  if(page==='product')renderProduct();
  if(page==='cart')renderCart();
  if(page==='checkout')renderCheckout();
  if(page==='contact')renderContact();
  if(window.ScrollTrigger)window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();
