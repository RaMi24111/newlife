'use client';
import React, { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════
   DESIGN LANGUAGE:
   • Warm parchment cream base — ink on paper feel
   • Deep wine/burgundy as primary accent (darker than maroon)
   • Gold as highlight — sparingly, maximum impact
   • Unexpected: giant rotated type, diagonal cuts, overlapping
     image frames, editorial column layouts, ruled lines as decor
   • Fonts: Playfair Display SC (editorial caps) + DM Serif (body
     headlines) + Jost (clean UI text)
   • NO generic rounded cards. Sharp-edge brutalist precision.
═══════════════════════════════════════════════════════════════ */
const SPLASH_CSS = `
@keyframes nameReveal {
  0%   { opacity:0; transform:perspective(600px) translateY(-80px) rotateX(90deg) scale(.75); }
  55%  { opacity:1; transform:perspective(600px) translateY(8px) rotateX(-8deg) scale(1.03); }
  100% { opacity:1; transform:perspective(600px) translateY(0) rotateX(0deg) scale(1); }
}
@keyframes ringExpand { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes spinRing   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes fadeCorner { to{opacity:1} }
@keyframes splashFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes barFill    { to{width:100%} }
@keyframes curtainUp  { to{transform:translateY(-100%)} }
@keyframes curtainDn  { to{transform:translateY(100%)} }

.splash{
  position:fixed;inset:0;z-index:99999;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  overflow:hidden;background:#5C1020;
}
.splash::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(45deg,transparent,transparent 44px,rgba(255,255,255,.014) 44px,rgba(255,255,255,.014) 45px);
}
/* curtain panels */
.splash-t{position:fixed;inset:0 0 50% 0;z-index:99999;background:#5C1020;transform:translateY(0);pointer-events:none;}
.splash-b{position:fixed;inset:50% 0 0 0;z-index:99999;background:#5C1020;transform:translateY(0);pointer-events:none;}
.splash-t.go{animation:curtainUp .72s cubic-bezier(.76,0,.24,1) forwards;}
.splash-b.go{animation:curtainDn .72s cubic-bezier(.76,0,.24,1) forwards;}

.splash-ring{position:absolute;border-radius:50%;border:1px solid rgba(192,144,32,.22);
  animation:ringExpand .55s ease-out both;}
.splash-spin{position:absolute;border-radius:50%;
  border:1.5px solid transparent;border-top-color:#C09020;border-right-color:rgba(192,144,32,.28);
  animation:ringExpand .5s ease-out .15s both, spinRing 3s linear .65s infinite;}

.splash-corner{position:absolute;width:18px;height:18px;border-color:rgba(192,144,32,.5);border-style:solid;
  opacity:0;animation:fadeCorner .4s ease .5s forwards;}
.sp-tl{top:clamp(20px,5vw,60px);left:clamp(20px,5vw,60px);border-width:1.5px 0 0 1.5px;}
.sp-tr{top:clamp(20px,5vw,60px);right:clamp(20px,5vw,60px);border-width:1.5px 1.5px 0 0;}
.sp-bl{bottom:clamp(20px,5vw,60px);left:clamp(20px,5vw,60px);border-width:0 0 1.5px 1.5px;}
.sp-br{bottom:clamp(20px,5vw,60px);right:clamp(20px,5vw,60px);border-width:0 1.5px 1.5px 0;}

.splash-name{
  font-family:'Playfair Display SC',serif;
  font-size:clamp(54px,15vw,160px);
  font-weight:900;color:#FFFFFF;
  letter-spacing:.14em;line-height:.88;text-transform:uppercase;
  opacity:0;animation:nameReveal .95s cubic-bezier(.22,1,.36,1) .3s forwards;
  text-align:center;
}
.splash-rule{
  display:flex;align-items:center;gap:12px;margin:12px 0;
  opacity:0;animation:splashFadeUp .6s ease .95s forwards;
}
.sr-l{width:clamp(28px,5vw,64px);height:1px;background:#C09020;opacity:.6;}
.sr-d{width:6px;height:6px;background:#C09020;transform:rotate(45deg);}
.sr-dot{width:3px;height:3px;background:#C09020;border-radius:50%;opacity:.5;}
.splash-sub{
  font-family:'DM Serif Display',serif;
  font-size:clamp(22px,5.5vw,66px);
  font-style:italic;color:#E0B840;
  letter-spacing:.22em;line-height:1;
  opacity:0;animation:splashFadeUp .7s ease 1.05s forwards;
  text-align:center;
}
.splash-tag{
  font-family:'Jost',sans-serif;font-size:clamp(8px,1.1vw,10px);
  font-weight:300;letter-spacing:.55em;text-transform:uppercase;
  color:rgba(245,216,122,.55);margin-top:18px;
  opacity:0;animation:splashFadeUp .6s ease 1.25s forwards;
  text-align:center;
}
.splash-loader{
  position:absolute;bottom:clamp(28px,5vh,56px);
  left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:10px;
  opacity:0;animation:splashFadeUp .5s ease 1.15s forwards;
}
.splash-bar-track{width:clamp(80px,14vw,130px);height:1px;background:rgba(192,144,32,.18);position:relative;overflow:hidden;}
.splash-bar-fill{position:absolute;top:0;left:0;height:100%;width:0%;
  background:linear-gradient(90deg,#C09020,#E0B840);
  animation:barFill 2.1s ease 1.3s forwards;}
.splash-loader-txt{font-size:8px;letter-spacing:.48em;color:rgba(245,216,122,.3);text-transform:uppercase;font-family:'Jost';}
`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400&family=DM+Serif+Display:ital@0;1&family=Jost:wght@200;300;400;500;600&family=IM+Fell+English:ital@0;1&display=swap');

:root {
  --ink:    #1A0A06;       /* near-black warm ink */
  --wine:   #5C1020;       /* deep wine / burgundy */
  --wine2:  #7B1D2A;       /* maroon mid */
  --wine3:  #9B3040;       /* maroon light */
  --wine-f: rgba(92,16,32,.06);
  --gold:   #C09020;       /* muted antique gold */
  --gold2:  #E0B840;       /* bright gold */
  --gold3:  #F5D87A;       /* pale gold */
  --parch:  #FAF4E8;       /* parchment — main bg */
  --parch2: #F3EAD6;       /* warm cream */
  --parch3: #E8DCC4;       /* deeper cream */
  --parch4: #DDD0B4;       /* tan */
  --linen:  #F8F1E4;       /* linen white */
  --rule:   rgba(92,16,32,.18);  /* ruled line color */
}

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{overflow-x:hidden;scroll-behavior:smooth;}
body{
  background:var(--parch);
  color:var(--ink);
  font-family:'Jost',sans-serif;
  overflow-x:hidden;
}
img{display:block;max-width:100%;object-fit:cover;}
a{text-decoration:none;color:inherit;}

/* Grain overlay on body */
body::before{
  content:'';
  position:fixed;inset:0;z-index:9998;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E");
  opacity:1;mix-blend-mode:multiply;
}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--parch2);}
::-webkit-scrollbar-thumb{background:var(--wine);}

