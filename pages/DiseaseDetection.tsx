
import React, { useState, useRef } from 'react';
import { detectCropDisease } from '../geminiService';
import { DiseaseResult } from '../types';

const DiseaseDetection: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await detectCropDisease(base64Data);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze image. Please ensure it's a clear photo of a plant.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Crop Disease Diagnosis</h2>
        <p className="text-slate-500 mt-2">Upload a clear photo of your plant leaves for instant diagnosis.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-square rounded-3xl border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
              image ? 'border-green-500 bg-white' : 'border-slate-300 bg-slate-100 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4 text-slate-400">
                  <i className="fas fa-cloud-upload-alt text-3xl"></i>
                </div>
                <p className="font-bold text-slate-700">Tap to Upload</p>
                <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <i className="fas fa-upload mr-2"></i>Upload Photo
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
            >
              <i className="fas fa-camera mr-2"></i>Take Photo
            </button>
            <input 
              type="file" 
              ref={cameraInputRef} 
              onChange={handleCameraCapture} 
              accept="image/*" 
              capture="environment"
              className="hidden" 
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-3">
              <i className="fas fa-exclamation-circle mt-1"></i>
              <p>{error}</p>
            </div>
          )}

          {image && (
            <button
              onClick={analyzeImage}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-900/20 transition-all ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch animate-spin"></i> Analyzing...
                </span>
              ) : 'Diagnose Plant'}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
              <div className={`p-6 border-b border-slate-100 flex items-center justify-between ${
                result.severity === 'Critical' ? 'bg-red-50' : result.severity === 'High' ? 'bg-orange-50' : 'bg-green-50'
              }`}>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{result.cropName}</h3>
                  <p className={`font-semibold ${
                    result.severity === 'Critical' ? 'text-red-600' : result.severity === 'High' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {result.diseaseName}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    result.severity === 'Critical' ? 'bg-red-600 text-white' : 
                    result.severity === 'High' ? 'bg-orange-500 text-white' : 
                    'bg-green-600 text-white'
                  }`}>
                    {result.severity}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Observation</h4>
                  <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                      <i className="fas fa-flask"></i> Chemical Treatment
                    </h4>
                    <p className="text-sm text-blue-800 mb-2"><strong>Products:</strong> {result.chemicalRemedy.products.join(', ')}</p>
                    <p className="text-sm text-blue-700">{result.chemicalRemedy.instructions}</p>
                    <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center gap-2 text-xs text-blue-600 italic">
                      <i className="fas fa-shield-alt"></i> {result.chemicalRemedy.precautions}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                    <h4 className="text-green-900 font-bold mb-2 flex items-center gap-2">
                      <i className="fas fa-leaf"></i> Organic Remedy
                    </h4>
                    <p className="text-sm text-green-800 mb-2"><strong>Method:</strong> {result.organicRemedy.treatment}</p>
                    <p className="text-sm text-green-700">{result.organicRemedy.application}</p>
                    <div className="mt-3 pt-3 border-t border-green-200/50 text-xs text-green-600">
                      <strong>Preparation:</strong> {result.organicRemedy.preparation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                <i className="fas fa-microscope text-2xl"></i>
              </div>
              <h3 className="font-bold text-slate-400">Awaiting Analysis</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xs">Upload a photo to see the results and expert remedies here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
