# Noillin Production Deployment Runbook

## Production URL

- App: https://noillin.in
- API health: https://noillin.in/api/health
- Socket.IO: https://noillin.in/socket.io/

## Infrastructure

- Server: AWS EC2 Ubuntu 24.04
- Domain: noillin.in
- DNS: GoDaddy → Elastic IP
- Reverse proxy: Nginx
- SSL: Let's Encrypt Certbot
- Process manager: PM2
- Database: MongoDB Atlas
- Storage: AWS S3
- Cache: Redis
- Queue: RabbitMQ
- Package manager: pnpm

## Services

| Service            |     Port | PM2 Name |
| ------------------ | -------: | -------- |
| Next.js web        |     3000 | web      |
| Core API           |     5000 | core-api |
| Realtime Socket.IO |     6001 | realtime |
| Worker             | internal | worker   |

## Important Server Paths

```bash
/home/ubuntu/apps/noillin
/etc/nginx/sites-available/noillin
/etc/nginx/sites-enabled/noillin
/home/ubuntu/.pm2
/home/ubuntu/backups
```