/* ─── Cursor ─── */
@media(hover:hover)and(pointer:fine){
  body{cursor:none;}
  #co{
    position:fixed;top:0;left:0;z-index:99999;pointer-events:none;
    width:28px;height:28px;
    border:1px solid var(--wine2);border-radius:50%;
    transform:translate(-50%,-50%);
    transition:width .22s,height .22s,border-color .22s,border-radius .22s;
  }
  #ci{
    position:fixed;top:0;left:0;z-index:99999;pointer-events:none;
    width:4px;height:4px;
    background:var(--gold);border-radius:50%;
    transform:translate(-50%,-50%);
  }
  #co.hov{width:44px;height:44px;border-color:var(--gold);border-radius:0;transform:translate(-50%,-50%) rotate(45deg);}
  #co.clk{width:16px;height:16px;}
}

/* ════════════════════════════════════════
   NAV — editorial top bar with ruled line
════════════════════════════════════════ */
nav{
  position:fixed;top:0;left:0;right:0;z-index:9000;
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 48px;
  border-bottom:1px solid transparent;
  transition:all .4s ease;
}
nav.sc{
  background:rgba(250,244,232,.95);
  backdrop-filter:blur(16px);
  border-bottom:1px solid var(--rule);
}
.nav-wordmark{
  display:flex;flex-direction:column;line-height:1;
}
.nav-w1{
  font-family:'Playfair Display SC',serif;
  font-size:clamp(13px,1.6vw,18px);
  font-weight:900;letter-spacing:.22em;
  color:var(--wine);text-transform:uppercase;
}
.nav-w2{
  font-family:'Jost',sans-serif;
  font-size:9px;font-weight:300;letter-spacing:.5em;
  color:var(--gold);text-transform:uppercase;margin-top:1px;
}
.nav-cta{
  font-family:'Jost',sans-serif;font-size:10px;font-weight:600;
  letter-spacing:.3em;text-transform:uppercase;
  color:var(--parch);background:var(--wine);
  padding:11px 26px;border:none;display:inline-block;
  transition:all .28s ease;-webkit-tap-highlight-color:transparent;
  position:relative;overflow:hidden;
}
.nav-cta::after{
  content:'';position:absolute;inset:0;
  background:var(--gold);transform:translateX(-101%);
  transition:transform .35s ease;
}
.nav-cta:hover::after{transform:translateX(0);}
.nav-cta:hover{color:var(--wine);}
.nav-cta span{position:relative;z-index:1;}
.ham{
  display:none;flex-direction:column;gap:4px;
  background:none;border:none;cursor:pointer;padding:4px;
}
.ham b{display:block;width:22px;height:1px;background:var(--wine);transition:.3s;}

/* mobile drawer */
.mob{
  position:fixed;inset:0;background:var(--wine);z-index:8900;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;
  opacity:0;pointer-events:none;transition:opacity .35s ease;
}
.mob.open{opacity:1;pointer-events:all;}
.mob-x{position:absolute;top:24px;right:28px;background:none;border:none;font-size:24px;color:var(--gold);cursor:pointer;}
.mob a{
  font-family:'DM Serif Display',serif;font-size:34px;
  color:var(--parch);transition:color .25s;
}
.mob a:hover{color:var(--gold);}
.mob .mob-cta{
  font-family:'Jost',sans-serif;font-size:11px;font-weight:600;
  letter-spacing:.3em;text-transform:uppercase;
  color:var(--wine);background:var(--gold2);
  padding:14px 36px;margin-top:12px;display:inline-block;
}

/* ════════════════════════════════════════
   HERO — editorial split with giant type
════════════════════════════════════════ */
.hero{
  min-height:100svh;
  display:grid;
  grid-template-rows:1fr auto;
  padding-top:0;
  position:relative;
  overflow:hidden;
  background:var(--parch);
}

/* Giant background letter watermark */
.hero-wm{
  position:absolute;
  right:-5vw;top:-10vh;
  font-family:'Playfair Display SC',serif;
  font-size:clamp(280px,45vw,600px);
  font-weight:900;
  color:transparent;
  -webkit-text-stroke:1px rgba(92,16,32,.06);
  line-height:1;
  pointer-events:none;
  user-select:none;
  z-index:0;
}

/* Ruled lines decoration */
.hero-rules{
  position:absolute;inset:0;pointer-events:none;z-index:0;
}
.hero-rules span{
  position:absolute;left:0;right:0;height:1px;
  background:var(--rule);opacity:.5;
}

.hero-body{
  position:relative;z-index:2;
  display:grid;
  grid-template-columns:1fr 1fr;
  min-height:100svh;
}

/* Left column */
.hero-l{
  display:flex;flex-direction:column;justify-content:flex-end;
  padding:clamp(100px,14vh,160px) clamp(32px,5vw,72px) clamp(48px,8vh,80px);
  border-right:1px solid var(--rule);
  position:relative;
}

/* Top-left small label */
.h-badge{
  position:absolute;top:clamp(80px,11vh,120px);left:clamp(32px,5vw,72px);
  display:flex;align-items:center;gap:10px;
  opacity:0;animation:fadeUp .8s .15s ease forwards;
}
.h-badge-line{width:32px;height:1px;background:var(--wine2);}
.h-badge-txt{font-size:9px;letter-spacing:.55em;color:var(--wine2);text-transform:uppercase;font-weight:500;}

/* Big name */
.h-name{
  font-family:'Playfair Display SC',serif;
  font-size:clamp(58px,10vw,140px);
  font-weight:900;line-height:.88;
  color:var(--wine);letter-spacing:.04em;
  text-transform:uppercase;
  opacity:0;animation:fadeUp 1.1s .3s ease forwards;
}
.h-name-sub{
  font-family:'DM Serif Display',serif;
  font-size:clamp(22px,4vw,54px);
  font-style:italic;color:var(--gold);
  letter-spacing:.06em;line-height:1;
  margin-top:4px;
  opacity:0;animation:fadeUp 1s .46s ease forwards;
}

