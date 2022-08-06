// function setCookie(name: string, value: string, exTime: number | undefined) {
//   var d = new Date();
//   if (exTime) {
//     d.setTime(d.getTime() + (exTime | getMsec('1d')));
//   }
//   var expires = "expires=" + d.toUTCString();
//   document.cookie = name + "=" + value + "; " + expires + ';path=/';
// }
//
// function getMsec(str: string): number {
//   var timeNum: number = Number(str.substring(0, str.length - 1)) * 1;
//   var timeStr = str.substring(str.length - 1, str.length);
//
//   if (timeStr == "s") {
//     return timeNum * 1000;
//   } else if (timeStr == "h") {
//     return timeNum * 60 * 60 * 1000;
//   } else if (timeStr == "d") {
//     return timeNum * 24 * 60 * 60 * 1000;
//   } else {
//     return 0;
//   }
// }
//
//
// function getCookie(key: string) {
//   var arr1 = document.cookie.split('; ');
//   for (var i = 0; i < arr1.length; i++) {
//     var arr2 = arr1[i].split('=');
//     if (arr2[0] == key) {
//       return decodeURI(arr2[1]);
//     }
//   }
// }
//
// function delCookie(name: string) {
//   var exp = new Date();
//   exp.setTime(exp.getTime() - 1);
//   var cval = getCookie(name);
//   if (cval != null) {
//     setCookie(name, cval, -1)
//   }
// }
//
// const cookie = {
//   setCookie,
//   getCookie,
//   delCookie
// }
//
// export default cookie;

export {};
