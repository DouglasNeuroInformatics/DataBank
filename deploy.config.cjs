module.exports = {
  apps: [
    {
      name: 'api',
      script: 'yarn',
      args: 'workspace @databank/server start',
      port: process.env.SERVER_PORT,
      env: Object.assign(process.env, {
        NODE_ENV: 'production'
      })
    }
  ]
};
