import React, { useEffect, useMemo, useState } from 'react';
import LiquidEther from './LiquidEther.jsx';
import './HeroBackgroundTuner.css';

const defaultSettings = {
  color1: '#5227FF',
  color2: '#9fadff',
  color3: '#a597cf',
  mouseForce: 20,
  mouseDelay: 35,
  cursorSize: 100,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  viscous: 30,
  resolution: 0.5,
  colorBoost: 4.2,
  fadeStart: 48,
  fadeOpacity: 0.96,
};

const storageKey = 'portfolio.heroBackgroundSettings';

function readStoredSettings() {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
}

function NumberControl({ label, min, max, step, value, onChange }) {
  return (
    <label className="hero-bg-control">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ColorControl({ label, value, onChange }) {
  return (
    <label className="hero-bg-color-control">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
      <code>{value}</code>
    </label>
  );
}

export default function HeroBackgroundTuner() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    setSettings(readStoredSettings());

    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === 'hero' || params.has('heroDebug')) {
      setIsPanelVisible(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--hero-bottom-fade-start', `${settings.fadeStart}%`);
    document.documentElement.style.setProperty('--hero-bottom-fade-opacity', String(settings.fadeOpacity));
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPanelVisible(false);
        return;
      }

      if (event.shiftKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setIsPanelVisible((visible) => !visible);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const colors = useMemo(() => [settings.color1, settings.color2, settings.color3], [settings]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      <div className="liquid-ether-frame z-0">
        <LiquidEther
          colors={colors}
          mouseForce={settings.mouseForce}
          mouseDelay={settings.mouseDelay}
          cursorSize={settings.cursorSize}
          isViscous
          viscous={settings.viscous}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={settings.resolution}
          isBounce={false}
          autoDemo
          autoSpeed={settings.autoSpeed}
          autoIntensity={settings.autoIntensity}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          colorBoost={settings.colorBoost}
        />
      </div>

      {isPanelVisible && (
        <aside className="hero-bg-debug-panel">
          <div className="hero-bg-debug-body">
            <div className="hero-bg-debug-header">
              <p>Liquid Ether</p>
              <div className="hero-bg-debug-actions">
                <button type="button" onClick={resetSettings}>重置</button>
                <button type="button" onClick={() => setIsPanelVisible(false)}>隐藏</button>
              </div>
            </div>

            <ColorControl label="颜色 1" value={settings.color1} onChange={(value) => updateSetting('color1', value)} />
            <ColorControl label="颜色 2" value={settings.color2} onChange={(value) => updateSetting('color2', value)} />
            <ColorControl label="颜色 3" value={settings.color3} onChange={(value) => updateSetting('color3', value)} />

            <NumberControl label="显色强度" min={1} max={8} step={0.1} value={settings.colorBoost} onChange={(value) => updateSetting('colorBoost', value)} />
            <NumberControl label="鼠标力度" min={0} max={60} step={1} value={settings.mouseForce} onChange={(value) => updateSetting('mouseForce', value)} />
            <NumberControl label="鼠标延迟" min={0} max={100} step={1} value={settings.mouseDelay} onChange={(value) => updateSetting('mouseDelay', value)} />
            <NumberControl label="影响范围" min={40} max={220} step={5} value={settings.cursorSize} onChange={(value) => updateSetting('cursorSize', value)} />
            <NumberControl label="自动速度" min={0.1} max={1.4} step={0.05} value={settings.autoSpeed} onChange={(value) => updateSetting('autoSpeed', value)} />
            <NumberControl label="自动强度" min={0.5} max={6} step={0.1} value={settings.autoIntensity} onChange={(value) => updateSetting('autoIntensity', value)} />
            <NumberControl label="黏稠度" min={0} max={80} step={1} value={settings.viscous} onChange={(value) => updateSetting('viscous', value)} />
            <NumberControl label="清晰度" min={0.25} max={0.8} step={0.05} value={settings.resolution} onChange={(value) => updateSetting('resolution', value)} />
            <NumberControl label="渐隐起点" min={28} max={82} step={1} value={settings.fadeStart} onChange={(value) => updateSetting('fadeStart', value)} />
            <NumberControl label="底部遮罩" min={0.35} max={1} step={0.01} value={settings.fadeOpacity} onChange={(value) => updateSetting('fadeOpacity', value)} />
          </div>
        </aside>
      )}
    </>
  );
}
