import React, { useState } from 'react';
import TextType from './TextType.jsx';
import './HeroIntro.css';

export default function HeroIntro() {
  const [portfolioDone, setPortfolioDone] = useState(false);
  const [workDone, setWorkDone] = useState(false);

  return (
    <>
      <div className="flex items-end gap-5">
        <h1
          className="hero-intro-title font-black leading-[0.82] tracking-tight"
        >
          <TextType
            text="PORTFOLIO"
            typingSpeed={36}
            initialDelay={180}
            loop={false}
            showCursor={!portfolioDone}
            onComplete={() => setPortfolioDone(true)}
          />
        </h1>
        <span className="mb-3 hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/80 text-3xl md:flex">
          ↗
        </span>
      </div>

      <h2
        className="hero-intro-work font-bold leading-none"
      >
        {portfolioDone && (
          <TextType
            text="WORK"
            typingSpeed={54}
            initialDelay={260}
            loop={false}
            showCursor={!workDone}
            onComplete={() => setWorkDone(true)}
          />
        )}
      </h2>

      <div
        className={`hero-contact mt-10 space-y-1.5 text-base text-white/85 md:text-lg ${workDone ? 'hero-contact--visible' : ''}`}
      >
        <p>Email：willinginworld@gmail.com</p>
        <p className="pt-2 tracking-[0.3em] text-white/70">UI &amp; UX DESIGNER</p>
      </div>
    </>
  );
}
