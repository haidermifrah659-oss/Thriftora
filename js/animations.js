/* Enhancements are progressive: the full page stays visible without GSAP. */
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader=document.querySelector('.preloader');
  if(preloader){
    let seen=false;
    try { seen=sessionStorage.getItem('thriftora-preloaded')==='1'; }
    catch(error) { console.warn('Thriftora could not read preloader session state.',error); }
    if(seen||reduced)preloader.remove();
    else window.addEventListener('load',()=>{window.setTimeout(()=>{preloader.classList.add('done');try{sessionStorage.setItem('thriftora-preloaded','1')}catch(error){console.warn('Thriftora could not save preloader session state.',error)}},450)},{once:true});
  }
  if(!reduced&&window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 701px)',()=>{
      if(document.querySelector('.hero-copy')){
        gsap.from('.hero-copy > :not(h1)',{y:28,opacity:0,duration:.8,stagger:.13,ease:'power3.out',delay:.15});
        gsap.from('.hero h1 span',{y:48,opacity:0,duration:.8,stagger:.16,ease:'power3.out',delay:.12});
      }
      gsap.utils.toArray('.hero-photo').forEach((el,i)=>gsap.to(el,{y:i?'-5%':'5%',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}}));
      gsap.utils.toArray('.section-head,.category-card,.product-card,.step-card,.value-card,.review-card').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
      gsap.utils.toArray('[data-counter]').forEach(el=>gsap.from(el,{scale:.75,opacity:0,duration:.8,ease:'back.out(1.5)',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
      document.querySelectorAll('.btn').forEach(button=>button.addEventListener('mousemove',event=>{const r=button.getBoundingClientRect();gsap.to(button,{x:(event.clientX-r.left-r.width/2)*.08,y:(event.clientY-r.top-r.height/2)*.08,duration:.2})}));
      document.querySelectorAll('.btn').forEach(button=>button.addEventListener('mouseleave',()=>gsap.to(button,{x:0,y:0,duration:.35})));
    });
    document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true}));
  }
  const cursor=document.querySelector('.cursor-follower');
  if(!reduced&&cursor&&matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`},{passive:true})}
})();
