module.exports = {
  apps: [
    {
      name: 'atelier21-api',
      cwd: '/var/www/atelier21/current',
      script: 'npm',
      args: 'run start:api',
      env: {
        NODE_ENV: 'production',
        PORT: '3010',
      },
    },
  ],
};
