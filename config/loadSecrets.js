const fs = require('fs');

module.exports = function loadSecrets() {
    for (const name of ['TOKEN_PASSWORD', 'SECRET_KEY']) {
        const configured = String(process.env[name] || '').trim();
        if (configured && fs.existsSync(configured) && fs.statSync(configured).isFile()) {
            process.env[name] = fs.readFileSync(configured, 'utf8').trim();
        }

        if (process.env.NODE_ENV === 'production' && String(process.env[name] || '').length < 32) {
            throw new Error(`${name} must contain at least 32 characters in production`);
        }
    }
};
