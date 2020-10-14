// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: fire;
/*
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = true;
const $ = importModule("Env");
const title = `🔥 微博热搜`;
const preview = "medium";
const spacing = 5;

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

async function createWidget(res) {
  if (res.data.cards[0].title == "实时热点，每分钟更新一次") {
    var group = res.data.cards[0]["card_group"];
    items = [];
    for (var i = 0; i < 6; i++) {
      var item = group[i].desc;
      items.push(item);
    }
    console.log(items);

    const opts = {
      title,
      texts: {
        text1: `📌 ${items[0]}`,
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
    url:
      "https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot",
  };
  const res = await $.get(url);
  //log(res);
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
    moduleName: "WeiboMonitor",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/WeiboMonitor.js",
  },
];
if (goupdate == true) update();
