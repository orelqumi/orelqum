// Orelqumi Technologies — static site interactions.
const menu=document.querySelector('.menu-btn'),nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))}
// Static hosting has no server. An email draft is opened instead of claiming a submission was received.
document.querySelectorAll('form[data-enquiry]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form),kind=form.dataset.enquiry,subject='Orelqumi — '+(kind==='enrol'?'Academy enrolment enquiry':kind==='quote'?'Website project enquiry':'General contact enquiry');
 const rows=[...data.entries()].filter(([k])=>k!=='_gotcha').map(([k,v])=>`${k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}: ${v}`);
 const recipient=window.ORELQUMI_CONTACT_EMAIL||'';
 const destination=recipient?recipient:'';
 const body=`Hello Orelqumi Technologies,\n\n${rows.join('\n')}\n\nSent from the Orelqumi website.`;
 const href='mailto:'+destination+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 const msg=form.querySelector('[data-form-status]');if(msg){msg.textContent=recipient?'Your email app should open with the enquiry ready to send. Please press Send in your email app.':'Your email app should open with your enquiry ready. Enter the Orelqumi contact address as recipient, then press Send. The website owner must configure the email destination in assets/config.js.';msg.hidden=false;}
 window.location.href=href;
}));

// Animated navigation state: highlights the current page and closes the menu on escape.
const pageName=window.location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===pageName)a.setAttribute('aria-current','page');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.focus();}});

// Scroll reveals — only enabled with IntersectionObserver, and disabled for reduced motion.
const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion&&'IntersectionObserver' in window){
  const revealTargets=document.querySelectorAll('.section .heading,.section .tile,.section .image-card,.section .split-photo,.section .split>div,.section .video-layout,.section .meeting-card,.section .form-card,.section .callout,.page-hero .wrap');
  if(revealTargets.length){
    const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}})},{threshold:0.07,rootMargin:'0px 0px -25px 0px'});
    revealTargets.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%3)*0.06+'s';io.observe(el)});
    document.documentElement.classList.add('motion-ready');
  }
}

// Interactive media tabs with accessible keyboard navigation.
const mediaTabs=[...document.querySelectorAll('[data-media-tab]')];
function activateMediaTab(tab){
  mediaTabs.forEach(button=>{let active=button===tab;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
  document.querySelectorAll('[data-media-panel]').forEach(panel=>{let active=panel.dataset.mediaPanel===tab.dataset.mediaTab;panel.hidden=!active;panel.classList.toggle('is-active',active);});
}
mediaTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activateMediaTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%mediaTabs.length;else if(e.key==='ArrowLeft')next=(i+mediaTabs.length-1)%mediaTabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=mediaTabs.length-1;else return;e.preventDefault();activateMediaTab(mediaTabs[next]);mediaTabs[next].focus();});});

// Local-only video preview. This does not upload or store files.
const videoInput=document.getElementById('local-video-file'),videoPlayer=document.getElementById('local-video-player');
if(videoInput&&videoPlayer){let previousURL=null;videoInput.addEventListener('change',()=>{const file=videoInput.files?.[0];const status=document.getElementById('local-video-status');const empty=document.getElementById('video-empty-state');if(previousURL){URL.revokeObjectURL(previousURL);previousURL=null;}if(!file){videoPlayer.hidden=true;empty.hidden=false;status.textContent='No video selected.';return;}if(!['video/mp4','video/webm','video/ogg'].includes(file.type)){status.textContent='Choose an MP4, WebM or Ogg video.';videoInput.value='';return;}previousURL=URL.createObjectURL(file);videoPlayer.src=previousURL;videoPlayer.hidden=false;empty.hidden=true;status.textContent=`Previewing ${file.name} locally. Nothing has been uploaded.`;videoPlayer.play().catch(()=>{});});window.addEventListener('pagehide',()=>{if(previousURL)URL.revokeObjectURL(previousURL);});}

// Independent word-by-word hero headline animation. Accessible label retains complete text.
if (!reduceMotion) {
  document.querySelectorAll('.hero h1').forEach(heading => {
    // Only wrap plain-text headings, so authored nested markup remains untouched.
    if (heading.children.length) return;
    const source = heading.textContent.trim();
    if (!source) return;
    heading.setAttribute('aria-label', source);
    heading.classList.add('word-motion');
    heading.textContent = '';
    const words = source.split(/\s+/);
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'anim-word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--word-index', i);
      span.textContent = word + (i < words.length - 1 ? '\u00a0' : '');
      heading.append(span);
    });
  });
}
