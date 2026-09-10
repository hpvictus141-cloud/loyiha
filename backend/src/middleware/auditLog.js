import prisma from '../config/database.js';

const SENSITIVE_KEYS = ['password', 'newpassword', 'currentpassword', 'token', 'refreshtoken', 'secret'];

const sanitizePayload = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizePayload);

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const auditLog = (module, action) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = async function (data) {
      if (req.user && data.success) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user.id,
              action,
              module,
              details: JSON.stringify({
                method: req.method,
                path: req.path,
                body: sanitizePayload(req.body),
                params: req.params,
                query: req.query
              }),
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('user-agent')
            }
          });
        } catch (error) {
          console.error('Audit log xatosi:', error);
        }
      }

      originalJson.call(this, data);
    };

    next();
  };
};
