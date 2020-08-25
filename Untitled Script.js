// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
/**
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = false;
const $ = new importModule("Env");
try {
  const { nasaapi } = importModule("Config");
  var apikey = nasaapi();
} catch (e) {
  console.log("未配置Config文件或填写错误");
}
var cover = "https://api.dujin.org/pic/"; //$.data.url;
let img = await new Request(cover).loadImage();
//QuickLook.present(img);
let widget = createWidget();
Script.setWidget(widget);
Script.complete();



log(detail);

function createWidget() {
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

  const top3Line = w.addImage(img);
  //     top3Line.textSize = 12;
  //     top3Line.textColor = new Color("#7dbbae");

  w.presentMedium();
  return w;
}

async function getinfo() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apikey}`;
  return new Promise(resolve => {
    const res = $.get({ url }, (resp, data) => {
      $.headers = resp;
      $.data = data;
      resolve();
    });
  });
}

//更新代码
function update() {
  log("🔔更新脚本开始!");
  scripts.forEach(async script => {
    await $.getFile(script);
  });
  log("🔔更新脚本结束!");
}

const scripts = [
  {
    moduleName: "NASA",
    url: ""
  }
];
if (goupdate == true) update();
