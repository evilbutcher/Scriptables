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
    moduleName: "NASAwDetail",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/NASAwDetail.js",
  },
];

!(async () => {
  if (checkkey() == true) {
    await getinfo();
    if ($.headers.statusCode == 200) {
      var title = $.data.title;
      var copyright = $.data.copyright;
      var time = $.data.date;
      var exp = $.data.explanation;
      var detail = `🌃 ${title}\n©️Copyright：${copyright}\n⌚️Date：${time}\n${exp}`;
      var cover = $.data.url;
    } else {
      title = "随机图片展示";
      cover = $.imglink;
      detail = `🌃 ${title}`;
    }
    try {
      var img = await new Request(cover).loadImage();
    } catch (err) {
      throw new ERR.ImageError("NASA提供的是视频/备用图片地址不支持");
    }
    //QuickLook.present(img);
    let widget = createWidget(img, detail);
    Script.setWidget(widget);
    Script.complete();
  }
})()
  .catch((err) => {
    if (err instanceof ERR.TokenError) {
      $.msg("NASA - Config配置错误❌\n" + err.message);
    } else if (err instanceof ERR.ImageError) {
      $.msg("NASA - 图片错误❌\n" + err.message);
    } else {
      $.msg("NASA - 出现错误❌\n" + JSON.stringify(err));
    }
  })
  .finally(update());

function checkkey() {
  try {
    const { nasaapi, imglink } = importModule("Config");
    $.apikey = nasaapi();
    $.imglink = imglink();
    return true;
  } catch (err) {
    throw new ERR.TokenError("❌ 配置文件中未找到NASA API或备用图片地址");
  }
}

function createWidget(img, detail) {
  const w = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#1c1c1c"), new Color("#29323c")];
  bgColor.locations = [0.0, 1.0];
  w.backgroundGradient = bgColor;
  w.addSpacer();
  w.spacing = 5;

  const imgLine = w.addImage(img);
  imgLine.containerRelativeShape = true;

  const top1Line = w.addText(detail);
  top1Line.font = new Font('SF Mono', 12);
  top1Line.textColor = new Color("#7dbbae");

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
      try {
        $.data = data;
        $.headers = resp;
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
