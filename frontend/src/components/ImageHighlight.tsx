import React from 'react';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ImageHighlightProps {
  imageUrl: string;
  highlightBox?: Box;
}

export default function ImageHighlight({ imageUrl, highlightBox }: ImageHighlightProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img src={imageUrl} alt="preview" style={{ display: 'block', maxWidth: '100%', borderRadius: 6 }} />
      {highlightBox && (
        <div
            style={{
            position: 'absolute',
            left: `${highlightBox.left}%`,
            top: `${highlightBox.top}%`,
            width: `${highlightBox.width}%`,
            height: `${highlightBox.height}%`,
            border: '2px solid #ff9800',
            background: 'rgba(255, 152, 0, 0.2)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
