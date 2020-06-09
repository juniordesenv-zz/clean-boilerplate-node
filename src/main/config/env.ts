import path from 'path';

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.port || 5050,
  jwtSecret: process.env.JWT_SECRET || 'ttzzw9kk-0##!!2',
  templates: process.env.TEMPLATE_MAIL || path.join(__dirname, 'src/presentation/templates'),
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
};
