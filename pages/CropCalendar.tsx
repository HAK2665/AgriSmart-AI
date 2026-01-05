
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, CropCycle } from '../types';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const SAMPLE_CYCLES: Record<string, CropCycle> = {
  'Wheat': {
    id: 'wheat',
    name: 'Wheat',
    planting: [9, 10],
    growing: [11, 0, 1, 2],
    harvesting: [3, 4],
    notes: 'Requires cool weather during germination.',
    phRange: '6.0 - 7.0',
    tempRange: '10°C - 24°C',
    commonPests: ['Aphids', 'Armyworms', 'Wheat Midges'],
    description: 'Wheat is a grass widely cultivated for its seed, a cereal grain which is a worldwide staple food.'
  },
  'Rice': {
    id: 'rice',
    name: 'Rice',
    planting: [5, 6],
    growing: [7, 8, 9],
    harvesting: [10, 11],
    notes: 'Requires standing water and high humidity.',
    phRange: '5.5 - 6.5',
    tempRange: '20°C - 35°C',
    commonPests: ['Leafhoppers', 'Stem Borers', 'Rice Water Weevil'],
    description: 'Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima.'
  },
  'Tomato': {
    id: 'tomato',
    name: 'Tomato',
    planting: [1, 2, 7, 8],
    growing: [3, 4, 9, 10],
    harvesting: [5, 6, 11, 0],
    notes: 'Well-drained soil and staking required.',
    phRange: '6.0 - 6.8',
    tempRange: '18°C - 27°C',
    commonPests: ['Aphids', 'Whiteflies', 'Hornworms'],
    description: 'The tomato is the edible berry of the plant Solanum lycopersicum, commonly known as the tomato plant.'
  },
  'Corn': {
    id: 'corn',
    name: 'Corn',
    planting: [3, 4],
    growing: [5, 6, 7],
    harvesting: [8, 9],
    notes: 'Heavy feeder, requires nitrogen-rich soil.',
    phRange: '5.8 - 7.0',
    tempRange: '16°C - 30°C',
    commonPests: ['Corn Earworm', 'Cutworms', 'Fall Armyworm'],
    description: 'Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico.'
  },
  'Potato': {
    id: 'potato',
    name: 'Potato',
    planting: [0, 1, 9],
    growing: [2, 3, 10, 11],
    harvesting: [4, 5],
    notes: 'Susceptible to late blight in high humidity.',
    phRange: '4.8 - 6.0',
    tempRange: '15°C - 20°C',
    commonPests: ['Colorado Potato Beetle', 'Aphids', 'Potato Leafhopper'],
    description: 'The potato is a root vegetable, a starchy tuber of the plant Solanum tuberosum.'
  }
};

interface CropCalendarProps {
  user: UserProfile;
}

const CropCalendar: React.FC<CropCalendarProps> = ({ user }) => {
  const currentMonth = new Date().getMonth();

  const userCrops = useMemo(() => {
    const interests = user.cropInterests.length > 0 
      ? user.cropInterests 
      : ['Wheat', 'Rice', 'Tomato'];
    
    return interests
      .map(name => SAMPLE_CYCLES[name] || {
        id: name.toLowerCase(),
        name,
        planting: [3, 4],
        growing: [5, 6, 7],
        harvesting: [8],
        notes: 'Standard growing cycle.',
        phRange: '6.0-7.0',
        tempRange: '15-25°C',
        commonPests: ['Various Insects'],
        description: 'General crop information.'
      });
  }, [user.cropInterests]);

  const getStatusColor = (monthIdx: number, cycle: CropCycle) => {
    if (cycle.planting.includes(monthIdx)) return 'bg-emerald-500';
    if (cycle.growing.includes(monthIdx)) return 'bg-sky-500';
    if (cycle.harvesting.includes(monthIdx)) return 'bg-amber-500';
    return 'bg-slate-100';
  };

  const getStatusLabel = (monthIdx: number, cycle: CropCycle) => {
    if (cycle.planting.includes(monthIdx)) return 'Planting';
    if (cycle.growing.includes(monthIdx)) return 'Growing';
    if (cycle.harvesting.includes(monthIdx)) return 'Harvesting';
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Crop Calendar</h2>
          <p className="text-slate-500 mt-1">Personalized agricultural timeline for {user.location || 'your region'}.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Planting
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <span className="w-3 h-3 rounded-full bg-sky-500"></span> Growing
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Harvest
          </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto overscroll-x-contain">
        {/* Calendar Header Months */}
        <div className="grid grid-cols-[180px_1fr] min-w-[900px] border-b border-slate-100 bg-slate-50">
          <div className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider border-r border-slate-100">Crop Info</div>
          <div className="grid grid-cols-12 whitespace-nowrap">
            {MONTHS.map((month, i) => (
              <div 
                key={month} 
                className={`p-4 text-center text-xs font-bold ${i === currentMonth ? 'text-green-600 bg-green-50' : 'text-slate-400'}`}
              >
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Rows */}
        <div className="divide-y divide-slate-100">
          {userCrops.map((crop) => (
            <div key={crop.name} className="grid grid-cols-[180px_1fr] min-w-[900px] group relative">
              <div className="p-4 border-r border-slate-100 flex flex-col justify-center gap-2 relative group/name">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{crop.name}</span>
                  <Link 
                    to={`/crop/${crop.id}`}
                    className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors font-bold uppercase"
                  >
                    View
                  </Link>
                </div>
                <span className="text-[10px] text-slate-400 truncate cursor-help" title={crop.notes}>
                  <i className="fas fa-info-circle mr-1"></i> {crop.notes}
                </span>

                {/* Extended Tooltip on Crop Name Hover */}
                <div className="absolute left-full top-0 ml-2 z-50 w-64 p-4 bg-slate-800 text-white rounded-2xl shadow-2xl pointer-events-auto opacity-0 group-hover/name:opacity-100 transition-all transform group-hover/name:translate-x-0 -translate-x-2">
                  <h4 className="font-bold text-green-400 mb-2 border-b border-slate-700 pb-1">{crop.name} Requirements</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Optimal pH:</span>
                      <span className="font-semibold">{crop.phRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temp Range:</span>
                      <span className="font-semibold">{crop.tempRange}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-400 block mb-1">Common Pests:</span>
                      <div className="flex flex-wrap gap-1">
                        {crop.commonPests.map(pest => (
                          <span key={pest} className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">{pest}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[9px] text-slate-400 italic">
                    Click "View" for in-depth agronomy data
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-12 relative">
                {MONTHS.map((_, i) => (
                  <div key={i} className="relative group/cell h-16 flex items-center justify-center p-1 border-r border-slate-50 last:border-0">
                    <div 
                      className={`w-full h-8 rounded-md transition-all duration-300 ${getStatusColor(i, crop)} ${
                        i === currentMonth ? 'ring-2 ring-offset-2 ring-green-400' : ''
                      }`}
                    >
                      {/* Tooltip for timeline cells */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover/cell:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-lg">
                        {getStatusLabel(i, crop) || 'Dormant'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <i className="fas fa-seedling"></i> Planting Phase
          </h4>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Focus on soil preparation. Ensure high organic matter content and correct moisture levels before sowing.
          </p>
        </div>
        <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
          <h4 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
            <i className="fas fa-tint"></i> Growth Monitoring
          </h4>
          <p className="text-sm text-sky-700 leading-relaxed">
            Peak irrigation season. Use our "Disease Detection" tool weekly during this phase to catch blights early.
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <i className="fas fa-wheat-awn"></i> Harvest Ready
          </h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            Monitor humidity closely. Early harvest might be necessary if unseasonal rains are predicted in your region.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;
