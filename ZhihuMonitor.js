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

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

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
        text1: `• ${items[0]}`,
        text2: `• ${items[1]}`,
        text3: `• ${items[2]}`,
        text4: `• ${items[3]}`,
        text5: `• ${items[4]}`,
        text6: `• ${items[5]}`,
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
