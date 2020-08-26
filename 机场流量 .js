// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: plane;
/*
author：boruiqiao
telegram：https://t.me/qiaoborui
*/
const para = args.widgetParameter.split(',')

var url = para[0] || 'xxx'//订阅链接
var titles = para[1] ||  "xxx" //机场名称
var size = 12 //显示字体大小
function addTextToListWidget(text, listWidget) {
	let item = listWidget.addText(text)
	item.textColor = Color.black()
	item.textSize = size
}
var data = await getdata()
let widget = createWidget()
Script.setWidget(widget)
Script.complete()
async function getdata(){
  var req = new Request(url)
  req.method="GET"
  await req.load()
  var resp = req.response.headers["subscription-userinfo"]
  log(req.response)
  resp = [(parseInt(resp.match(/upload=(.*?);/)[1])/1048576).toFixed(2),(parseInt(resp.match(/download=(.*?);/)[1])/1048576).toFixed(2),(parseInt(resp.match(/total=(.*?);/)[1])/1048576).toFixed(2)]
  console.log(resp)
return resp
}
function createWidget(){
  let listWidget = new ListWidget()
  let backgroundColor = new LinearGradient()
  backgroundColor.colors = [new Color("a18cd1"), new Color("fbc2eb")]
  backgroundColor.locations = [0.0, 1]
  listWidget.backgroundGradient = backgroundColor
  let emoji = listWidget.addText("🪐")
  emoji.textSize = 37
  let title = listWidget.addText(titles)
  title.applyHeadlineTextStyling()
  title.textColor = Color.black()
  var total = (data[2]/1024).toFixed(0)
  var remain = ((data[2]-data[0]-data[1])/1024).toFixed(2)
  var use = (total - remain).toFixed(2)
  addTextToListWidget(`流量总计：${total}GB`,listWidget)
  addTextToListWidget(`过去使用：${use}GB`,listWidget)
  addTextToListWidget(`剩余可用：${remain}GB`,listWidget)
  listWidget.presentSmall()
	return listWidget
}
