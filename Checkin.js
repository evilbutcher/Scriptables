// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: plane;
/*
 * Author: evilbutcher Neurogram
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */
const goupdate = false; //默认关闭，需要更新时请手动打开
const $ = importModule("Env");
const ERR = MYERR();
const scripts = [
  {
    moduleName: "Checkin",
    url:
      "https://raw.githubusercontent.com/evilbutcher/Scriptables/master/Checkin.js",
  },
];
$.autoLogout = false;

!(async () => {
  if (getinfo() == true) {
    launch();
    //QuickLook.present(img);
    //let widget = createWidget();
    //Script.setWidget(widget);
    //Script.complete();
  }
})()
  .catch((err) => {
    if (err instanceof ERR.TokenError) {
      $.msg("Checkin - Config配置错误❌\n" + err.message);
    }
    log(err);
  })
  .finally(update());

function getinfo() {
  try {
    const con = importModule("Config");
    $.checkintitle = con.checkintitle();
    $.checkinloginurl = con.checkinloginurl();
    $.checkinemail = con.checkinemail();
    $.checkinpwd = con.checkinpwd();
    return true;
  } catch (err) {
    throw new ERR.TokenError("Config中未正确获取签到信息");
  }
}

function launch() {
  for (var i in $.checkintitle) {
    let title = $.checkintitle[i];
    let url = $.checkinloginurl[i];
    let email = $.checkinemail[i];
    let password = $.checkinpwd[i];
    if ($.autoLogout == true) {
      let logoutPath =
        url.indexOf("auth/login") != -1 ? "user/logout" : "user/logout.php";
      var logouturl = {
        url: url.replace(/(auth|user)\/login(.php)*/g, "") + logoutPath,
      };
      log(logouturl);
      $.getStr(logouturl, (response, data) => {
        login(url, email, password, title);
      });
    } else {
      checkin(url, email, password, title);
    }
  }
}

function login(url, email, password, title) {
  let loginPath =
    url.indexOf("auth/login") != -1 ? "auth/login" : "user/_login.php";
  let table = {
    url:
      url.replace(/(auth|user)\/login(.php)*/g, "") +
      loginPath +
      `?email=${email}&passwd=${password}&rumber-me=week`,
  };
  log(table);
  $.post(table, (response, data) => {
    if (
      JSON.parse(data).msg.match(
        /邮箱不存在|邮箱或者密码错误|Mail or password is incorrect/
      )
    ) {
      $.msg(title + "邮箱或者密码错误");
    } else {
      checkin(url, email, password, title);
    }
  });
}

function checkin(url, email, password, title) {
  let checkinPath =
    url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php";
  var checkinreqest = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath,
  };
  log(checkinreqest);
  $.post(checkinreqest, (response, data) => {
    if (data.match(/\"msg\"\:/)) {
      dataResults(url, JSON.parse(data).msg, title);
    } else {
      login(url, email, password, title);
    }
  });
}

function dataResults(url, checkinMsg, title) {
  let userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php";
  var datarequest = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + userPath,
  };
  log(datarequest);
  $.getStr(datarequest, (response, data) => {
    let resultData = "";
    let result = [];
    if (data.match(/theme\/malio/)) {
      let flowInfo = data.match(/trafficDountChat\s*\(([^\)]+)/);
      if (flowInfo) {
        let flowData = flowInfo[1].match(/\d[^\']+/g);
        let usedData = flowData[0];
        let todatUsed = flowData[1];
        let restData = flowData[2];
        result.push(`今日：${todatUsed}\n已用：${usedData}\n剩余：${restData}`);
      }
      let userInfo = data.match(/ChatraIntegration\s*=\s*({[^}]+)/);
      if (userInfo) {
        let user_name = userInfo[1].match(/name.+'(.+)'/)[1];
        let user_class = userInfo[1].match(/Class.+'(.+)'/)[1];
        let class_expire = userInfo[1].match(/Class_Expire.+'(.+)'/)[1];
        let money = userInfo[1].match(/Money.+'(.+)'/)[1];
        result.push(
          `用户名：${user_name}\n用户等级：lv${user_class}\n余额：${money}\n到期时间：${class_expire}`
        );
      }
      if (result.length != 0) {
        resultData = result.join("\n\n");
      }
    } else {
      let todayUsed = data.match(/>*\s*今日(已用|使用)*[^B]+/);
      if (todayUsed) {
        todayUsed = flowFormat(todayUsed[0]);
        result.push(`今日：${todayUsed}`);
      }
      let usedData = data.match(
        /(Used Transfer|>过去已用|>已用|>总已用|\"已用)[^B]+/
      );
      if (usedData) {
        usedData = flowFormat(usedData[0]);
        result.push(`已用：${usedData}`);
      }
      let restData = data.match(
        /(Remaining Transfer|>剩余流量|>流量剩余|>可用|\"剩余)[^B]+/
      );
      if (restData) {
        restData = flowFormat(restData[0]);
        result.push(`剩余：${restData}`);
      }
      if (result.length != 0) {
        resultData = result.join("\n");
      }
    }
    let flowMsg = resultData == "" ? "流量信息获取失败" : resultData;
    $.msg(title + "\n" + checkinMsg + "\n" + flowMsg);
  });
}

function flowFormat(data) {
  data = data.replace(/\d+(\.\d+)*%/, "");
  let flow = data.match(/\d+(\.\d+)*\w*/);
  return flow[0] + "B";
}

function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }
  return {
    TokenError,
  };
}

function createWidget() {
  const w = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#1c1c1c"), new Color("#29323c")];
  bgColor.locations = [0.0, 1.0];
  w.backgroundGradient = bgColor;
  w.centerAlignContent();

  const firstLine = w.addText(`[📣]${titlerss}`);
  firstLine.textSize = 14;
  firstLine.textColor = Color.white();
  firstLine.textOpacity = 0.7;

  const top1Line = w.addText(`•${items[0]}`);
  top1Line.textSize = 12;
  top1Line.textColor = Color.white();

  const top2Line = w.addText(`•${items[1]}`);
  top2Line.textSize = 12;
  top2Line.textColor = new Color("#6ef2ae");

  const top3Line = w.addText(`•${items[2]}`);
  top3Line.textSize = 12;
  top3Line.textColor = new Color("#7dbbae");

  const top4Line = w.addText(`•${items[3]}`);
  top4Line.textSize = 12;
  top4Line.textColor = new Color("#ff9468");

  const top5Line = w.addText(`•${items[4]}`);
  top5Line.textSize = 12;
  top5Line.textColor = new Color("#ffcc66");

  const top6Line = w.addText(`•${items[5]}`);
  top6Line.textSize = 12;
  top6Line.textColor = new Color("#ffa7d3");
  w.presentMedium();
  return w;
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
