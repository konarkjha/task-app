module.exports = {
  apps: [
    {
      name: "task-app",
      script: "./build/index.js",
      watch: true,
      env: {
        NODE_ENV: "master"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    staging: {
      user: "ubuntu",
      host: "",
      key: "",
      ref: "origin/master",
      repo: "git+https://github.com/konarkjha/task-api.git",
      path: "/home/ubuntu/task-api",
      "post-deploy": "yarn install --check-files && yarn run start-master"
    },
    production: {
      user: "ubuntu",
      host: "",
      key: "",
      ref: "origin/master",
      repo: "git+https://github.com/konarkjha/task-api.git",
      path: "/home/ubuntu/task-api",
      "post-deploy": "yarn install --check-files && yarn run start"
    }
  }
};
