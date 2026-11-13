/* Progressive enhancement: animate repeated content and cards as they enter view.
   Do not affect forms, navigation, customer portals or calls to action. */
(function(){
 'use strict';
 if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 var selectors=[
  '.e-service-card','.e-showcase','.e-price-card','.e-process-grid > *',
  '.service-spotlight-card','.service-chip','.category-price-card',
  '.school-price-card','.counter-card','.path-card','.image-card',
  '.cards > .tile','.cards > .image-card','.cards > *',
  '.price-catalog-grid > *','.service-showcase-grid > *',
  '.school-price-grid > *','.maintenance-grid > *',
  '.counter-grid > *','.path-grid > *','.footer-grid > *',
  '.e-footer-top > *'
 ];
 var nodes=Array.prototype.slice.call(document.querySelectorAll(selectors.join(','))).filter(function(el){
   return !el.closest('header,nav,form,[aria-hidden="true"],.portal,.dashboard') &&
     el.offsetWidth>0 && el.offsetHeight>0;
 });
 if(!nodes.length)return;
 // Keep existing hover functionality, hrefs, and click targets unchanged.
 nodes.forEach(function(el,idx){
   el.classList.add('orelq-motion-item','orelq-motion-card');
   var siblings=el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children,el):idx;
   el.style.setProperty('--orelq-stagger',Math.min(siblings%4,3)*65+'ms');
   el.style.setProperty('--orelq-phase',-(siblings%4)*410+'ms');
 });
 if(!('IntersectionObserver' in window))return;
 var observer=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('orelq-in-view');observer.unobserve(entry.target);}})
 },{rootMargin:'0px 0px 28px 0px',threshold:.06});
 nodes.forEach(function(el){observer.observe(el)});
 document.documentElement.classList.add('orelq-motion-ready');
})();
