import path from 'path';

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.port || 5050,
  jwtSecret: process.env.JWT_SECRET || 'ttzzw9kk-0##!!2',
  templatesDir: process.env.TEMPLATE_DIR || path.join(__dirname, '../../presentation/templates'),
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpHost: process.env.SMTP_HOST,
  smtpSecure: Boolean(process.env.EMAIL_SMTP_SECURE),
  baseUrlFront: process.env.BASE_URL_FRONT,
};
