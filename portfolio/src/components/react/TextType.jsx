import React, { useEffect, useMemo, useState } from 'react';
import './TextType.css';

export default function TextType({
  text,
  as: Component = 'span',
  typingSpeed = 50,
  initialDelay = 0,
  loop = false,
  className = '',
  cursorClassName = '',
  showCursor = true,
  cursorCharacter = '_',
  onComplete,
  ...props
}) {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setTextIndex(0);
    setCharIndex(0);
    setDisplayedText('');
    setIsDone(false);
  }, [textArray]);

  useEffect(() => {
    if (isDone) return undefined;

    const currentText = textArray[textIndex] ?? '';
    const delay = charIndex === 0 ? initialDelay : typingSpeed;

    const timeout = window.setTimeout(() => {
      if (charIndex < currentText.length) {
        const nextIndex = charIndex + 1;
        setDisplayedText(currentText.slice(0, nextIndex));
        setCharIndex(nextIndex);
        return;
      }

      if (textIndex < textArray.length - 1) {
        setTextIndex((index) => index + 1);
        setCharIndex(0);
        setDisplayedText('');
        return;
      }

      if (loop) {
        setTextIndex(0);
        setCharIndex(0);
        setDisplayedText('');
        return;
      }

      setIsDone(true);
      onComplete?.();
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [charIndex, initialDelay, isDone, loop, onComplete, textArray, textIndex, typingSpeed]);

  return (
    <Component className={`text-type ${className}`} data-complete={isDone ? 'true' : 'false'} {...props}>
      <span className="text-type__content">{displayedText}</span>
      {showCursor && (
        <span className={`text-type__cursor ${cursorClassName}`} aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}
