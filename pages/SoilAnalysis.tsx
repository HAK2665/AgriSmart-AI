
import React, { useState } from 'react';
import { getCropSuggestions } from '../geminiService';
import { SoilAnalysisInput, CropSuggestion } from '../types';

const SoilAnalysis: React.FC = () => {
  const [form, setForm] = useState<SoilAnalysisInput>({
    nitrogen: 40,
    phosphorus: 40,
    potassium: 40,
    ph: 6.5,
    soilType: 'Loamy',
    weather: 'Sunny and warm'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropSuggestion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const suggestions = await getCropSuggestions(form);
      setResult(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Soil Analysis & Advisor</h2>
        <p className="text-slate-500 mt-2">Enter your soil nutrition levels for specialized crop recommendations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nitrogen (N)</label>
                <input 
                  type="number" 
                  value={form.nitrogen} 
                  onChange={(e) => setForm({...form, nitrogen: +e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phosphorus (P)</label>
                <input 
                  type="number" 
                  value={form.phosphorus} 
                  onChange={(e) => setForm({...form, phosphorus: +e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Potassium (K)</label>
                <input 
                  type="number" 
                  value={form.potassium} 
                  onChange={(e) => setForm({...form, potassium: +e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Soil pH</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={form.ph} 
                  onChange={(e) => setForm({...form, ph: +e.target.value})}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Soil Type</label>
              <select 
                value={form.soilType}
                onChange={(e) => setForm({...form, soilType: e.target.value as any})}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Sandy</option>
                <option>Clay</option>
                <option>Loamy</option>
                <option>Silty</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Current Weather</label>
              <input 
                type="text" 
                placeholder="e.g. Tropical, 25°C, Rainy"
                value={form.weather} 
                onChange={(e) => setForm({...form, weather: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
              {loading ? 'Analyzing...' : 'Generate Recommendations'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500"></i> Recommended Crops
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.suitableCrops.map((crop, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-green-900">{crop}</p>
                        <p className="text-xs text-green-700">Optimized for your soil</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-500"></i> Advisor Notes
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{result.reasoning}</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-900 font-bold">Yield Potential</p>
                    <p className="text-blue-700 font-semibold">{result.yieldPotential}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-amber-500"></i> Fertilizer & Warnings
                  </h4>
                  <div className="space-y-3">
                    {result.fertilizerSuggestions.map((f, i) => (
                      <div key={i} className="flex gap-2 text-sm text-slate-600">
                        <i className="fas fa-vial mt-1 text-slate-400"></i>
                        <span>{f}</span>
                      </div>
                    ))}
                    {result.warnings.map((w, i) => (
                      <div key={i} className="flex gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                        <i className="fas fa-exclamation-circle mt-1"></i>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <i className="fas fa-seedling text-5xl text-slate-200 mb-4"></i>
              <h3 className="font-bold text-slate-400">Soil Data Required</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xs">Fill in your soil metrics to receive professional AI-driven agricultural advice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
