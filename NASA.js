// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: star-and-crescent;
/**
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 * 感谢@MuTu88帮忙测试！
 */
const goupdate = true;
const $ = new importModule("Env");
const ERR = MYERR();
const scripts = [
  {
    moduleName: "NASA",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/NASA.js",
  },
];

!(async () => {
  if (checkkey() == true) {
    await getinfo();
    var flag = Math.floor(Math.random() * 10);
    if ($.headers.statusCode == 200) {
      if (flag >= 0 && flag < 2) {
        log(`${flag} 展示备用图片1`);
        cover = $.imglink;
      } else if (flag >= 2 && flag < 4) {
        log(`${flag} 展示备用图片2`);
        cover = $.imglink2;
      } else {
        log(`${flag} 展示NASA图片`);
        cover = $.data.url;
      }
    } else {
      if (flag >= 0 && flag < 5) {
        log(`${flag} 展示备用图片1`);
        cover = $.imglink;
      } else {
        log(`${flag} 展示备用图片2`);
        cover = $.imglink2;
      }
    }
    var img = await new Request(cover).loadImage();
    let widget = createWidget(img);
    Script.setWidget(widget);
    Script.complete();
  }
})()
  .catch((err) => {
    if (err instanceof ERR.TokenError) {
      $.msg("NASA - Config配置错误❌\n" + err.message);
    } else {
      $.msg("NASA - 出现错误❌\n" + JSON.stringify(err));
    }
  })
  .finally(update());

function checkkey() {
  try {
    const { nasaapi, imglink, imglink2 } = importModule("Config");
    $.apikey = nasaapi();
    $.imglink = imglink();
    $.imglink2 = imglink2();
    return true;
  } catch (err) {
    throw new ERR.TokenError("❌ 配置文件中未找到NASA API或备用图片地址");
  }
}

function createWidget(img) {
  const w = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#1c1c1c"), new Color("#29323c")];
  bgColor.locations = [0.0, 1.0];
  w.backgroundGradient = bgColor;
  w.backgroundImage = img;
  w.addSpacer();
  w.spacing = 5;

  const imgLine = w.addImage(img);
  imgLine.imageSize = new Size(400, 400);

  w.addSpacer();
  w.spacing = 5;
  w.presentLarge();
  return w;
}

function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }
  class TimeError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeError";
    }
  }
  class ImageError extends Error {
    constructor(message) {
      super(message);
      this.name = "ImageError";
    }
  }
  return {
    TokenError,
    TimeError,
    ImageError,
  };
}

function getinfo() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${$.apikey}`;
  return new Promise((resolve) => {
    const res = $.get({ url }, (resp, data) => {
      $.data = data;
      $.headers = resp;
      if (resp.statusCode == 404) {
        log("NASA - 暂无图片" + err.message);
      }
      resolve();
    });
  });
}

//更新代码
function update() {
  if (goupdate == true) {
    log("🔔更新脚本开始!");
    scripts.forEach(async (script) => {
      await $.getFile(script);
    });
    log("🔔更新脚本结束!");
  }
}
