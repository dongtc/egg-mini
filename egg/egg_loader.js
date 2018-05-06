const fs = require('fs');
const path = require('path');

class EggLoder {

    constructor(options) {
        this.options = options;
        this.app = options.app; // new Koa 
        this.appInfo = {
            name: 'egg',
            baseDir: this.options.baseDir, 
        }
    }

    loadConfig() {
        //加载配置 
        const filePath = this.resolveModule(path.join(this.options.baseDir, 'config', 'config.default'));
        this.config = this.loadFile(filePath, this.appInfo, undefined);
        console.log('load config', this.config);
    }

    load() {
        this.loadExtend('application', this.app);
        // this.loadExtend('request', this.app.request);
        // this.loadExtend('response', this.app.response);
        // this.loadExtend('context', this.app.context);
        
        this.loadCustomApp();
        this.loadService();
        this.loadMiddleware();
        this.loadController();
        this.loadRouter();
    }
    loadExtend(name, proto) {
        // 加载扩展
        const filePath = this.resolveModule(path.join(this.options.baseDir, `app/extend/${name}`));
        const ext = this.loadFile(filePath);

        const properties = Object.getOwnPropertyNames(ext);

        for (const property of properties) {
            let descriptor = Object.getOwnPropertyDescriptor(ext, property);

            Object.defineProperty(proto, property, descriptor);
        }
    };

    loadCustomApp() {
        // 加载 app.js 
        const filePath = this.resolveModule(path.join(this.options.baseDir, 'app'));
        this.loadFile(filePath, this.app);
        console.log('load customapp');
    }

    loadService() {
        //加载 service
        const target = {};
        const filePath = path.join(this.options.baseDir, 'app/service');
        for (const file of fs.readdirSync(filePath)) {
            // new.js => new
            const properName = file.replace('.js', '');
            target[properName] = require(path.join(filePath, file));
        }
        Object.defineProperty(this.app.context, 'service', {
            get() {
                const ctx = this;
                return new class ClassLoader {
                    constructor() {
                        for (const property in target) {
                            Object.defineProperty(this, property, {
                                get() {
                                    return new target[property](ctx);
                                }
                            })
                        }
                    }
                }
            }
        })
        console.log('load service', target);
    }

    loadMiddleware() {
        //加载 middleware 
        const app = this.app;
        const target = app['middlewares'] = {};
        const filePath = path.join(this.options.baseDir, 'app/middleware');
        for (const file of fs.readdirSync(filePath)) {
            const properName = file.replace('.js', '');
            target[properName] = require(path.join(filePath, file));
        }
        for (const name in target) {
            const options = this.config[name] || {};
            const mw = app.middlewares[name](options, app);
            app.use(mw);
        }
    }

    loadController() {
        //加载 controller
        const target = this.app['controller'] = {};
        const filePath = path.join(this.options.baseDir, 'app/controller');
        for (const file of fs.readdirSync(filePath)) {
            const properName = file.replace('.js', '');
            const controller = require(path.join(filePath, file));
            const proto = controller.prototype;
            const ret = {};
            for (const key of Object.getOwnPropertyNames(proto)) {
                if (key === 'constructor') continue;
                ret[key] = (function methodToMiddleware(Controller, key) {
                    return function (ctx, next) {
                        function wrappedController(...args) {
                            const controller = new Controller(this);
                            controller[key].apply(controller, args);
                        }
                        wrappedController.call(ctx, ctx, next);
                    }
                })(controller, key);
            }
            target[properName] = ret;
        }
        console.log('load controller', target)
    }

    loadRouter() {
        const filePath = this.resolveModule(path.join(this.options.baseDir, 'app/router'));
        this.loadFile(filePath, this.app);
    }

    resolveModule(filePath) {
        return require.resolve(filePath);
    }

    loadFile(filePath, ...inject) {
        return inject.length === 0 ? require(filePath) : require(filePath)(...inject);
    }
}


module.exports = EggLoder;