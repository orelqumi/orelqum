/* Orelqumi visible site-wide motion — public pages only, version 20261113-visible */
(function(){
 'use strict';
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 var cardSelectors=[
 '.e-service-card','.e-showcase','.e-price-card','.e-process-grid > *',
 '.service-spotlight-card','.service-chip','.category-price-card','.school-price-card',
 '.counter-card','.path-card','.image-card','.cards > *','.tile',
 '.price-catalog-grid > *','.service-showcase-grid > *','.school-price-grid > *',
 '.maintenance-grid > *','.counter-grid > *','.path-grid > *',
 '.e-footer-top > *','.footer-grid > *','.course-card','.package-card',
 '.portfolio-card','.pricing-card','.feature-card','.step-card',
 '.split-photo','.about-photo','.photo-card'
 ];
 var cards=Array.from(new Set(document.querySelectorAll(cardSelectors.join(',')))).filter(function(el){
  return !el.closest('header,nav,form,[aria-hidden="true"],.portal,.dashboard,.e-faq-list')&&el.getBoundingClientRect().width>0;
 });
 cards.forEach(function(el,i){
  el.classList.add('orelq-motion-item','orelq-motion-card');
  var idx=el.parentElement?Array.prototype.indexOf.call(el.parentElement.children,el):i;
  el.style.setProperty('--orelq-stagger',Math.min(idx%4,3)*45+'ms');
  el.style.setProperty('--orelq-phase',-(idx%4)*270+'ms');
 });
 Array.from(document.querySelectorAll('main h2,main .section-heading h2,main .e-section-heading h2')).forEach(function(el){
  if(!el.closest('form,[aria-hidden="true"],.portal,.dashboard'))el.classList.add('orelq-motion-title');
 });
 if(!('IntersectionObserver' in window)){
  cards.forEach(function(el){el.classList.add('orelq-in-view')});
  document.documentElement.classList.add('orelq-motion-ready');return;
 }
 var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('orelq-in-view');observer.unobserve(entry.target)}});
 },{rootMargin:'0px 0px 90px 0px',threshold:0.01});
 cards.forEach(function(el){observer.observe(el)});
 document.documentElement.classList.add('orelq-motion-ready');
})();
