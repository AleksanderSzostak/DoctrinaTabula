# ---------- Build Stage ----------
    FROM node:18 AS builder

    WORKDIR /app
    
    # Copy root files
    COPY package*.json ./
    RUN npm install
    
    # Copy frontend + backend
    COPY . .
    
    # Build frontend
    RUN npm run build
    
    # ---------- Production Stage ----------
    FROM node:18
    
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy backend
    COPY backend ./backend
    
    # Copy built frontend from builder
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 8080
    
    ENV NODE_ENV=production
    ENV JWT_SECRET=0259ffd6f26cad85abc091d3109db9f1f8d010701b083a498dae3143f2ff3e6a919d6a261d9488623e5dfc9c90f493ec1477bb7b5edc80cd356665f2997f0c18
    
    CMD ["node", "backend/index.js"]