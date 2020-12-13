// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: book-open;
/*
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = false;
const $ = importModule("Env");
const title = `📖 知乎热榜`;
const preview = "medium";
const spacing = 5;
const goto = 'app'; // 可更改为 browser，跳转到浏览器，选择跳转 app 时若未安装 app，则会无响应

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

function decideGoto(item) {
  switch(goto) {
    case 'app':
      return `zhihu://question/${item.target.id}`;
    case 'browser':
      return `https://m.zhihu.com/question/${item.target.id}`;
    default:
      return void 0;
  }
}

async function createWidget(res) {
  if (res.fresh_text == "热榜已更新") {
    var group = res.data;
    items = [];
    for (var i = 0; i < 6; i++) {
      var item = group[i].target.title;
      items.push(item);
    }
    console.log(items);

    const opts = {
      title,
      texts: {
        text1: { text: `• ${items[0]}`, url: decideGoto(group[0]) },
        text2: { text: `• ${items[1]}`, url: decideGoto(group[1]) },
        text3: { text: `• ${items[2]}`, url: decideGoto(group[2]) },
        text4: { text: `• ${items[3]}`, url: decideGoto(group[3]) },
        text5: { text: `• ${items[4]}`, url: decideGoto(group[4]) },
        text6: { text: `• ${items[5]}`, url: decideGoto(group[5]) },
        battery: "true",
      },
      preview,
      spacing,
    };

    let widget = await $.createWidget(opts);
    return widget;
  }
}

async function getinfo() {
  const url = {
    url: `https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0`,
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
    moduleName: "ZhihuMonitor",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/ZhihuMonitor.js",
  },
];
if (goupdate == true) update();
