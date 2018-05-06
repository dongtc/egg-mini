const Controller = require('egg').Controller;

class NewsService extends Controller{
    async list() {
        return 'hello world';
    }
}

module.exports = NewsService;


