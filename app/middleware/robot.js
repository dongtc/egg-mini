module.exports = (options, app) => {
    return async function robotMiddleware(ctx, next) {
        console.log('this is robot middleware');
        await next();
    }
}

