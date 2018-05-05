module.exports = app => {
    console.log('load app.js');
    app.cache = new Map();
    app.cache.set('1',1);
}