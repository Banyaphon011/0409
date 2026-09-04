import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800');
  const [watermarkText, setWatermarkText] = useState(() => localStorage.getItem('savedMemeText') || 'PHUKET');
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState('center');
  const [grayscale, setGrayscale] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');

  const [submittedImageUrl, setSubmittedImageUrl] = useState('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800');
  const [submittedText, setSubmittedText] = useState('PHUKET');
  const [submittedTextSize, setSubmittedTextSize] = useState(32);
  const [submittedTextColor, setSubmittedTextColor] = useState('#ffffff');
  const [submittedTextPosition, setSubmittedTextPosition] = useState('center');
  const [submittedGrayscale, setSubmittedGrayscale] = useState(0);
  const [submittedBrightness, setSubmittedBrightness] = useState(100);
  const [submittedEmoji, setSubmittedEmoji] = useState('🔥');

  const canvasRef = useRef(null);

  const builtInPresets = [
    { name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' },
    { name: 'Island', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500' },
    { name: 'Mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500' },
    { name: 'Scenery', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500' }
  ];

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
      ctx.font = `800 ${computedSize}px sans-serif`;

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
        ctx.font = `${computedSize * 1.2}px sans-serif`;
        ctx.fillText(submittedEmoji, img.width - (computedSize * 1.5), img.height - 20);
      }

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand-logo">
          📍 Meme<span>Studio</span>
        </div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Presets</li>
          <li>Editor</li>
        </ul>
      </nav>

      <div className="main-layout">
        <div className="control-card">
          <div className="card-title">Meme Controls</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Preset Templates</label>
              <div className="preset-grid">
                {builtInPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    className="preset-card"
                    onClick={() => setImageFile(preset.url)}
                  >
                    <img src={preset.url} alt={preset.name} />
                    <span className="preset-title">{preset.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Custom Image Upload</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="form-group">
              <label>Text Content</label>
              <input className="form-control" type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Text Size (px)</label>
                <input className="form-control" type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} min="10" max="100" />
              </div>
              <div className="form-group">
                <label>Text Color</label>
                <input className="form-control" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ height: '42px', padding: '2px' }} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position</label>
                <select className="form-control" value={textPosition} onChange={(e) => setTextPosition(e.target.value)}>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sticker</label>
                <select className="form-control" value={selectedEmoji} onChange={(e) => setSelectedEmoji(e.target.value)}>
                  <option value="🔥">🔥 Fire</option>
                  <option value="😂">😂 Laugh</option>
                  <option value="😎">😎 Cool</option>
                  <option value="❤️">❤️ Heart</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grayscale: {grayscale}%</label>
                <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Brightness: {brightness}%</label>
                <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary">Generate Meme</button>
          </form>
        </div>

        <div className="preview-container">
          {submittedImageUrl && (
            <div style={{ width: '100%' }}>
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
              <button onClick={handleDownload} className="btn-secondary">Download Image</button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;