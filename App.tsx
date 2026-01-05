
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import SoilAnalysis from './pages/SoilAnalysis';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import CropCalendar from './pages/CropCalendar';
import CropDetail from './pages/CropDetail';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthState, UserProfile } from './types';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, loading: true });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user profile exists in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let profile: UserProfile;

          if (userDoc.exists()) {
            // Use existing profile data
            const data = userDoc.data();
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: data.displayName || firebaseUser.displayName || 'Farmer',
              photoURL: firebaseUser.photoURL || undefined,
              location: data.location || '',
              cropInterests: data.cropInterests || [],
              createdAt: data.createdAt?.toMillis() || Date.now(),
            };
          } else {
            // Create a new profile for first-time login
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Farmer',
              photoURL: firebaseUser.photoURL || undefined,
              location: '',
              cropInterests: [],
              createdAt: Date.now(),
            };
            
            await setDoc(userDocRef, {
              ...profile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }

          setAuthState({ user: profile, loading: false });
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          // Fallback to basic profile if Firestore fails
          setAuthState({ 
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Farmer',
              photoURL: firebaseUser.photoURL || undefined,
              cropInterests: [],
              createdAt: Date.now(),
            }, 
            loading: false 
          });
        }
      } else {
        setAuthState({ user: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setAuthState(prev => ({ ...prev, user: updatedUser }));
  };

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
          <p className="text-green-800 font-semibold animate-pulse">Growing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {authState.user && (
          <Sidebar
            onLogout={handleLogout}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {authState.user && (
            <Navbar user={authState.user} onToggleSidebar={() => setMobileSidebarOpen(v => !v)} />
          )}
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/auth" element={!authState.user ? <AuthPage /> : <Navigate to="/" />} />
              
              <Route path="/" element={authState.user ? <Dashboard user={authState.user} /> : <Navigate to="/auth" />} />
              <Route path="/detect" element={authState.user ? <DiseaseDetection /> : <Navigate to="/auth" />} />
              <Route path="/soil" element={authState.user ? <SoilAnalysis /> : <Navigate to="/auth" />} />
              <Route path="/calendar" element={authState.user ? <CropCalendar user={authState.user} /> : <Navigate to="/auth" />} />
              <Route path="/crop/:cropId" element={authState.user ? <CropDetail /> : <Navigate to="/auth" />} />
              <Route path="/search" element={authState.user ? <SearchPage /> : <Navigate to="/auth" />} />
              <Route path="/profile" element={authState.user ? <Profile user={authState.user} onUpdate={handleProfileUpdate} /> : <Navigate to="/auth" />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
