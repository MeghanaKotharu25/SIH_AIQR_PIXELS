# Railway Track Fitting Maintenance System

A cross-platform React web application for Indian Railways track-fitting identification and maintenance, with AI-powered QR code reconstruction.

## Project Structure

```
sih/
├── backend/                    # Flask backend with U-Net AI model
│   ├── app.py                 # Main Flask application
│   └── requirements.txt       # Python dependencies
├── railway-track-app/         # React frontend
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/            # Application pages
│       ├── utils/            # API utilities
│       └── data/             # Mock TMS/UDM datasets
├── qr_healer_model.h5        # Trained U-Net model
├── qrcodes/                  # QR code training data
├── train.py                  # Model training script
├── test_model.py             # Model testing script
└── generate_data.py          # QR dataset generator
```

## Features

### Core Functionality
- **QR Code Scanning**: Upload or capture QR codes from track fittings
- **AI Reconstruction**: U-Net model restores partially damaged QR codes (up to ~30% damage)
- **Digital Traceability**: View complete fitting information from UDM/TMS databases
- **Role-Based Access**: Worker, Supervisor, PWI, Station Master, Admin roles
- **Fault Reporting**: Guided fault reporting workflow
- **Dashboard & Analytics**: Real-time stats and alerts
- **Offline Support**: (To be implemented - currently requires network)

### User Roles
1. **Worker** - Scan QR, view fitting info, report faults
2. **Supervisor/PWI** - Verify reports, view section dashboards
3. **Station Master** - View alerts, approve actions
4. **Admin** - Full access, analytics, audit logs

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- pip

### Backend Setup (Flask + AI Model)

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup (React)

1. Navigate to React app:
```bash
cd railway-track-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### 1. Login
- Select language (English/हिंदी)
- Choose your role
- Enter any username/password (demo mode)

### 2. Scan QR Code
- Click "Scan QR" in navigation
- Upload a QR code image (or use camera on mobile)
- If damaged, AI will automatically reconstruct it
- View fitting information immediately

### 3. Test with Existing QR Codes
You can test with the QR codes in `qrcodes/damaged/` folder:
```bash
# The damaged QR codes will trigger AI reconstruction
# Clean codes in qrcodes/clean/ will scan directly
```

### 4. View Dashboard
- See overall stats: total fittings, open faults, critical alerts
- View charts and recent alerts
- Quick access to common actions

### 5. Manual Lookup
If QR scanning fails, enter Fitting ID manually:
- Format: `FIT-2024-001`
- Available test IDs: FIT-2024-001 through FIT-2024-015

## Mock Data

### UDM Dataset (`src/data/udm_data.csv`)
Contains fitting master data:
- Fitting ID, type, material
- Vendor information
- Batch ID, manufacture date
- Warranty details
- Current status

### TMS Dataset (`src/data/tms_data.csv`)
Contains inspection/maintenance records:
- Inspection history
- Fault reports
- Inspector details
- Location (section, KM)
- Severity and status

## AI Model Details

### U-Net QR Reconstruction
- **Model**: `qr_healer_model.h5`
- **Architecture**: Convolutional Autoencoder
- **Input Size**: 128x128 grayscale images
- **Purpose**: Restore damaged/worn QR codes
- **Training Data**: 1000 QR code pairs (clean/damaged)

### How It Works
1. QR image uploaded → Sent to Flask backend
2. Attempt direct decode with pyzbar
3. If fails → Preprocess image → U-Net reconstruction
4. Decode healed image → Return data + confidence score

### Retrain Model (Optional)
```bash
# Generate new training data
python generate_data.py

# Train model
python train.py

# Test model
python test_model.py
```

## API Endpoints

### Backend (Flask)
- `GET /api/health` - Health check
- `POST /api/scan-qr` - Scan QR code (with AI reconstruction)
- `GET /api/fitting/<id>` - Get fitting details

### Frontend API (Mock)
All in `src/utils/api.js`:
- `scanQRCode()` - Send image to backend
- `getFittingDetails()` - Fetch from UDM/TMS
- `getDashboardStats()` - Calculate stats
- `submitFaultReport()` - Submit fault
- `getAlerts()` - Get alerts by role
- `login()` - Mock authentication

## Tech Stack

### Frontend
- React 18
- React Router (routing)
- Recharts (charts)
- CSS Variables (theming)

### Backend
- Flask (Python web framework)
- TensorFlow/Keras (AI model)
- OpenCV (image processing)
- pyzbar (QR decoding)

## Design Principles

- **Industrial Theme**: Dark control-room aesthetic
- **Mobile-First**: Optimized for field workers
- **Large Typography**: Accessible in outdoor conditions
- **Minimal Text**: Icon-heavy, language-agnostic where possible
- **Offline-Ready**: (Future: Service workers + IndexedDB)

## Development Notes

### Adding New Features
1. Add route in `App.js`
2. Create page component in `src/pages/`
3. Add navigation link in `Navigation.js` (with role check)
4. Update API mocks in `src/utils/api.js`

### Role-Based UI
Check user role before rendering:
```javascript
{user?.role === 'admin' && <AdminOnlyComponent />}
```

### Extending Mock Data
Edit CSV files in `src/data/`:
- Keep headers consistent
- Follow date format: YYYY-MM-DD
- Use status: Active, Attention, Critical

## Production Considerations

1. **Replace Mock Auth**: Implement actual JWT with backend
2. **Real Database**: Connect to actual UDM/TMS systems
3. **File Upload**: Add proper file size limits and validation
4. **Offline Mode**: Implement service workers + IndexedDB
5. **Security**: Add HTTPS, CSP headers, input sanitization
6. **Performance**: Lazy load pages, optimize images
7. **Monitoring**: Add error tracking (Sentry), analytics

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Verify model file exists: `ls ../qr_healer_model.h5`
- Check port 5000 is free: `lsof -i :5000`

### Frontend shows CORS errors
- Ensure Flask backend is running
- Check `flask-cors` is installed
- Verify API_BASE_URL in `src/utils/api.js`

### QR scanning fails
- Check image format (PNG, JPG supported)
- Ensure file size < 5MB
- Try with test images from `qrcodes/` folder
- Check browser console for errors

### CSV data not loading
- Files must use `.csv` extension
- Check CSV format (comma-separated, no extra quotes)
- Webpack should copy CSV files to build (configure if needed)

## Future Enhancements

- [ ] Real-time camera QR scanning (react-qr-reader)
- [ ] Voice notes for fault reports
- [ ] Map view with track section visualization
- [ ] Push notifications for critical alerts
- [ ] Bulk QR generation tool
- [ ] Mobile native app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Predictive maintenance ML module

## License

Internal use - Indian Railways SIH Project

## Contact

For issues or questions, contact the development team.
