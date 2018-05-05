#!/usr/bin/env node

const path = require('path');
const http = require('http')

class Command {

    constructor() {
        this.options = {
            baseDir: process.cwd(),
            framework: undefined,
        };
        this.options.framework = path.join(this.options.baseDir, 'node_modules', 'egg');
    }

    start() {
        const options = this.options;
        const Egg = require(options.framework);
        http.createServer(new Egg(options).callback()).listen(7001, () => {
            console.log('please open http://127.0.0.1:7001');
        })
    }
}


new Command().start();