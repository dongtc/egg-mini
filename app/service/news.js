
class Service{
    constructor(ctx) {
       this.ctx = ctx;
       this.app = ctx.app;
       this.config = ctx.app.config;
       this.service = ctx.service; 
    }
}


class NewsService extends Service{
    async list() {
        return 'hello world';
    }
}

module.exports = NewsService;


