# InternovaTech LOR Generator

Dedicated Letter of Recommendation generator and verification website for InternovaTech.

## Features

- Secure admin login with hashed passwords
- Admin dashboard with LOR statistics
- LOR generation form with unique LOR IDs
- Professional Puppeteer-generated PDF
- QR code verification for `/verify-lor/:lorId`
- Cloudinary PDF upload and storage
- Public verification page for active, revoked, and invalid records
- Revoke and delete workflows
- Render-friendly Express deployment

## Local Setup

```powershell
cd C:\Users\pkper\OneDrive\Desktop\LOR
npm install
copy .env.example .env
```

Fill `.env`, then create the first admin:

```powershell
npm run seed:admin
npm run dev
```

Open `http://localhost:5000`.

## Environment Variables

```env
PORT=5000
MONGO_URL=
SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BASE_URL=
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

For local development, set `BASE_URL=http://localhost:5000`.
For Render, set `BASE_URL` to your Render web service URL, for example `https://your-app.onrender.com`.

## Render Deployment

1. Push this project to GitHub.
2. Create a new Render Web Service.
3. Choose the repository and branch.
4. Set Runtime to Node.
5. Use build command:
   ```bash
   npm install
   ```
6. Use start command:
   ```bash
   npm start
   ```
7. Add all required environment variables in Render.
8. Deploy the service.
9. Run the admin seed command from a Render shell or locally against the production MongoDB:
   ```bash
   npm run seed:admin
   ```

## Testing Checklist

- Admin login works
- Dashboard opens
- Generate LOR form works
- LOR ID is generated
- PDF is generated
- PDF uploads to Cloudinary
- PDF opens from Cloudinary URL
- QR code opens the public verification URL
- Public verification works for active LORs
- Revoke changes status to revoked
- Revoked LOR shows warning on verification page
- Delete removes database record and Cloudinary PDF
- Mobile layouts remain usable
- Render deployment boots with `npm start`

## Notes

- PDF files are uploaded to Cloudinary as `raw` assets under `internovatech/lor`.
- Static images used in PDFs are read from `public/images` and embedded as base64 data URLs, so no local machine paths are required.
- Puppeteer launches with `--no-sandbox`, `--disable-setuid-sandbox`, and `--disable-dev-shm-usage` for Render/Linux compatibility.
- `PUPPETEER_EXECUTABLE_PATH` is optional. Leave it blank unless your Render environment provides a custom Chrome path.