/* Ornament rule */
.h-rule{
  display:flex;align-items:center;gap:14px;
  margin:clamp(18px,3vh,30px) 0;
  opacity:0;animation:fadeIn 1s .64s ease forwards;
}
.h-rule-l{height:1px;width:clamp(32px,5vw,60px);background:var(--gold);}
.h-rule-d{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);}
.h-rule-dot{width:3px;height:3px;background:var(--gold);border-radius:50%;opacity:.6;}

.h-desc{
  font-size:clamp(11px,1.3vw,13px);font-weight:300;
  letter-spacing:.18em;text-transform:uppercase;
  color:rgba(26,10,6,.45);line-height:1.6;
  margin-bottom:clamp(28px,5vh,48px);
  max-width:360px;
  opacity:0;animation:fadeUp .9s .8s ease forwards;
}

/* Login / Dashboard button */
.h-btn{
  display:inline-flex;align-items:center;gap:14px;
  font-family:'Jost',sans-serif;font-size:11px;font-weight:600;
  letter-spacing:.32em;text-transform:uppercase;
  color:var(--parch);background:var(--wine);
  padding:clamp(14px,2vh,18px) clamp(32px,4vw,52px);
  border:none;position:relative;overflow:hidden;
  transition:transform .28s ease;
  -webkit-tap-highlight-color:transparent;
  opacity:0;animation:fadeUp .9s 1s ease forwards,btnGlow 3s ease-in-out 2.5s infinite;
  width:fit-content;
}
.h-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,var(--wine2),var(--wine));
  transform:translateX(-100%);transition:transform .4s ease;
}
.h-btn:hover::before{transform:translateX(0);}
.h-btn:hover{transform:translateY(-2px);}
.h-btn:active{transform:scale(.98);}
.h-btn span{position:relative;z-index:1;}
.h-btn-arrow{
  position:relative;z-index:1;
  width:18px;height:1px;background:var(--gold);
  transition:width .28s ease;flex-shrink:0;
}
.h-btn-arrow::after{
  content:'';position:absolute;right:0;top:-3px;
  width:7px;height:7px;border-top:1px solid var(--gold);border-right:1px solid var(--gold);
  transform:rotate(45deg);
}
.h-btn:hover .h-btn-arrow{width:28px;}

@keyframes btnGlow{
  0%,100%{box-shadow:0 4px 20px rgba(92,16,32,.2);}
  50%{box-shadow:0 8px 36px rgba(92,16,32,.45);}
}

.h-note{
  margin-top:14px;font-size:9px;letter-spacing:.4em;
  color:rgba(26,10,6,.3);text-transform:uppercase;
  opacity:0;animation:fadeIn .9s 1.4s ease forwards;
}

/* Right column — stacked images */
.hero-r{
  position:relative;overflow:hidden;
}

/* Top image */
.hero-img-top{
  position:absolute;
  top:0;left:0;right:0;height:60%;
  overflow:hidden;
}
.hero-img-top img{
  width:100%;height:100%;
  /* no zoom on mobile */
}
@media(hover:hover)and(pointer:fine){
  .hero-img-top img{animation:subtleZoom 18s ease-in-out infinite alternate;}
}
@keyframes subtleZoom{from{transform:scale(1)}to{transform:scale(1.06)}}

/* Bottom image */
.hero-img-bot{
  position:absolute;
  bottom:0;left:15%;right:0;height:44%;
  overflow:hidden;
  border-top:4px solid var(--parch);
  border-left:4px solid var(--parch);
}
.hero-img-bot img{width:100%;height:100%;}

/* Year badge over images */
.hero-yr{
  position:absolute;top:58%;left:4%;
  z-index:3;
  background:var(--gold);
  padding:18px 16px;text-align:center;
  border:3px solid var(--parch);
  opacity:0;animation:fadeIn 1s .8s ease forwards;
}
.hero-yr-n{font-family:'DM Serif Display',serif;font-size:38px;color:var(--wine);line-height:1;}
.hero-yr-t{font-size:8px;letter-spacing:.3em;color:var(--wine2);text-transform:uppercase;margin-top:2px;}

/* Overlay tint on images */
.hero-img-top::after,.hero-img-bot::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(92,16,32,.15),transparent);
}

/* Scroll indicator */
.h-scroll{
  position:absolute;bottom:32px;left:clamp(32px,5vw,72px);
  display:flex;align-items:center;gap:10px;z-index:3;
  opacity:0;animation:fadeIn 1s 2.2s ease forwards;
}
.hs-line{width:40px;height:1px;background:var(--wine2);opacity:.4;animation:linePulse 2.5s ease-in-out infinite;}
.hs-txt{font-size:8px;letter-spacing:.5em;color:rgba(26,10,6,.35);text-transform:uppercase;}
@keyframes linePulse{0%,100%{width:40px;opacity:.4}50%{width:60px;opacity:.8}}

