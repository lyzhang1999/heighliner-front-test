// function setCookie(name: string, value: string, time: string) {
//   var msec = getMsec(time); //获取毫秒
//   var exp = new Date();
//   exp.setTime(exp.getTime() + msec * 1);
//   document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ';path=/ ';
// }

function setCookie(name: string, value: string, exTime: number | undefined) {
  var d = new Date();
  d.setTime(d.getTime() + (exTime | getMsec('1d')));
  var expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + "; " + expires + ';path=/';
}

//将字符串时间转换为毫秒,1秒=1000毫秒
function getMsec(str: string) {
  var timeNum = str.substring(0, str.length - 1) * 1; //时间数量
  var timeStr = str.substring(str.length - 1, str.length); //时间单位前缀，如h表示小时

  if (timeStr == "s") { //20s表示20秒
    return timeNum * 1000;
  } else if (timeStr == "h") { //12h表示12小时
    return timeNum * 60 * 60 * 1000;
  } else if (timeStr == "d") {
    return timeNum * 24 * 60 * 60 * 1000; //30d表示30天
  }
}


function getCookie(key: string) {
  var arr1 = document.cookie.split('; ');
  for (var i = 0; i < arr1.length; i++) {
    var arr2 = arr1[i].split('=');
    if (arr2[0] == key) {
      return decodeURI(arr2[1]);
    }
  }
}

function delCookie(name: string) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    setCookie(name, cval, -1)
  }
}

const cookie = {
  setCookie,
  getCookie,
  delCookie
}

export default cookie;
