import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState(() => {
    return localStorage.getItem('savedMemeText') || '';
  });
  const [textSize, setTextSize] = useState(20);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState('top-left');
  const [grayscale, setGrayscale] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');

  const [submittedImageUrl, setSubmittedImageUrl] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [submittedTextSize, setSubmittedTextSize] = useState(20);
  const [submittedTextColor, setSubmittedTextColor] = useState('#ffffff');
  const [submittedTextPosition, setSubmittedTextPosition] = useState('top-left');
  const [submittedGrayscale, setSubmittedGrayscale] = useState(0);
  const [submittedBrightness, setSubmittedBrightness] = useState(100);
  const [submittedEmoji, setSubmittedEmoji] = useState('');

  const canvasRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('savedMemeText', watermarkText);
  }, [watermarkText]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedImageUrl(imageFile);
    setSubmittedText(watermarkText);
    setSubmittedTextSize(textSize);
    setSubmittedTextColor(textColor);
    setSubmittedTextPosition(textPosition);
    setSubmittedGrayscale(grayscale);
    setSubmittedBrightness(brightness);
    setSubmittedEmoji(selectedEmoji);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = submittedImageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `grayscale(${submittedGrayscale}%) brightness(${submittedBrightness}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      ctx.fillStyle = submittedTextColor;
      const scaleFactor = img.width / 500;
      const computedSize = submittedTextSize * scaleFactor;
      ctx.font = `${computedSize}px sans-serif`;

      let x = 20;
      let y = computedSize + 20;

      if (submittedTextPosition === 'top-right') {
        x = img.width - ctx.measureText(submittedText).width - 20;
      } else if (submittedTextPosition === 'bottom-left') {
        y = img.height - 20;
      } else if (submittedTextPosition === 'bottom-right') {
        x = img.width - ctx.measureText(submittedText).width - 20;
        y = img.height - 20;
      } else if (submittedTextPosition === 'center') {
        x = (img.width - ctx.measureText(submittedText).width) / 2;
        y = img.height / 2;
      }

      ctx.fillText(submittedText, x, y);

      if (submittedEmoji) {
        ctx.font = `${computedSize * 1.5}px sans-serif`;
        ctx.fillText(submittedEmoji, img.width - (computedSize * 2), img.height - 20);
      }

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="App">
      <h1>Meme Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </label>
        </div>
        <div>
          <label>
            Meme Text:
            <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Text Size:
            <input type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} min="10" max="100" />
          </label>
        </div>
        <div>
          <label>
            Text Color:
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Text Position:
            <select value={textPosition} onChange={(e) => setTextPosition(e.target.value)}>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Grayscale ({grayscale}%):
            <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Brightness ({brightness}%):
            <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Sticker Emoji:
            <select value={selectedEmoji} onChange={(e) => setSelectedEmoji(e.target.value)}>
              <option value="🔥">🔥 Fire</option>
              <option value="😂">😂 Laughing</option>
              <option value="😎">😎 Cool</option>
              <option value="❤️">❤️ Heart</option>
            </select>
          </label>
        </div>
        <button type="submit">Generate Meme</button>
      </form>

      {submittedImageUrl && (
        <div>
          <div className="image-container">
            <img
              src={submittedImageUrl}
              alt="Meme"
              className="watermarked-image"
              style={{ filter: `grayscale(${submittedGrayscale}%) brightness(${submittedBrightness}%)` }}
            />
            <div
              className={`watermark-text ${submittedTextPosition}`}
              style={{ color: submittedTextColor, fontSize: `${submittedTextSize}px` }}
            >
              {submittedText}
            </div>
            {submittedEmoji && (
              <div className="emoji-overlay">
                {submittedEmoji}
              </div>
            )}
          </div>
          <div>
            <button onClick={handleDownload}>Download Meme</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;