module.exports = {
  apps: [
    {
      name: 'backend-app',
      script: 'npm start --prefix ./backend',
      instances: 1,
      autorestart: true,
      watch: false, // Установите true, если хотите включить автоматическое перезапуск при изменениях файлов
      max_memory_restart: '1G',
      env: {},
    },
    {
      name: 'frontend-app',
      script: 'npm run dev --prefix ./frontend/',
      instances: 1,
      autorestart: true,
      watch: false, // Установите true, если хотите включить автоматическое перезапуск при изменениях файлов
      max_memory_restart: '1G',
      env: {}
    },
  ],
};