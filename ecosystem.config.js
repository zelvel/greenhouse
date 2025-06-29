module.exports = {
  apps: [
    {
      name: 'greenhouse-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 5175,
      },
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '256M',
      exp_backoff_restart_delay: 100,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      time: true,
    },
  ],
}; 