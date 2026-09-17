import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Utensils, Sparkles } from 'lucide-react';

function App() {
  const [ing, setIng] = useState('');
  const [recipes, setRecipes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecipes = async () => {
    if (!ing) return;
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Elimdeki malzemeler: ${ing}. Bu malzemelerle yapılabilecek hızlı ve lezzetli yemek tarifleri öner.` }] }]
        })
      });
      const data = await res.json();
      setRecipes(data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tarif bulunamadı.');
    } catch (e) {
      setRecipes('Bir hata oluştu, lütfen API anahtarınızı veya bağlantınızı kontrol edin.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginTop: 0 }}>
          <Utensils /> Tarif Sepeti
        </h1>
        <p style={{ color: '#4b5563' }}>Elinizdeki malzemeleri yazın, yapay zeka size özel tarif üretsin!</p>
        
        <textarea
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginBottom: '12px' }}
          rows={3}
          placeholder="Örn: Domates, yumurta, biber, peynir..."
          value={ing}
          onChange={(e) => setIng(e.target.value)}
        />

        <button
          onClick={getRecipes}
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={18} /> {loading ? 'Tarif Hazırlanıyor...' : 'Tarif Bul'}
        </button>

        {recipes && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #16a34a', whiteSpace: 'pre-wrap' }}>
            {recipes}
          </div>
        )}
      </div>
    </div>
  );
}

// React'ı ekrandaki #root elementine bağlayan kısım:
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
