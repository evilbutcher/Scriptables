// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: film;
/*
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = true;
const $ = importModule("Env");
const title = `🎬 人人影视`;
const preview = "medium";
const spacing = 5;

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

async function createWidget(res) {
  items = [];
  for (var i = 0; i < 6; i++) {
    var item = res[i]["file_name"];
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

async function getinfo() {
  const zmzRequest = {
    url: `http://file.apicvn.com/file/list?page=1&order=create_time&sort=desc`,
    headers: {
      Host: "file.apicvn.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
  };
  const res = await $.get(zmzRequest);
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
    moduleName: "RRShareMonitor",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/RRShareMonitor.js",
  },
];
if (goupdate == true) update();
