import { useState, useRef, useEffect } from 'react';
import './App.css';
import { auth, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Sample template data
const templates = [
  {
    id: 1,
    category: 'Birthday',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    isPremium: false
  },
  {
    id: 2,
    category: 'Love',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
    isPremium: false
  },
  {
    id: 3,
    category: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    isPremium: true
  },
  {
    id: 4,
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    isPremium: true
  },
  {
    id: 5,
    category: 'Friendship',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    isPremium: false
  },
  {
    id: 6,
    category: 'Congratulations',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    isPremium: true
  }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [authMode, setAuthMode] = useState('email'); // 'email' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const canvasRef = useRef(null);

  const categories = ['All', 'Birthday', 'Love', 'Anniversary', 'Festival', 'Friendship', 'Congratulations'];

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserName(user.displayName || user.email?.split('@')[0] || 'User');
        setUserEmail(user.email || '');
        setUserPhoto(user.photoURL);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      // Firebase auth state listener will handle the rest
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (userPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    const result = await signUpWithEmail(userEmail, userPassword, userName);
    
    if (result.success) {
      // Firebase auth state listener will handle the rest
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signInWithEmail(userEmail, userPassword);
    
    if (result.success) {
      // Firebase auth state listener will handle the rest
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Handle Guest login
  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    
    const result = await signInAsGuest();
    
    if (result.success) {
      // Firebase auth state listener will handle the rest
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setUserName('');
    setUserEmail('');
    setUserPhoto(null);
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle template click
  const handleTemplateClick = (template) => {
    if (template.isPremium) {
      setShowPremiumPopup(true);
    } else {
      setSelectedTemplate(template);
    }
  };

  // Generate and share image
  const handleShare = async () => {
    if (!selectedTemplate) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Load and draw background image
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    
    bgImage.onload = () => {
      // Draw background
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      // Draw dark overlay for name
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, 100);

      // Draw user photo (circular)
      if (userPhoto) {
        const photoSize = 120;
        const photoX = 50;
        const photoY = 40;

        ctx.save();
        ctx.beginPath();
        ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const photo = new Image();
        photo.src = userPhoto;
        photo.onload = () => {
          ctx.drawImage(photo, photoX, photoY, photoSize, photoSize);
          ctx.restore();

          // Draw border around photo
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Draw user name
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px Arial';
          ctx.fillText(userName, 200, 90);

          // Convert to blob and share
          canvas.toBlob((blob) => {
            const file = new File([blob], 'greeting.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
              navigator.share({
                files: [file],
                title: 'My Greeting Card',
                text: 'Check out my personalized greeting!'
              }).catch(err => console.log('Share failed:', err));
            } else {
              // Fallback: download the image
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'greeting.png';
              a.click();
              URL.revokeObjectURL(url);
            }
          });
        };
      } else {
        // Draw user name only
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(userName, 200, 90);

        // Convert to blob and share
        canvas.toBlob((blob) => {
          const file = new File([blob], 'greeting.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'My Greeting Card',
              text: 'Check out my personalized greeting!'
            }).catch(err => console.log('Share failed:', err));
          } else {
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'greeting.png';
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    bgImage.src = selectedTemplate.image;
  };

  // Filter templates
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>🎉 Greetings App</h1>
          <p>Create personalized greeting cards</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Email Sign In Form */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSignIn}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="auth-switch">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="link-button" 
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* Email Sign Up Form */}
          {authMode === 'signup' && (
            <form onSubmit={handleEmailSignUp}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="auth-switch">
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="link-button" 
                  onClick={() => { setAuthMode('email'); setError(''); }}
                  disabled={loading}
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          <div className="login-divider">or continue with</div>
          
          <div className="auth-buttons">
            <button 
              className="btn-google" 
              onClick={handleGoogleLogin} 
              type="button"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              {loading ? 'Loading...' : 'Continue with Google'}
            </button>
            
            <button 
              className="btn-guest" 
              onClick={handleGuestLogin} 
              type="button"
              disabled={loading}
            >
              <span className="icon">👤</span>
              {loading ? 'Loading...' : 'Continue as Guest'}
            </button>
          </div>

          <p className="firebase-note">
            🔒 Secured with Firebase Authentication
          </p>
        </div>
      </div>
    );
  }

  // Main App Screen
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎉 Greetings</h1>
          <div className="user-info">
            {userPhoto && <img src={userPhoto} alt={userName} className="user-avatar" />}
            <span>{userName}</span>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </header>

      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="templates-section">
        <h2>🔥 {selectedCategory === 'All' ? 'All Templates' : selectedCategory}</h2>
        
        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleTemplateClick(template)}
            >
              <div className="template-image-wrapper">
                <img src={template.image} alt={template.category} />
                
                {template.isPremium && (
                  <div className="premium-badge">
                    <span>👑 Premium</span>
                  </div>
                )}
              </div>
              
              <div className="template-info">
                <h3>{template.category}</h3>
                <button className="btn-share" onClick={(e) => {
                  e.stopPropagation();
                  if (template.isPremium) {
                    setShowPremiumPopup(true);
                  } else {
                    setSelectedTemplate(template);
                    setTimeout(handleShare, 100);
                  }
                }}>
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Popup */}
      {showPremiumPopup && (
        <div className="popup-overlay" onClick={() => setShowPremiumPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPremiumPopup(false)}>×</button>
            <div className="popup-icon">👑</div>
            <h2>Unlock Premium Templates</h2>
            <p>Get access to exclusive premium greeting templates</p>
            
            <div className="pricing">
              <div className="price-tag">
                <span className="currency">$</span>
                <span className="amount">4.99</span>
                <span className="period">/month</span>
              </div>
            </div>

            <ul className="features">
              <li>✓ Unlimited premium templates</li>
              <li>✓ No watermarks</li>
              <li>✓ HD quality downloads</li>
              <li>✓ Early access to new templates</li>
            </ul>

            <button className="btn-subscribe">Subscribe Now</button>
            <button className="btn-cancel" onClick={() => setShowPremiumPopup(false)}>
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
