// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: heartbeat;
/*
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = true;
const $ = importModule("Env");
var rid = 0; //rid对应不同的B站榜单：0全站，1动画，3音乐，4游戏，5娱乐，36科技，119鬼畜，129舞蹈。
const title = `💗 B站榜单`;
const preview = "medium";
const goto = 'app'; // 可更改为 browser，跳转到浏览器，选择跳转 app 时若未安装 app，则会无响应
const spacing = 5;

try {
  var { bilibili } = importModule("Config");
  rid = bilibili();
  console.log("将使用配置文件内B站配置");
} catch (e) {
  console.log("将使用脚本内B站配置");
}

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

function decideGoto(item) {
  switch(goto) {
    case 'app':
      return item.uri;
    case 'browser':
      return `https://bilibili.com/${item.goto}${item.param}`;
    default:
      return void 0;
  }
}

async function createWidget(res) {
  var group = res.data;
  items = [];
  for (var i = 0; i < 6; i++) {
    var item = group[i].title;
    items.push(item);
  }
  console.log(items);

  const opts = {
    title,
    texts: {
      text1: { text: `• ${group[0].title}`, url: decideGoto(group[0]) },
      text2: { text: `• ${group[1].title}`, url: decideGoto(group[1]) },
      text3: { text: `• ${group[2].title}`, url: decideGoto(group[2]) },
      text4: { text: `• ${group[3].title}`, url: decideGoto(group[3]) },
      text5: { text: `• ${group[4].title}`, url: decideGoto(group[4]) },
      text6: { text: `• ${group[5].title}`, url: decideGoto(group[5]) },
      battery: "true",
    },
    preview,
    spacing,
  };

  let widget = await $.createWidget(opts);
  return widget;
}

async function getinfo() {
  const blRequest = {
    url: `https://app.bilibili.com/x/v2/rank/region?rid=${rid}`,
  };
  const res = await $.get(blRequest);
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
    moduleName: "BilibiliMonitor",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/BilibiliMonitor.js",
  },
];
if (goupdate == true) update();
