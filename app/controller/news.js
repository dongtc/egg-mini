class Service {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config;
    this.service = ctx.service;
  }
}

class NewsController extends Service {
  async list() {
    const service = this.service;
    this.ctx.body = await service.news.list();
  }
}


module.exports = NewsController;