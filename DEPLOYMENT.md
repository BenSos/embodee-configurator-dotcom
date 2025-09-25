# 🚀 Deployment Guide

This guide will help you deploy the Embodee Product Configurator to a public URL.

## 🌐 **Quick Deployment Options**

### **Option 1: Vercel (Recommended - 2 minutes)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import Repository**: `BenSos/embodee-configurator-dotcom`
5. **Configure**:
   - **Root Directory**: `modern-configurator`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Click "Deploy"**
7. **Your app will be live at**: `https://your-app-name.vercel.app`

### **Option 2: Netlify (Also Great - 3 minutes)**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login with GitHub**
3. **Click "New site from Git"**
4. **Connect GitHub repository**: `BenSos/embodee-configurator-dotcom`
5. **Configure**:
   - **Base directory**: `modern-configurator`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Click "Deploy site"**
7. **Your app will be live at**: `https://your-app-name.netlify.app`

### **Option 3: GitHub Pages (Free - Automatic)**

1. **Go to your repository**: [https://github.com/BenSos/embodee-configurator-dotcom](https://github.com/BenSos/embodee-configurator-dotcom)
2. **Go to Settings → Pages**
3. **Source**: GitHub Actions
4. **The workflow will automatically deploy on every push to main**
5. **Your app will be live at**: `https://bensos.github.io/embodee-configurator-dotcom`

## 🔧 **Manual Deployment (Advanced)**

### **Build the Project Locally**

```bash
cd modern-configurator
npm install
npm run build
```

The built files will be in the `dist/` directory.

### **Deploy to Any Static Host**

Upload the contents of the `dist/` directory to any static hosting service:
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **DigitalOcean App Platform**

## 🌍 **Environment Configuration**

### **Development**
```bash
npm run dev
# Runs on http://localhost:3000
```

### **Production Build**
```bash
npm run build
# Creates optimized build in dist/
```

### **Preview Production Build**
```bash
npm run preview
# Preview the production build locally
```

## 📱 **Testing Your Deployment**

Once deployed, test your app with these URL parameters:

```
https://your-app-url.com?workspaceID=demo-workspace&productID=demo-product&variant=Master
```

## 🔍 **Troubleshooting**

### **Build Errors**
- Check that all dependencies are installed: `npm install`
- Verify Node.js version 18+: `node --version`
- Check for TypeScript errors: `npm run build`

### **Deployment Issues**
- Ensure the build command is: `npm run build`
- Verify output directory is: `dist`
- Check that all files are committed to GitHub

### **Runtime Errors**
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Test with different URL parameters

## 🎯 **Recommended Deployment Flow**

1. **Use Vercel** for the fastest setup
2. **Test with demo parameters** first
3. **Configure custom domain** if needed
4. **Set up automatic deployments** from GitHub

## 📊 **Performance Optimization**

The app is already optimized with:
- **Vite build system** for fast builds
- **Tree shaking** for smaller bundles
- **Code splitting** for faster loading
- **Tailwind CSS** for minimal CSS

## 🔗 **Useful Links**

- **Repository**: [https://github.com/BenSos/embodee-configurator-dotcom](https://github.com/BenSos/embodee-configurator-dotcom)
- **Vercel**: [https://vercel.com](https://vercel.com)
- **Netlify**: [https://netlify.com](https://netlify.com)
- **GitHub Pages**: [https://pages.github.com](https://pages.github.com)

---

**Ready to deploy? Choose Vercel for the fastest setup! 🚀**
