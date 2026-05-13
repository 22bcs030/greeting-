# 🎉 Custom Greetings & Wishes App

A simple and professional web application that enables users to create personalized greeting cards with their profile picture and name overlaid on beautiful templates.

## 📋 Features

### ✅ Implemented Features

1. **User Authentication**
   - Simple login with name and profile photo
   - Guest login option
   - Google login placeholder (UI only)

2. **Home Page**
   - Categorized templates (Birthday, Love, Anniversary, Festival, Friendship, Congratulations)
   - Grid view of greeting card templates
   - Live preview with user's name and photo overlay
   - Category filtering

3. **Personalization & Sharing**
   - Automatic overlay of user profile picture and name on templates
   - Share button to generate final image
   - Native share functionality (WhatsApp, Instagram, Email, etc.)
   - Fallback download option for browsers without share API

4. **Premium Features**
   - Clear distinction between Free and Premium templates
   - Premium badge on locked templates
   - Subscription popup for premium content
   - Professional pricing UI

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd greetings-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 (Custom styles, no external UI library)
- **Image Processing**: HTML5 Canvas API
- **Sharing**: Web Share API with fallback

## 📱 App Flow

1. **Login Screen**
   - User enters name
   - Optionally uploads profile photo
   - Can login with Google (placeholder) or as Guest

2. **Home Screen**
   - Browse templates by category
   - See live preview with user's name and photo
   - Click on template to view or share

3. **Premium Popup**
   - Triggered when clicking premium templates
   - Shows subscription pricing and features
   - User can subscribe or dismiss

4. **Share Functionality**
   - Generates final image with Canvas API
   - Overlays user photo (circular) and name
   - Uses native share sheet or downloads image

## 🎨 Design Decisions

### Simple & Clean UI
- Minimal design inspired by modern mobile apps
- Professional gradient color scheme (purple/blue)
- Card-based layout for templates
- Responsive design for mobile and desktop

### Image Overlay Logic
- Uses HTML5 Canvas API for image composition
- Draws background template first
- Adds dark overlay bar at top for better text visibility
- Draws circular user photo with green border
- Renders user name in white text
- Exports as PNG blob for sharing

### Performance Optimizations
- Uses Unsplash images for demo templates (replace with your own)
- Lazy loading of images
- Efficient Canvas rendering
- Minimal dependencies

## 🔧 Technical Implementation

### Image Overlay Process

```javascript
1. Create canvas element (800x1000px)
2. Load background template image
3. Draw background on canvas
4. Draw dark overlay rectangle (0, 0, 800, 100)
5. Draw user photo as circular image (clipped)
6. Draw green border around photo
7. Draw user name in white text
8. Convert canvas to blob
9. Share via Web Share API or download
```

### File Structure

```
greetings-app/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## 🚧 Challenges & Solutions

### Challenge 1: Image Overlay with Canvas
**Problem**: Needed to overlay user photo and name on template images dynamically.

**Solution**: Used HTML5 Canvas API to composite images. Created a hidden canvas element, drew the background image, then overlaid the user photo (clipped to circle) and text. This approach works entirely in the browser without backend processing.

### Challenge 2: Cross-Origin Image Issues
**Problem**: Canvas gets tainted when loading external images, preventing export.

**Solution**: Set `crossOrigin = 'anonymous'` on image elements and used CORS-enabled image sources (Unsplash).

### Challenge 3: Mobile Sharing
**Problem**: Different sharing mechanisms on mobile vs desktop.

**Solution**: Implemented Web Share API with feature detection and fallback to download for unsupported browsers.

### Challenge 4: Live Preview Performance
**Problem**: Rendering overlays on all templates could be slow.

**Solution**: Used CSS overlays for preview (lightweight) and Canvas only for final image generation.

## 🔮 Future Improvements

### Short Term
1. **Backend Integration**
   - User authentication with JWT
   - Save user preferences and favorites
   - Store generated cards in user gallery

2. **More Templates**
   - Add 50+ professional templates
   - Custom template upload by users
   - Template categories expansion

3. **Enhanced Editing**
   - Text customization (font, size, color, position)
   - Multiple text layers
   - Stickers and decorations
   - Filters and effects

### Long Term
1. **Payment Integration**
   - Stripe/PayPal for subscriptions
   - One-time purchases for template packs
   - Referral rewards system

2. **Social Features**
   - Share templates with friends
   - Template marketplace
   - User-generated content

3. **Mobile Apps**
   - React Native iOS/Android apps
   - Offline mode
   - Push notifications for special occasions

4. **AI Features**
   - AI-generated personalized messages
   - Smart occasion detection
   - Auto-suggest templates based on user history

5. **Scalability**
   - CDN for template images
   - Redis caching for user sessions
   - Microservices architecture
   - Load balancing for high traffic

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Created as an internship assignment demonstrating:
- React component architecture
- Canvas API for image manipulation
- Responsive design
- Modern web APIs (Share API)
- Clean, maintainable code

---

**Note**: This is a demo application. Replace Unsplash URLs with your own template images for production use.
