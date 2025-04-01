export const SessionManager = {
    async set(req, key, value) {
        req.session[key] = value;
        return this.save(req);
    },

    async save(req) {
        return new Promise((resolve, reject) => {
            req.session.save(err => {
                if (err) {
                    console.error("Error al guardar la sesión:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    },

    get(req, key) {
        return req.session[key] || null;
    },

    clear(req, key) {
        delete req.session[key];
        return this.save(req);
    },

    async clearAll(req) {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    console.error("Error al limpiar la sesión:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    }
};