/* ════════════════════════════════════════
   GOLD MARQUEE
════════════════════════════════════════ */
.mq{background:var(--wine);padding:12px 0;overflow:hidden;}
.mq-track{display:flex;width:max-content;animation:mqs 34s linear infinite;}
.mq-item{
  font-family:'Jost',sans-serif;font-size:9px;font-weight:600;
  letter-spacing:.4em;text-transform:uppercase;
  color:var(--gold3);padding:0 28px;white-space:nowrap;
  display:flex;align-items:center;gap:28px;
}
.mq-sep{color:var(--gold);font-size:11px;}
@keyframes mqs{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ════════════════════════════════════════
   SECTION HELPERS
════════════════════════════════════════ */
.sec-pre{
  display:flex;align-items:center;gap:10px;
  font-size:9px;letter-spacing:.5em;font-weight:600;
  color:var(--wine);text-transform:uppercase;
  margin-bottom:14px;
}
.sec-pre::before{content:'';width:22px;height:1.5px;background:var(--wine);}
.sec-h{
  font-family:'DM Serif Display',serif;
  font-size:clamp(30px,5vw,58px);
  font-weight:400;line-height:1.08;color:var(--ink);
}
.sec-h em{font-style:italic;color:var(--wine);}
.sec-p{
  font-size:14px;line-height:1.9;color:rgba(26,10,6,.58);
  font-weight:300;margin-top:18px;max-width:520px;
}
.gold-rule{
  display:flex;align-items:center;gap:12px;margin:16px 0;
}
.gr-l{width:40px;height:1px;background:var(--gold);opacity:.5;}
.gr-d{width:5px;height:5px;background:var(--gold);transform:rotate(45deg);opacity:.7;}

/* ════════════════════════════════════════
   ABOUT  — editorial 2 col with overlap
════════════════════════════════════════ */
.about{
  padding:clamp(80px,11vw,140px) clamp(24px,6vw,80px);
  display:grid;grid-template-columns:5fr 7fr;
  gap:clamp(40px,5vw,80px);align-items:center;
  background:var(--parch);
  border-top:1px solid var(--rule);
}
.about-txt{}
.about-imgs{position:relative;}

/* Main image */
.ab-img1{
  width:100%;height:clamp(340px,42vw,520px);
  border:1px solid var(--parch3);
  position:relative;z-index:1;
}
/* Accent image — overlaps bottom-left */
.ab-img2{
  position:absolute;
  bottom:-clamp(24px,4vw,44px);
  left:-clamp(20px,3vw,36px);
  width:46%;height:clamp(160px,20vw,240px);
  border:3px solid var(--parch);
  z-index:2;outline:1px solid var(--parch3);
}
/* wine accent block behind */
.ab-accent{
  position:absolute;
  top:clamp(16px,2vw,28px);
  right:-clamp(12px,2vw,20px);
  width:48%;height:50%;
  background:var(--wine-f);
  border:1px solid rgba(92,16,32,.12);
  z-index:0;
}
/* est badge */
.ab-badge{
  position:absolute;top:-clamp(14px,2vw,22px);right:-clamp(10px,1.5vw,18px);
  background:var(--wine);padding:18px 16px;text-align:center;z-index:3;
  border:2px solid var(--gold);
}
.ab-num{font-family:'DM Serif Display',serif;font-size:40px;color:var(--gold);line-height:1;}
.ab-lbl{font-size:8px;letter-spacing:.3em;color:rgba(250,244,232,.6);text-transform:uppercase;}

/* stat grid */
.ab-stats{
  display:grid;grid-template-columns:1fr 1fr;
  gap:12px;margin-top:clamp(28px,4vh,44px);
}
.ab-stat{
  padding:18px 16px;
  background:var(--parch2);
  border-left:2px solid var(--wine);
  border-bottom:1px solid var(--parch3);
}
.ab-stat-n{
  font-family:'DM Serif Display',serif;font-size:clamp(28px,3.5vw,40px);
  color:var(--wine);line-height:1;
}
.ab-stat-l{font-size:9px;letter-spacing:.22em;color:rgba(26,10,6,.45);text-transform:uppercase;margin-top:3px;}

/* ════════════════════════════════════════
   IMAGE SCROLL CAROUSEL — two rows
════════════════════════════════════════ */
.imgscroll{
  padding:clamp(60px,8vw,110px) 0;
  background:var(--parch2);
  border-top:1px solid var(--rule);
  border-bottom:1px solid var(--rule);
  overflow:hidden;
}
.imgscroll-hdr{
  padding:0 clamp(24px,6vw,80px);
  margin-bottom:clamp(32px,5vw,52px);
  display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;
}

.scroll-row{overflow:hidden;margin-bottom:12px;}
.scroll-row:last-child{margin-bottom:0;}
.scroll-inner{display:flex;width:max-content;gap:12px;}
.scroll-inner.L{animation:sL 44s linear infinite;}
.scroll-inner.R{animation:sR 44s linear infinite;}
@media(hover:hover)and(pointer:fine){.scroll-inner:hover{animation-play-state:paused;}}
@keyframes sL{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes sR{from{transform:translateX(-50%)}to{transform:translateX(0)}}

.ic{
  position:relative;flex-shrink:0;
  width:clamp(210px,23vw,300px);
  height:clamp(180px,19vw,255px);
  overflow:hidden;
  border:1px solid var(--parch3);
}
.ic img{width:100%;height:100%;transition:transform .6s ease;}
@media(hover:hover)and(pointer:fine){.ic:hover img{transform:scale(1.07);}}
.ic-ov{
  position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 40%,rgba(92,16,32,.88) 100%);
}
.ic-txt{position:absolute;bottom:0;left:0;right:0;padding:14px 16px;}
.ic-tag{font-size:8px;letter-spacing:.3em;color:var(--gold3);text-transform:uppercase;font-family:'Jost';margin-bottom:2px;}
.ic-name{font-family:'DM Serif Display',serif;font-size:16px;color:#fff;}

/* ════════════════════════════════════════
   FEATURES  — numbered editorial grid
════════════════════════════════════════ */
.feat{
  padding:clamp(80px,11vw,140px) clamp(24px,6vw,80px);
  background:var(--parch);
}
.feat-intro{
  display:grid;grid-template-columns:1fr 1fr;
  gap:clamp(32px,5vw,80px);
  margin-bottom:clamp(48px,7vw,88px);
  align-items:end;
}
/* big rotated number watermark */
.feat-wm{
  font-family:'Playfair Display SC',serif;
  font-size:clamp(100px,15vw,200px);
  font-weight:900;color:transparent;
  -webkit-text-stroke:1px rgba(92,16,32,.08);
  line-height:1;pointer-events:none;user-select:none;
  text-align:right;
}

.feat-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:0;
  border:1px solid var(--rule);
}
.fc{
  padding:clamp(28px,4vw,44px) clamp(22px,3vw,36px);
  border-right:1px solid var(--rule);
  border-bottom:1px solid var(--rule);
  position:relative;overflow:hidden;
  background:var(--parch);
  transition:background .3s ease;
}
.fc:hover{background:var(--parch2);}
/* nth-child to remove right borders on last col */
.fc:nth-child(3n){border-right:none;}
/* remove last row bottom borders */
.fc:nth-last-child(-n+3){border-bottom:none;}

.fc-num{
  font-family:'Playfair Display SC',serif;font-size:42px;
  color:rgba(92,16,32,.08);line-height:1;
  position:absolute;top:18px;right:20px;
  transition:color .3s;
}
.fc:hover .fc-num{color:rgba(92,16,32,.14);}
.fc-ico{font-size:24px;margin-bottom:14px;display:block;}
.fc-title{
  font-family:'DM Serif Display',serif;font-size:20px;
  color:var(--ink);margin-bottom:8px;
}
.fc-body{font-size:12px;line-height:1.8;color:rgba(26,10,6,.55);font-weight:300;}
.fc::after{
  content:'';position:absolute;bottom:0;left:0;width:0;height:2px;
  background:linear-gradient(90deg,var(--wine),var(--gold));
  transition:width .38s ease;
}
.fc:hover::after{width:100%;}

/* ════════════════════════════════════════
   GALLERY  — unique asymmetric collage
════════════════════════════════════════ */
.gallery{
  padding:clamp(80px,11vw,140px) clamp(24px,6vw,80px);
  background:var(--parch2);
  border-top:1px solid var(--rule);
}
.gl-grid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  grid-template-rows:260px 200px;
  gap:10px;
  margin-top:clamp(36px,5vw,56px);
}
.gi { overflow:hidden;position:relative; border:1px solid rgba(184,136,42,.12); }
.gi-A{grid-column:1/5;grid-row:1/3;}
.gi-B{grid-column:5/8;grid-row:1;}
.gi-C{grid-column:8/10;grid-row:1;}
.gi-D{grid-column:10/13;grid-row:1;}
.gi-E{grid-column:5/9;grid-row:2;}
.gi-F{grid-column:9/13;grid-row:2;}

