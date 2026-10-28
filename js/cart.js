/* Safe local storage state with same-tab custom events and cross-tab updates. */
(function () {
  const CART_KEY = 'thriftora-cart-v1';
  const WISH_KEY = 'thriftora-wishlist-v1';
  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      console.warn('Thriftora saved data could not be read.', error);
      return fallback;
    }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.error('Thriftora could not save your changes.', error); }
  };
  let cart = read(CART_KEY, []);
  let wishlist = read(WISH_KEY, []);
  const emit = () => window.dispatchEvent(new CustomEvent('thriftora:state', {detail:{cart:getCart(),wishlist:getWishlist()}}));
  const getCart = () => cart.map(item => ({...item}));
  const getWishlist = () => [...wishlist];
  const add = (product, size, quantity) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) { existing.size = size; existing.quantity = Math.min(1, existing.quantity + quantity); }
    else cart.push({id:product.id,size,quantity:1});
    write(CART_KEY,cart); emit();
  };
  const setQuantity = (id,size,quantity) => {
    const item = cart.find(entry => entry.id === id && entry.size === size);
    if (!item) return;
    if (quantity < 1) cart = cart.filter(entry => !(entry.id === id && entry.size === size));
    else item.quantity = Math.min(1,quantity);
    write(CART_KEY,cart); emit();
  };
  const remove = (id,size) => { cart=cart.filter(item=>!(item.id===id&&item.size===size));write(CART_KEY,cart);emit(); };
  const clear = () => { cart=[];write(CART_KEY,cart);emit(); };
  const toggleWish = id => { wishlist=wishlist.includes(id)?wishlist.filter(item=>item!==id):[...wishlist,id];write(WISH_KEY,wishlist);emit();return wishlist.includes(id); };
  const subtotal = () => cart.reduce((total,item) => { const p=window.THRIFTORA_PRODUCTS.find(product=>product.id===item.id);return total+(p?p.price*item.quantity:0); },0);
  const formatPrice = amount => `${window.THRIFTORA_CONFIG.currency} ${Number(amount).toLocaleString('en-PK')}`;
  window.ThriftoraStore = {getCart,getWishlist,add,setQuantity,remove,clear,toggleWish,subtotal,formatPrice};
  window.addEventListener('storage', event => {
    if(event.key===CART_KEY) cart=read(CART_KEY,[]);
    if(event.key===WISH_KEY) wishlist=read(WISH_KEY,[]);
    emit();
  });
})();
