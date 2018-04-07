import { JSDOM } from 'jsdom';
import request from 'request';

import logger from './log';

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=9cdcf772a9fafd78728fe6daaa0c3d53&lat=60&lon=22&units=metric';

const fetchPompierWeather = async (url = weatherUrl) => new Promise((resolve) => {
  request(
    url,
    (error, { statusCode }, html) => {
      if (!error && statusCode === 200) {
        return resolve(html);
      }
      const errorMsg = `Failed fetching Pompier weather: ${statusCode}`;
      logger.error(errorMsg);
      return resolve(errorMsg);
    },
  );
});

(async () => {
  logger.info('Fetching Pompier weather for today...');
  const text = await fetchPompierWeather();
  const json = JSON.parse(text)

  const description = json.weather[0].description;
  const temperature = json.main.temp;

  let message;

  if (temperature > -15 && temperature <= 0) {
    message = "Takkia päälle, kylmä!"
  } else if (temperature < -15) {
    message = "Älä poistu kotoa ollenkaan.."
  } else if (temperature > 0 && temperature < 15) {
    message = "Kevättä tulossa, pikkutakki on OK!"
  } else if (temperature > 15) {
    message = "Bikiniiit!"
  }

  // https://hooks.slack.com/services/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


  logger.info(temperature)
  logger.info(`Hi, today is ${description}. ${message}`)
  request({
    uri: 'https://hooks.slack.com/services/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',
  method: 'POST',
json: {text:message},
}, () => logger.info('Posted menu to slack!'));
})();