.gi img{width:100%;height:100%;transition:transform .65s ease;}
@media(hover:hover)and(pointer:fine){.gi:hover img{transform:scale(1.07);}}
.gi-ov{
  position:absolute;inset:0;
  background:rgba(92,16,32,.48);
  opacity:0;transition:opacity .35s;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
}
@media(hover:hover)and(pointer:fine){.gi:hover .gi-ov{opacity:1;}}
.gi-ovname{font-family:'DM Serif Display',serif;font-size:18px;color:#fff;text-align:center;}
.gi-ovtag{font-size:8px;letter-spacing:.3em;color:var(--gold3);text-transform:uppercase;}

/* ════════════════════════════════════════
   QUOTE — full bleed diagonal
════════════════════════════════════════ */
.quote-sec{
  position:relative;height:52vh;min-height:340px;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.q-bg{
  position:absolute;inset:-20%;
  background:url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80')center/cover;
  filter:brightness(.22)saturate(.6);
}
.q-ov{position:absolute;inset:0;background:rgba(92,16,32,.45);}
/* diagonal slice top */
.q-slice{
  position:absolute;top:0;left:0;right:0;height:80px;
  background:var(--parch2);
  clip-path:polygon(0 0,100% 0,100% 0%,0 100%);
  z-index:2;
}
.q-slice-b{
  position:absolute;bottom:0;left:0;right:0;height:80px;
  background:var(--parch);
  clip-path:polygon(0 100%,100% 0,100% 100%);
  z-index:2;
}
.q-content{position:relative;z-index:3;text-align:center;padding:0 clamp(24px,9vw,160px);}
.q-mark{
  font-family:'IM Fell English',serif;font-size:90px;
  color:var(--gold);line-height:.5;margin-bottom:12px;opacity:.7;display:block;
}
.q-text{
  font-family:'DM Serif Display',serif;font-style:italic;
  font-size:clamp(20px,3.2vw,44px);
  color:#fff;line-height:1.35;letter-spacing:.01em;
}
.q-attr{margin-top:22px;font-size:9px;letter-spacing:.45em;color:var(--gold3);text-transform:uppercase;}

/* ════════════════════════════════════════
   STATS — wine bg with gold numbers
════════════════════════════════════════ */
.stats{
  background:var(--wine);
  padding:clamp(48px,7vw,90px) clamp(24px,7vw,100px);
  display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
  gap:0;position:relative;overflow:hidden;
}
/* subtle pattern */
.stats::before{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(45deg,transparent,transparent 44px,rgba(255,255,255,.012) 44px,rgba(255,255,255,.012) 45px);
}
.sc-card{
  display:flex;flex-direction:column;align-items:center;
  text-align:center;padding:32px 16px;
  border-right:1px solid rgba(250,244,232,.07);
  position:relative;z-index:1;
  transition:background .3s;
}
.sc-card:last-child{border-right:none;}
@media(hover:hover)and(pointer:fine){.sc-card:hover{background:rgba(250,244,232,.04);}}
.sc-ico{font-size:22px;margin-bottom:10px;}
.sc-n{
  font-family:'DM Serif Display',serif;
  font-size:clamp(38px,5vw,58px);color:var(--gold2);line-height:1;
}
.sc-l{font-size:9px;letter-spacing:.28em;color:rgba(250,244,232,.38);text-transform:uppercase;margin-top:5px;}

/* ════════════════════════════════════════
   FOOTER — dark wine
════════════════════════════════════════ */
footer{
  background:var(--ink);
  padding:clamp(52px,7vw,88px) clamp(24px,7vw,100px) clamp(28px,4vw,44px);
}
.ft-top{
  display:grid;grid-template-columns:2fr 1fr 1fr;
  gap:clamp(32px,5vw,64px);
  padding-bottom:clamp(36px,5vw,56px);
  border-bottom:1px solid rgba(250,244,232,.07);
  margin-bottom:clamp(24px,3vw,36px);
}
.ft-brand{
  font-family:'Playfair Display SC',serif;
  font-size:clamp(18px,3vw,26px);
  font-weight:700;letter-spacing:.25em;
  color:var(--gold);display:block;margin-bottom:10px;
}
.ft-desc{font-size:12px;color:rgba(250,244,232,.32);font-weight:300;line-height:1.8;max-width:260px;}
.ft-col-h{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.4em;color:var(--gold);text-transform:uppercase;margin-bottom:18px;font-weight:600;}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:10px;}
.ft-links a{font-size:12px;color:rgba(250,244,232,.38);transition:color .25s;font-weight:300;letter-spacing:.04em;}
.ft-links a:hover{color:var(--gold);}
.ft-contact{font-size:12px;color:rgba(192,144,32,.6);font-family:'Jost';letter-spacing:.08em;line-height:2.2;font-weight:300;}
.ft-bottom{
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;
}
.ft-copy{font-size:10px;color:rgba(250,244,232,.18);letter-spacing:.12em;}
.ft-ver{font-size:9px;color:rgba(192,144,32,.25);letter-spacing:.25em;font-family:'Playfair Display SC';}

/* ════════════════════════════════════════
   REVEAL
════════════════════════════════════════ */
.rv{opacity:0;transform:translateY(36px);transition:opacity .75s ease,transform .75s ease;}
.rv.v{opacity:1;transform:translateY(0);}
.rv-l{opacity:0;transform:translateX(-48px);transition:opacity .8s ease,transform .8s ease;}
.rv-l.v{opacity:1;transform:translateX(0);}
.rv-r{opacity:0;transform:translateX(48px);transition:opacity .8s ease,transform .8s ease;}
.rv-r.v{opacity:1;transform:translateX(0);}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

/* ════════════════════════════════════════
   MOBILE
════════════════════════════════════════ */
@media(max-width:900px){
  nav{padding:16px 22px;}
  nav.sc{padding:12px 22px;}
  .ham{display:flex;}
  .nav-cta{display:none;}

  .hero-body{grid-template-columns:1fr;}
  .hero-l{
    padding:clamp(90px,16vw,120px) 24px clamp(32px,6vh,52px);
    border-right:none;
    border-bottom:1px solid var(--rule);
  }
  .h-badge{top:clamp(70px,12vw,100px);left:24px;}
  .hero-wm{font-size:clamp(160px,50vw,260px);right:-8vw;top:-8vh;}
  .hero-r{height:60vw;min-height:240px;display:block;position:relative;}
  .hero-img-top{height:100%;position:absolute;}
  .hero-img-bot{display:none;}
  .hero-yr{top:auto;bottom:16px;left:16px;}

  .about{grid-template-columns:1fr;gap:52px;padding:70px 22px;}
  .ab-img2{display:none;}
  .ab-img1{height:280px;}
  .ab-accent{display:none;}
  .ab-badge{top:-10px;right:-8px;padding:12px;}
  .ab-num{font-size:28px;}

  .feat-intro{grid-template-columns:1fr;gap:16px;}
  .feat-wm{display:none;}
  .feat-grid{grid-template-columns:1fr 1fr;}
  .fc:nth-child(3n){border-right:1px solid var(--rule);}
  .fc:nth-child(2n){border-right:none;}
  .fc:nth-last-child(-n+3){border-bottom:1px solid var(--rule);}
  .fc:nth-last-child(-n+2){border-bottom:none;}
  .fc:last-child{border-bottom:none;}

  .gl-grid{
    grid-template-columns:1fr 1fr;
    grid-template-rows:auto;
  }
  .gi-A,.gi-B,.gi-C,.gi-D,.gi-E,.gi-F{grid-column:auto;grid-row:auto;}
  .gi-A{grid-column:1/-1;height:200px;}
  .gi img{min-height:150px;height:100%;}

  .stats{padding:40px 16px;gap:0;}
  .sc-card{border-right:none;border-bottom:1px solid rgba(250,244,232,.07);padding:24px 12px;}
  .sc-card:last-child{border-bottom:none;}

  .ft-top{grid-template-columns:1fr;gap:28px;}
  .ft-bottom{flex-direction:column;align-items:flex-start;}

  .imgscroll-hdr{flex-direction:column;align-items:flex-start;}
  .ic{width:72vw;height:52vw;}

  .q-slice{height:50px;}
  .q-slice-b{height:50px;}
}
@media(max-width:600px){
  .feat-grid{grid-template-columns:1fr;}
  .fc:nth-child(n){border-right:none;border-bottom:1px solid var(--rule);}
  .fc:last-child{border-bottom:none;}
  .ab-stats{grid-template-columns:1fr 1fr;}
  .about,.feat,.gallery{padding:60px 18px;}
  .imgscroll{padding:60px 0;}
}
`;

/* ═══════════════════════ DATA ═══════════════════════ */
const MQ = ['Admin Panel', 'Staff Portal', 'Live Dashboard', 'Table Control', 'Order Management', 'Inventory', 'Analytics', 'Staff Roster'];
const R1 = [
  { tag: 'Kitchen Ops', name: 'Live Kitchen View', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80' },
  { tag: 'Floor Ops', name: 'Main Dining Hall', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80' },
  { tag: 'Staff Team', name: 'Kitchen Brigade', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&q=80' },
  { tag: 'Table Service', name: 'Floor Operations', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700&q=80' },
  { tag: 'Inventory', name: 'Pantry & Cold Store', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80' },
  { tag: 'Beverage', name: 'Bar Station', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80' },
];
const R2 = [
  { tag: 'Daily Prep', name: "Chef's Mise en Place", img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=700&q=80' },
  { tag: 'Private Dining', name: 'Banquet Room Setup', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80' },
  { tag: 'Plating', name: 'Finishing Counter', img: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=700&q=80' },
  { tag: 'Guest Exp.', name: 'Front of House', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80' },
  { tag: 'Morning Ops', name: 'Opening Shift', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=700&q=80' },
  { tag: 'Events', name: 'Special Event Night', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80' },
];
const FEATS = [
  { num: '01', ico: '📋', title: 'Order Management', body: 'Track every dine-in, takeaway, and delivery order live from one dashboard. Assign, update, and close orders in seconds.' },
  { num: '02', ico: '🪑', title: 'Table Control', body: 'Visual floor plan with real-time availability, reservations, and walk-in management across all sections.' },
  { num: '03', ico: '👨‍🍳', title: 'Staff Scheduling', body: 'Build rosters, manage shifts, track attendance, and handle leave requests — all from a single interface.' },
  { num: '04', ico: '📦', title: 'Inventory Tracker', body: 'Monitor stock levels, set alerts, track wastage, and auto-generate purchase orders before you run out.' },
  { num: '05', ico: '📊', title: 'Revenue Analytics', body: 'Daily covers, revenue, top dishes, and peak hours displayed in beautiful visual reports and exports.' },
  { num: '06', ico: '🔔', title: 'Live Notifications', body: 'Instant alerts for new orders, staff actions, stock issues, and special guest requests — every shift.' },
];
const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', cls: 'gi-A', name: 'Main Dining Room', tag: 'Ambiance' },
  { src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80', cls: 'gi-B', name: 'Kitchen Brigade', tag: 'Team' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', cls: 'gi-C', name: 'Kitchen Station', tag: 'Operations' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', cls: 'gi-D', name: 'Private Dining', tag: 'Events' },
  { src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80', cls: 'gi-E', name: 'Plating Station', tag: 'Culinary' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', cls: 'gi-F', name: 'Front of House', tag: 'Service' },
];
const STATS = [
  { ico: '📋', n: '1,240+', l: 'Orders Managed' },
  { ico: '🪑', n: '48', l: 'Tables Tracked' },
  { ico: '👨‍🍳', n: '36', l: 'Staff Members' },
  { ico: '⭐', n: '4.9', l: 'Guest Rating' },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function AdminLanding() {
  const coRef = useRef<HTMLDivElement>(null);
  const ciRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const outer = useRef({ x: -200, y: -200 });
  const tgt = useRef({ x: -200, y: -200 });
  const qBg = useRef<HTMLDivElement>(null);
  const qSec = useRef<HTMLDivElement>(null);
  const [mob, setMob] = useState(false);
  const [sc, setSc] = useState(false);
  /* splash: 'show' → 'exit' → 'done' */
  const [splash, setSplash] = useState<'show' | 'exit' | 'done'>('show');

  /* ── Splash timer: animate 3.4s then curtain-exit ── */
  useEffect(() => {
    // lock scroll while splash is visible
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => {
      setSplash('exit');
      // after curtains finish (0.72s) remove splash from DOM
      setTimeout(() => {
        setSplash('done');
        document.body.style.overflow = '';
      }, 780);
    }, 3400);
    return () => { clearTimeout(t1); document.body.style.overflow = ''; };
  }, []);

  /* cursor — pure DOM */
  useEffect(() => {
    const isPtr = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!isPtr) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const onMv = (e: MouseEvent) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (ciRef.current) { ciRef.current.style.left = e.clientX + 'px'; ciRef.current.style.top = e.clientY + 'px'; }
    };
    const tick = () => {
      outer.current.x = lerp(outer.current.x, tgt.current.x, .13);
      outer.current.y = lerp(outer.current.y, tgt.current.y, .13);
      if (coRef.current) { coRef.current.style.left = outer.current.x + 'px'; coRef.current.style.top = outer.current.y + 'px'; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const onDn = () => coRef.current?.classList.add('clk');
    const onUp = () => coRef.current?.classList.remove('clk');
    const onEn = () => coRef.current?.classList.add('hov');
    const onLv = () => coRef.current?.classList.remove('hov');
    const bind = () => document.querySelectorAll('a,button,.ic,.gi,.fc,.ab-stat,.sc-card').forEach(el => {
      el.addEventListener('mouseenter', onEn); el.addEventListener('mouseleave', onLv);
    });
    bind();
    window.addEventListener('mousemove', onMv);
    window.addEventListener('mousedown', onDn);
    window.addEventListener('mouseup', onUp);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('mousemove', onMv); window.removeEventListener('mousedown', onDn); window.removeEventListener('mouseup', onUp); };
  }, []);

  /* nav + parallax */
  useEffect(() => {
    const onSc = () => {
      setSc(window.scrollY > 50);
      if (qSec.current && qBg.current) {
        const r = qSec.current.getBoundingClientRect();
        const p = (window.innerHeight / 2 - r.top) / window.innerHeight;
        qBg.current.style.transform = `translateY(${p * 65}px)`;
      }
    };
    window.addEventListener('scroll', onSc, { passive: true });
    return () => window.removeEventListener('scroll', onSc);
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); }),
      { threshold: .08 }
    );
    document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const mq3 = [...MQ, ...MQ, ...MQ];
  const r1d = [...R1, ...R1];
  const r2d = [...R2, ...R2];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SPLASH_CSS + CSS }} />
      <div id="co" ref={coRef} />
      <div id="ci" ref={ciRef} />

      {/* ══ SPLASH SCREEN ══ */}
      {splash !== 'done' && (
        <>
          <div className={`splash-t${splash === 'exit' ? ' go' : ''}`} />
          <div className={`splash-b${splash === 'exit' ? ' go' : ''}`} />
          {splash === 'show' && (
            <div className="splash">
              <div className="splash-ring" style={{ width: 'min(68vw,68vh,480px)', height: 'min(68vw,68vh,480px)', animationDelay: '0.1s' }} />
              <div className="splash-ring" style={{ width: 'min(52vw,52vh,360px)', height: 'min(52vw,52vh,360px)', animationDelay: '0.22s', borderColor: 'rgba(192,144,32,.12)' }} />
              <div className="splash-spin" style={{ width: 'min(60vw,60vh,420px)', height: 'min(60vw,60vh,420px)' }} />
              <div className="splash-corner sp-tl" />
              <div className="splash-corner sp-tr" />
              <div className="splash-corner sp-bl" />
              <div className="splash-corner sp-br" />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <div className="splash-name">Zaika</div>
                <div className="splash-rule">
                  <div className="sr-l" /><div className="sr-dot" />
                  <div className="sr-d" />
                  <div className="sr-dot" /><div className="sr-l" />
                </div>
                <div className="splash-sub">Royal</div>
                <div className="splash-tag">Restaurant Management System · Est. 2008</div>
              </div>
              <div className="splash-loader">
                <div className="splash-bar-track"><div className="splash-bar-fill" /></div>
                <div className="splash-loader-txt">Loading</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile drawer */}
      <div className={`mob ${mob ? 'open' : ''}`}>
        <button className="mob-x" onClick={() => setMob(false)}>✕</button>
        {['About', 'Operations', 'Gallery', 'Dashboard'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMob(false)}>{l}</a>
        ))}
        <a href="/admin/login" className="mob-cta" onClick={() => setMob(false)}>Access Dashboard</a>
      </div>

      {/* NAV */}
      <nav className={sc ? 'sc' : ''}>
        <div className="nav-wordmark">
          <span className="nav-w1">Zaika Royal</span>
          <span className="nav-w2">Staff & Admin Portal</span>
        </div>
        <a href="/admin/login" className="nav-cta"><span>Access Dashboard</span></a>
        <button className="ham" onClick={() => setMob(true)} aria-label="Open menu">
          <b /><b /><b />
        </button>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        {/* Giant watermark letter */}
        <div className="hero-wm" aria-hidden="true">Z</div>

        {/* Horizontal rules */}
        <div className="hero-rules" aria-hidden="true">
          {[20, 40, 60, 80].map(p => <span key={p} style={{ top: p + '%' }} />)}
        </div>

        <div className="hero-body">
          {/* LEFT */}
          <div className="hero-l">
            <div className="h-badge">
              <div className="h-badge-line" />
              <span className="h-badge-txt">Staff &amp; Admin Portal · Est. 2008</span>
            </div>

            <h1 className="h-name">Zaika</h1>
            <p className="h-name-sub">Royal</p>

            <div className="h-rule">
              <div className="h-rule-l" /><div className="h-rule-dot" />
              <div className="h-rule-d" />
              <div className="h-rule-dot" /><div className="h-rule-l" />
            </div>

            <p className="h-desc">
              Restaurant Management System<br />
              Old Delhi · Since 2008
            </p>

            <a href="/admin/login" className="h-btn">
              <span>Access Dashboard</span>
              <div className="h-btn-arrow" />
            </a>
            <p className="h-note">Authorised personnel only</p>

            <div className="h-scroll">
              <div className="hs-line" />
              <span className="hs-txt">Scroll</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-r">
            <div className="hero-img-top">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85" alt="Zaika Royal dining room" loading="eager" />
            </div>
            <div className="hero-img-bot">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" alt="Kitchen operations" loading="lazy" />
            </div>
            <div className="hero-yr">
              <div className="hero-yr-n">16</div>
              <div className="hero-yr-t">Years of<br />Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="mq">
        <div className="mq-track">
          {mq3.map((t, i) => (
            <div key={i} className="mq-item">{t}<span className="mq-sep">✦</span></div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="rv-l">
          <p className="sec-pre">Our Restaurant</p>
          <div className="gold-rule"><div className="gr-l" /><div className="gr-d" /><div className="gr-l" /></div>
          <h2 className="sec-h">Where Every Plate<br />Tells a <em>Story</em></h2>
          <p className="sec-p">
            Born in 2008 from a family kitchen in the heart of Old Delhi, Zaika Royal has grown into one of the capital's most celebrated fine-dining destinations. This portal puts every aspect of operations at your fingertips — live orders, staff, tables, and reports.
          </p>
          <p className="sec-p" style={{ marginTop: 10 }}>
            Built for speed, precision, and ease — so your team can focus on what matters: delivering an unforgettable experience every service.
          </p>
          <div className="ab-stats">
            {[['50K+', 'Guests Served'], ['120+', 'Heritage Recipes'], ['14', 'Awards Won'], ['4.9★', 'Avg Rating']].map(([n, l]) => (
              <div key={l} className="ab-stat"><div className="ab-stat-n">{n}</div><div className="ab-stat-l">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="about-imgs rv-r">
          <div className="ab-accent" />
          <div className="ab-badge"><div className="ab-num">16</div><div className="ab-lbl">Years of<br />Craft</div></div>
          <img className="ab-img1"
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
            alt="Restaurant interior" loading="lazy" />
          <img className="ab-img2"
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80"
            alt="Plated dish" loading="lazy" />
        </div>
      </section>

      {/* IMAGE SCROLL */}
      <section id="operations" className="imgscroll">
        <div className="imgscroll-hdr rv">
          <div>
            <p className="sec-pre">Behind the Scenes</p>
            <div className="gold-rule"><div className="gr-l" /><div className="gr-d" /><div className="gr-l" /></div>
            <h2 className="sec-h">Our <em>Operations</em></h2>
          </div>
        </div>
        <div className="scroll-row">
          <div className="scroll-inner L">
            {r1d.map((c, i) => (
              <div key={i} className="ic">
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="ic-ov" />
                <div className="ic-txt"><div className="ic-tag">{c.tag}</div><div className="ic-name">{c.name}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="scroll-row">
          <div className="scroll-inner R">
            {r2d.map((c, i) => (
              <div key={i} className="ic">
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="ic-ov" />
                <div className="ic-txt"><div className="ic-tag">{c.tag}</div><div className="ic-name">{c.name}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feat">
        <div className="feat-intro">
          <div className="rv-l">
            <p className="sec-pre">Dashboard Features</p>
            <div className="gold-rule"><div className="gr-l" /><div className="gr-d" /><div className="gr-l" /></div>
            <h2 className="sec-h">Everything You Need<br />to <em>Run the Show</em></h2>
            <p className="sec-p">Six powerful tools built into one seamless management platform — designed for restaurants that refuse to compromise.</p>
          </div>
          <div className="feat-wm rv-r" aria-hidden="true">06</div>
        </div>
        <div className="feat-grid">
          {FEATS.map((f, i) => (
            <div key={i} className="fc rv" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="fc-num">{f.num}</div>
              <span className="fc-ico">{f.ico}</span>
              <div className="fc-title">{f.title}</div>
              <div className="fc-body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery">
        <div className="rv" style={{ textAlign: 'center' }}>
          <p className="sec-pre" style={{ justifyContent: 'center' }}>Our Space</p>
          <div className="gold-rule" style={{ justifyContent: 'center' }}><div className="gr-l" /><div className="gr-d" /><div className="gr-l" /></div>
          <h2 className="sec-h" style={{ textAlign: 'center' }}>Inside <em>Zaika Royal</em></h2>
        </div>
        <div className="gl-grid">
          {GALLERY.map((g, i) => (
            <div key={i} className={`gi ${g.cls} rv`} style={{ transitionDelay: `${i * 0.09}s` }}>
              <img src={g.src} alt={g.name} loading="lazy" />
              <div className="gi-ov">
                <div className="gi-ovname">{g.name}</div>
                <div className="gi-ovtag">{g.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote-sec" ref={qSec}>
        <div className="q-bg" ref={qBg} />
        <div className="q-ov" />
        <div className="q-slice" />
        <div className="q-slice-b" />
        <div className="q-content rv">
          <span className="q-mark">"</span>
          <p className="q-text">A great restaurant runs on two things —<br />exceptional food and an exceptional team.</p>
          <p className="q-attr">— Chef Rajesh Khanna, Founder · Zaika Royal</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {STATS.map((s, i) => (
          <div key={s.l} className="sc-card rv" style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="sc-ico">{s.ico}</span>
            <div className="sc-n">{s.n}</div>
            <div className="sc-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="ft-top">
          <div>
            <span className="ft-brand">Zaika Royal</span>
            <p className="ft-desc">Internal management portal for Zaika Royal restaurant, Old Delhi. For access issues contact your system administrator.</p>
          </div>
          <div>
            <div className="ft-col-h">Navigate</div>
            <ul className="ft-links">
              {['About', 'Operations', 'Gallery', 'Dashboard'].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-h">Contact</div>
            <div className="ft-contact">
              📞 +91 98765 43210<br />
              📍 12 Royal Heritage Lane<br />
              Old Delhi — 110006
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy">© 2024 Zaika Royal. All rights reserved.</span>
          <span className="ft-ver">v2.4.1 · Admin Build</span>
        </div>
      </footer>
    </>
  );
}