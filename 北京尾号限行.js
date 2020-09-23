// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: car-alt;
/**
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */

const goupdate = true;
const $ = importModule("Env");

const isDark = Device.isUsingDarkAppearance();
const bgColor = new LinearGradient();
bgColor.colors = isDark
  ? [new Color("#030079"), new Color("#000000")]
  : [new Color("#a18cd1"), new Color("#fbc2eb")];
bgColor.locations = [0.0, 1.0];

const res = await getinfo();

let widget = createWidget(res);
Script.setWidget(widget);
Script.complete();

function createWidget(res) {
  if (res.state == "success") {
    var group = res.result;
    var num = group.length;
    items = [];
    for (var i = 0; i < 6; i++) {
      var week = group[i].limitedWeek;
      var number = group[i].limitedNumber;
      var time = group[i].limitedTime;
      items.push(
        `• ${JSON.stringify(time).slice(1, -1)}    ${JSON.stringify(week).slice(
          1,
          -1
        )}    ${JSON.stringify(number).slice(1, -1)}`
      );
    }
    const w = new ListWidget();
    w.backgroundGradient = bgColor;
    w.addSpacer();
    w.spacing = 5;

    const firstLine = w.addText(`🚙 北京尾号限行`);
    firstLine.textColor = isDark ? Color.white() : Color.black();
    try {
      firstLine.applyHeadlineTextStyling();
    } catch (e) {
      firstLine.textSize = 18;
    }

    for (var i = 0; i < items.length; i++) {
      addTextToListWidget(`${items[i]}`, w);
    }

    w.addSpacer();
    w.spacing = 5;
    w.presentMedium();
    return w;
  }
}

function addTextToListWidget(text, listWidget) {
  let item = listWidget.addText(text);
  item.textColor = isDark ? Color.white() : Color.black();
  item.textSize = 12;
}

async function getinfo() {
  const url = {
    url: `http://yw.jtgl.beijing.gov.cn/jgjxx/services/getRuleWithWeek`,
  };
  const res = await $.get(url);
  log(res);
  return res;
}

//更新代码
function update() {
  log("🔔更新脚本开始!");
  scripts.forEach(async (script) => {
    await $.getFile(script);
  });
  log("🔔更新脚本结束!");
}

const scripts = [
  {
    moduleName: "北京尾号限行",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/ZhihuMonitor.js",
  },
];
if (goupdate == true) update();
