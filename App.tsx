import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';

function App() {
  const [ing, setIng] = useState('');
  const [recipes, setRecipes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecipes = async () => {
    if (!ing.trim()) return;
    setLoading(true);
    setRecipes(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sen profesyonel bir şefsin. Elimdeki malzemeler şunlar: ${ing}.\n\nLütfen bana bu malzemelerle yapılabilecek 2-3 farklı lezzetli tarif öner. Her tarif için şunları yaz:\n- Yemek Adı\n- Hazırlama Süresi\n- Adım Adım Yapılışı`
            }]
          }]
        })
      });

      const data = await res.json();
      
      if (data.error) {
        setRecipes(`API Hatası: ${data.error.message}`);
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setRecipes(reply || 'Tarif bulunamadı.');
      }
    } catch (e) {
      setRecipes('Bağlantı hatası oluştu. Vercel üzerindeki GEMINI_API_KEY değişkenini ve internet bağlantını kontrol et.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '40px auto', backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <ChefHat size={36} color="#16a34a" />
          <h1 style={{ margin: 0, color: '#15803d', fontSize: '28px' }}>Tarif Sepeti</h1>
        </div>
        
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          Dolabında ne varsa yaz, Gemini sana anında özel tarif çıkarsın!
        </p>
        
        <textarea
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #bbf7d0', fontSize: '15px', boxSizing: 'border-box', marginBottom: '16px', outline: 'none' }}
          rows={4}
          placeholder="Örn: 2 yumurta, 1 domates, biraz peynir, zeytinyağı..."
          value={ing}
          onChange={(e) => setIng(e.target.value)}
        />

        <button
          onClick={getRecipes}
          disabled={loading}
          style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#86efac' : '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}
        >
          <Sparkles size={20} /> {loading ? 'Şef Hazırlıyor...' : 'Tarif Oluştur'}
        </button>

        {recipes && (
          <div style={{ marginTop: '28px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', lineHeight: '1.6', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
            {recipes}
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
