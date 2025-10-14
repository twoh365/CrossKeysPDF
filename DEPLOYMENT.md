# Free PDF Email Setup with Netlify + Outlook

## Overview
This setup uses Netlify Functions (free) + Outlook SMTP (free) to send PDF invoices with attachments at no cost.

## Step 1: Outlook Setup (Free)

1. **Create Outlook Account** (if you don't have one):
   - Go to [outlook.com](https://outlook.com) and sign up
2. **Use Regular Password**:
   - Outlook allows regular password authentication for SMTP
   - No need for app passwords in most cases
   - **Note**: If you have 2FA enabled, you may need an app password

## Step 2: Deploy to Netlify (Free)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/CrossKeysPDF.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git"
   - Connect your GitHub repo
   - Deploy settings: (leave defaults, Netlify auto-detects)

3. **Set Environment Variables**:
   In Netlify dashboard → Site Settings → Environment Variables:
   ```
   EMAIL_SERVICE = outlook
   EMAIL_USER = your-email@outlook.com
   EMAIL_PASSWORD = your-outlook-password
   ```

## Step 3: Test Your Setup

1. Open your deployed site (Netlify gives you a URL like `https://amazing-site-123.netlify.app`)
2. Fill out an invoice form
3. Enter a test email address
4. Click "Email Invoice"
5. Check that the email arrives with PDF attachment

## How It Works

- **Frontend**: Your HTML files generate PDFs and send to Netlify Function
- **Backend**: Netlify Function receives PDF, uses Outlook SMTP to send email
- **Cost**: 100% Free (Netlify: 125k function calls/month, Outlook: unlimited)

## Troubleshooting

### Email not sending?
- Check environment variables are set correctly in Netlify
- Verify your Outlook password is correct
- If you have 2FA enabled on Outlook, you may need an app password
- Check Netlify Function logs in dashboard

### "Function not found" error?
- Make sure `netlify.toml` is in your repo root
- Verify the function file is at `netlify/functions/send-invoice.js`
- Redeploy the site

## File Structure
```
CrossKeysPDF/
├── netlify/
│   └── functions/
│       └── send-invoice.js     # Email backend
├── netlify.toml                # Netlify config
├── package.json                # Dependencies
├── crosskeys.html              # Crosskeys invoice generator
├── armadillo.html              # Armadillo invoice generator
└── index.html                  # Property selection page
```

## Benefits of This Setup

✅ **Completely Free** - No monthly costs
✅ **Unlimited Emails** - No per-email charges  
✅ **PDF Attachments** - Full file attachment support
✅ **Professional** - Emails come from your Outlook address
✅ **Reliable** - Outlook SMTP is very reliable
✅ **No API Keys** - Just environment variables