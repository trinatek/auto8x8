# 0. Use matching official Playwright docker image.
FROM mcr.microsoft.com/playwright:v1.39.0-jammy

# Set the working directory to /app
WORKDIR /app

# 2. Install Node.js dependencies.
COPY ./*.json ./
RUN npm install

# 3. Copy the project over.
COPY ./src ./src

# 4. Run main
CMD ["npm", "run", "main"]