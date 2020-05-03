const axios = require('axios');
const qs = require('querystring');

const LINE_NOTIFY_API_URL = 'https://notify-api.line.me/api/notify';

const LINE_NOTIFY_TOKEN = process.env.LINE_TOKEN;

let config = {
    url: LINE_NOTIFY_API_URL,
    method: 'post',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + LINE_NOTIFY_TOKEN
    },
    data: qs.stringify({
        message: 'ProtoOut Studioからの通知だよー！',
    })
}

async function getRequest() {

  ////// 天気情報APIを最初につなげる //////////////////

  let responseWeather;

  try {
    responseWeather = await axios.get(`http://weather.livedoor.com/forecast/webservice/json/v1?city=130010`);
    // console.log(responseWeather.data);
  } catch (error) {
    console.error(error);
  }
  // メッセージ構成
  // 文字列を+=で連結していく。
  // ダブルクオーテーションで囲むと "\n" で改行も加えられる特性がある。
  let messageText = "\n";
  messageText += 'Livedoor 天気情報 API から取得しました！' + "\n";
  messageText += "\n";
  messageText += '東京都の天気です。' + "\n";
  messageText += '----------' + "\n";
  messageText += responseWeather.data.description.text;
  // config のメッセージを送る部分 config.data を上書き
  config.data =  qs.stringify({
    message: messageText,
  });

  ////// LINE Notify に送る ////////////////////////

  try {
    const responseLINENotify = await axios.request(config);
    console.log(responseLINENotify.data);
  } catch (error) {
    console.error(error);
  }

}

// getRequest を呼び出してデータを読み込む
getRequest();