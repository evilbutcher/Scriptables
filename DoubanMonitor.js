// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: film;
/*
 * Author: evilbutcher
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = true;
const $ = importModule("Env");
const title = `🎞 豆瓣电影`;
const preview = "medium";
const spacing = 5;

const res = await getinfo();

let widget = await createWidget(res);
Script.setWidget(widget);
Script.complete();

async function createWidget(res) {
  var group = res["subject_collection_items"];
  items = [];
  for (var i = 0; i < 6; i++) {
    var gTitle = group[i].title;
    var rating = group[i].rating;
    if (rating == null) {
      var star = "暂无";
    } else {
      star = rating["star_count"];
    }
    var item = gTitle + "  " + star + "✨";
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
  const dbheader = {
    Referer: `https://m.douban.com/pwa/cache_worker`,
  };
  const dbRequest = {
    url:
      "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?start=0&count=50&items_only=1&for_mobile=1",
    headers: dbheader,
  };
  const res = await $.get(dbRequest);
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
    moduleName: "DoubanMonitor",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/DoubanMonitor.js",
  },
];
if (goupdate == true) update();
