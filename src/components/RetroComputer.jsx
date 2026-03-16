import React, { useState, useEffect } from 'react';

function RetroComputer() {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const text = "Good morning. Your memo is drafted, your files are sorted, and your calendar is set. Ready when you are.";

  useEffect(() => {
    let index = 0;
    let timeoutId;

    const typeWriter = () => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1));
        index++;
        const delay = 100 + Math.random() * 50;
        timeoutId = setTimeout(typeWriter, delay);
      } else {
        setIsTyping(false);
        timeoutId = setTimeout(() => {
          setTypedText('');
          index = 0;
          setIsTyping(true);
          typeWriter();
        }, 3000);
      }
    };

    typeWriter();

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className="scene">
      <div className="computer-unit">
        {/* Front Face */}
        <div className="face front">
          <div className="screen-inset">
            <div className="crt">
              <div className="crt-glow">
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {typedText}<span className="cursor"></span>
                </span>
              </div>
            </div>
          </div>

          <div className="logo-badge"></div>
          <div className="floppy-slot"></div>

          {/* Stickers */}
          <div className="sticker sticker-ball"></div>
          <div className="sticker sticker-star">★</div>
          <div className="sticker sticker-text">MACHINE<br/>INTELLIGENCE</div>

          <div className="grill">
            <div className="vent"></div><div className="vent"></div><div className="vent"></div><div className="vent"></div>
            <div className="vent"></div><div className="vent"></div><div className="vent"></div><div className="vent"></div>
          </div>
        </div>

        {/* Back Face */}
        <div className="face back"></div>

        {/* Left Face */}
        <div className="face left"></div>

        {/* Right Face */}
        <div className="face right"></div>

        {/* Top Face */}
        <div className="face top"></div>

        {/* Bottom Face */}
        <div className="face bottom"></div>

        {/* Keyboard Assembly */}
        <div className="keyboard-assembly">
          <div className="kb-base">
            <div className="keys-grid">
              {/* Row 1 */}
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>

              {/* Row 2 */}
              <div className="key wide"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key wide"></div>

              {/* Row 3 */}
              <div className="key"></div><div className="key"></div><div className="key space"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetroComputer;
