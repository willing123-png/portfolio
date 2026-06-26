import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { backgroundTrack, sceneLayers } from '../data/sceneLayers.js';

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = 'scene-motion-lab-tracks';
const stage = document.querySelector('[data-scene-stage]');
const background = document.querySelector('.scene-background-track');
const panel = document.querySelector('[data-timeline-panel]');
const playhead = document.querySelector('[data-playhead]');
const playheadValue = document.querySelector('[data-playhead-value]');
const trackSelect = document.querySelector('[data-track-select]');
const keyframeSelect = document.querySelector('[data-keyframe-select]');
const output = document.querySelector('[data-panel-output]');
const resetButton = document.querySelector('[data-panel-reset]');
const copyButton = document.querySelector('[data-panel-copy]');
const paramInputs = [...document.querySelectorAll('[data-param]')];

const clone = (value) => JSON.parse(JSON.stringify(value));
const tracks = loadTracks();
let selectedTrackId = tracks[0]?.id;
let selectedKeyframeIndex = 0;
let activeProgress = 0;
let scrollTrigger;

function loadTracks() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* Keep default tracks when local storage is unavailable. */
  }

  return clone(sceneLayers);
}

function saveTracks() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function frameValueAt(keyframes, progress, key) {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];

  if (progress <= first.progress) return first[key];
  if (progress >= last.progress) return last[key];

  const nextIndex = keyframes.findIndex((frame) => frame.progress >= progress);
  const previous = keyframes[nextIndex - 1];
  const next = keyframes[nextIndex];
  const localProgress = (progress - previous.progress) / (next.progress - previous.progress);

  return lerp(previous[key], next[key], localProgress);
}

function applyLayerFrame(layer, progress) {
  const element = document.querySelector(`[data-track-id="${layer.id}"]`);
  if (!element) return;

  element.style.setProperty('--x', frameValueAt(layer.keyframes, progress, 'x'));
  element.style.setProperty('--y', frameValueAt(layer.keyframes, progress, 'y'));
  element.style.setProperty('--w', frameValueAt(layer.keyframes, progress, 'width'));
  element.style.setProperty('--opacity', frameValueAt(layer.keyframes, progress, 'opacity'));
}

function applySceneFrame(progress) {
  activeProgress = progress;

  if (background) {
    const backgroundX = frameValueAt(backgroundTrack.keyframes, progress, 'x');
    gsap.set(background, { x: `${backgroundX}vw` });
  }

  tracks.forEach((layer) => applyLayerFrame(layer, progress));
  updatePlayheadDisplay();
}

function setScrollProgress(progress) {
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  window.scrollTo(0, maxScroll * progress);
  applySceneFrame(progress);
}

function selectedTrack() {
  return tracks.find((track) => track.id === selectedTrackId);
}

function selectedFrame() {
  return selectedTrack()?.keyframes[selectedKeyframeIndex];
}

function populateTrackSelect() {
  trackSelect.innerHTML = tracks
    .map((track) => `<option value="${track.id}">${track.id}</option>`)
    .join('');
  trackSelect.value = selectedTrackId;
}

function populateKeyframeSelect() {
  const track = selectedTrack();
  if (!track) return;

  keyframeSelect.innerHTML = track.keyframes
    .map((frame, index) => `<option value="${index}">${Math.round(frame.progress * 100)}%</option>`)
    .join('');
  keyframeSelect.value = String(selectedKeyframeIndex);
}

function updateParamControls() {
  const frame = selectedFrame();
  if (!frame) return;

  paramInputs.forEach((input) => {
    const key = input.dataset.param;
    input.value = frame[key];
    const valueOutput = document.querySelector(`[data-param-value="${key}"]`);
    if (valueOutput) valueOutput.textContent = String(Number(frame[key]).toFixed(key === 'opacity' ? 2 : 0));
  });
}

function updatePlayheadDisplay() {
  if (playhead) playhead.value = String(activeProgress);
  if (playheadValue) playheadValue.textContent = `${Math.round(activeProgress * 100)}%`;
}

function updateOutput() {
  if (!output) return;
  output.value = JSON.stringify(tracks, null, 2);
}

function refreshPanel() {
  populateTrackSelect();
  populateKeyframeSelect();
  updateParamControls();
  updatePlayheadDisplay();
  updateOutput();
}

function initPanel() {
  if (!panel) return;

  refreshPanel();

  playhead?.addEventListener('input', () => {
    setScrollProgress(Number(playhead.value));
  });

  trackSelect?.addEventListener('change', () => {
    selectedTrackId = trackSelect.value;
    selectedKeyframeIndex = 0;
    const frame = selectedFrame();
    if (frame) setScrollProgress(frame.progress);
    refreshPanel();
  });

  keyframeSelect?.addEventListener('change', () => {
    selectedKeyframeIndex = Number(keyframeSelect.value);
    const frame = selectedFrame();
    if (frame) setScrollProgress(frame.progress);
    refreshPanel();
  });

  paramInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const frame = selectedFrame();
      if (!frame) return;

      frame[input.dataset.param] = Number(input.value);
      saveTracks();
      applySceneFrame(activeProgress);
      updateParamControls();
      updateOutput();
    });
  });

  resetButton?.addEventListener('click', () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  copyButton?.addEventListener('click', async () => {
    updateOutput();
    output?.select();
    await navigator.clipboard?.writeText(output.value);
  });
}

if (stage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  applySceneFrame(0);
  initPanel();

  if (!reducedMotion) {
    scrollTrigger = ScrollTrigger.create({
      trigger: '.scene-shell',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => applySceneFrame(self.progress)
    });
  }
}
