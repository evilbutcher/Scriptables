// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: star-and-crescent;
/**
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 * 感谢@MuTu88帮忙测试！
 */
const goupdate = false;
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
    var exp = $.data.explanation || "None";
    var title = $.data.title || "None";
    var time = $.data.date || "None";
    var copyright = $.data.copyright || "None";
    var detail = `${title}\n©️Copyright：${copyright}\n⌚️Date：${time}\n${exp}`;
    var cover = $.data.url;
    try {
      var img = await new Request(cover).loadImage();
    } catch (err) {
      throw new ERR.ImageError("解析图片错误");
    }
    QuickLook.present(img);
    log(detail);
    let widget = createWidget(img, detail);
    Script.setWidget(widget);
    Script.complete();
  }
})()
  .catch((err) => {
    log(err);
    if (err instanceof ERR.TokenError) {
      $.msg("NASA - API 错误" + err.message);
    } else if (err instanceof ERR.ImageError) {
      $.msg("NASA - 出现错误❌" + err.message);
    } else {
      $.msg("NASA - 出现错误❌" + JSON.stringify(err));
    }
  })
  .finally(update());

function checkkey() {
  try {
    const { nasaapi } = importModule("Config");
    $.apikey = nasaapi();
    return true;
  } catch (err) {
    throw new ERR.TokenError("❌ 配置文件中未找到NASA API");
  }
}

function createWidget(img, detail) {
  const w = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#1c1c1c"), new Color("#29323c")];
  bgColor.locations = [0.0, 1.0];
  w.backgroundGradient = bgColor;
  w.centerAlignContent();

  const firstLine = w.addText(`[📣]NASA`);
  firstLine.textSize = 12;
  firstLine.textColor = Color.white();
  firstLine.textOpacity = 0.7;

  const top1Line = w.addImage(img);
  //top1Line.textSize = 12;
  //top1Line.textColor = new Color("#7dbbae");

  const top2Line = w.addText(detail);
  top2Line.textSize = 12;
  top2Line.textColor = new Color("#7dbbae");

  w.presentMedium();
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
      try {
        $.data = data;
        if (resp.statusCode == 404) {
          throw new ERR.TimeError("❌ 暂无图片，内容在更新，请稍等呦～");
        }
      } catch (err) {
        if (err instanceof ERR.TimeError) {
          $.msg("NASA - 暂无图片" + err.message);
        }
        return;
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
