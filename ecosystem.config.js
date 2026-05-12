export const apps = [
    {
        name: "web",
        cwd: "./apps/web",
        script: "node_modules/next/dist/bin/next",
        args: "start",
        env: {
            PORT: 3000,
        },
    },

    {
        name: "core-api",
        cwd: "./apps/core-api",
        script: "./dist/server.js",
        env: {
            PORT: 5000,
            NODE_ENV: "production",
        },
    },

    {
        name: "realtime",
        cwd: "./apps/realtime",
        script: "./dist/server.js",
        env: {
            PORT: 6001,
            NODE_ENV: "production",
        },
    },

    {
        name: "worker",
        cwd: "./apps/worker",
        script: "./dist/server.js",
        env: {
            NODE_ENV: "production",
        },
    },
];