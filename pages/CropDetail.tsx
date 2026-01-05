
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_CYCLES } from './CropCalendar';

const CropDetail: React.FC = () => {
  const { cropId } = useParams<{ cropId: string }>();
  
  // Find crop by ID
  const crop = Object.values(SAMPLE_CYCLES).find(c => c.id === cropId);

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <i className="fas fa-leaf text-4xl mb-4 opacity-20"></i>
        <h2 className="text-xl font-bold">Crop information not found</h2>
        <Link to="/calendar" className="text-green-600 mt-2 hover:underline">Back to Calendar</Link>
      </div>
    );
  }

  const sections = [
    {
      title: 'Growth Parameters',
      icon: 'fa-vial',
      color: 'text-blue-600',
      content: [
        { label: 'Soil pH', value: crop.phRange },
        { label: 'Temperature', value: crop.tempRange },
        { label: 'Soil Moisture', value: 'Moderate to High' },
        { label: 'Sunlight', value: '6-8 hours daily' }
      ]
    },
    {
      title: 'Threat Management',
      icon: 'fa-bug',
      color: 'text-red-600',
      content: [
        { label: 'Primary Pests', value: crop.commonPests.join(', ') },
        { label: 'Common Diseases', value: 'Blight, Powdery Mildew, Root Rot' },
        { label: 'Prevention', value: 'Ensure proper spacing and crop rotation.' }
      ]
    },
    {
      title: 'Nutritional Needs',
      icon: 'fa-flask',
      color: 'text-amber-600',
      content: [
        { label: 'Nitrogen (N)', value: 'High during vegetative phase' },
        { label: 'Phosphorus (P)', value: 'Critical for root development' },
        { label: 'Potassium (K)', value: 'Essential for fruit/grain quality' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <Link to="/calendar" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 transition-colors font-medium">
        <i className="fas fa-arrow-left"></i> Back to Calendar
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-900 p-12 text-white relative">
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Crop Profile</span>
            <h2 className="text-5xl font-black mt-4">{crop.name}</h2>
            <p className="text-green-100/80 mt-4 max-w-xl text-lg leading-relaxed">{crop.description}</p>
          </div>
          <i className="fas fa-leaf absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-12"></i>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${section.color}`}>
                  <i className={`fas ${section.icon} text-lg`}></i>
                </div>
                <h3 className="font-bold text-slate-800">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.content.map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-slate-400 block mb-0.5">{item.label}</span>
                    <span className="font-semibold text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-8 border-t border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-clipboard-list text-green-600"></i> Expert Agronomy Notes
          </h3>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-inner italic text-slate-600 leading-relaxed">
            "{crop.notes} For optimal results with {crop.name.toLowerCase()}, we recommend performing a soil test at the beginning of the season to calibrate your fertilizer applications. Our AI Soil Analysis tool can help you interpret those results if you enter the values."
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link to="/detect" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-900/10 transition-all flex items-center gap-2">
          <i className="fas fa-camera"></i> Scan for Disease
        </Link>
        <Link to="/soil" className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
          <i className="fas fa-vial"></i> Analyze Soil
        </Link>
      </div>
    </div>
  );
};

export default CropDetail;
