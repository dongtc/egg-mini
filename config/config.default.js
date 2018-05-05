
module.exports = (appInfo) => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1522917011993_9362';

  // add your config here
  config.middleware = ['robot'];
  config.robot = {
    ua: [
      /Baiduspider/i
    ]
  };
  return config;
};