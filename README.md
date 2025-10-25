# work-freedom-frontend
## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser

### Installation

1. **Install dependencies**
```bash
npm install
```
additionally install aws cli and run
```bash
aws configure
```
2. **Set up environment variables**
```bash
create .env.local

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
Also check src/config/constants and make edits

3. **Run the development server**
```bash
npm run dev
```

4. **Deploy server**
```bash
npx sst deploy --stage dev
```