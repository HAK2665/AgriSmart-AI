
import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    location: user.location || '',
    interests: user.cropInterests.join(', ')
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const interestsArray = formData.interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i !== "");

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        location: formData.location,
        cropInterests: interestsArray,
        updatedAt: serverTimestamp()
      });

      onUpdate({
        ...user,
        displayName: formData.displayName,
        location: formData.location,
        cropInterests: interestsArray
      });
      
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError("Failed to save profile changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-green-800"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-8 flex items-end gap-6">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=fff&color=059669&size=128`} 
              alt="Avatar" 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-white object-cover"
            />
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-slate-800 break-words">{user.displayName}</h2>
              <p className="text-slate-500 break-all">{user.email}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Region / Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. Punjab, India"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Crop Interests (comma separated)</label>
              <textarea 
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none h-32 resize-none"
                placeholder="Wheat, Rice, Tomato..."
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setFormData({
                  displayName: user.displayName,
                  location: user.location || '',
                  interests: user.cropInterests.join(', ')
                })}
                className="px-6 py-3 text-slate-600 font-bold hover:text-slate-800 transition-colors"
              >
                Discard Changes
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-900/10"
              >
                {saving && <i className="fas fa-circle-notch animate-spin"></i>}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
