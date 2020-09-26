// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: car-alt;
/**
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 * ⚠️免责声明：本脚本数据从官网获取，不保证准确性，仅供学习交流，若由此脚本引发的任何责任，本人概不承担！详见仓库内免责声明！
 */

const goupdate = true;
const $ = importModule("Env");
try {
  var { lastnumberofcar } = importModule("Config");
  lastnumberofcar = lastnumberofcar();
  console.log("将使用配置文件内尾号: " + lastnumberofcar);
} catch (e) {
  console.log("未获取汽车尾号，需正确配置");
}

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

    if (lastnumberofcar == undefined || lastnumberofcar == "") {
      var firstLine = w.addText(`🚙 北京尾号限行`);
    } else {
      if (group[0].limitedNumber.indexOf(lastnumberofcar) != -1) {
        firstLine = w.addText(`🚙 今日限行‼️ 注意遵守交规哦`);
      } else {
        firstLine = w.addText(`🚙 今日不限行🎉 放心出门吧`);
      }
    }
    firstLine.textColor = isDark ? Color.white() : Color.black();
    try {
      firstLine.applyHeadlineTextStyling();
    } catch (e) {
      firstLine.font = new Font('SF Mono', 18);
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
  item.font = new Font('SF Mono', 12);
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
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/%E5%8C%97%E4%BA%AC%E5%B0%BE%E5%8F%B7%E9%99%90%E8%A1%8C.js",
  },
];
if (goupdate == true) update();
