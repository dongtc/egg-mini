const Service = require('egg').Service;

class NewsController extends Service {
  async list() {
    const service = this.service;
    this.ctx.body = await service.news.list();
  }
}


module.exports = NewsController;