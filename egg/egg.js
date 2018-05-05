
const Koa = require('koa');
const Router = require('koa-router');
const EggLoder = require('./egg_loader');

class Egg extends Koa {
    constructor(options = {}) {
        super();
        this.service = {};
        this.controller = {};
        this.loader = new EggLoder({
            baseDir: options.baseDir,
            app: this,
        })
        this.loader.loadConfig();
        this.loader.load();
    }
    get router() {
        const router = new Router();
        this.use(router.routes());
        return router;
    }
    get config() {
        return this.loader.config;
    }
}

module.exports = Egg;


