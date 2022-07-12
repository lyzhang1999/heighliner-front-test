import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";


export default function Canvas() {

  useEffect(() => {

//     var canvas = document.getElementById('tutorial');
// //获得 2d 上下文对象
//     if (!canvas.getContext) return;
//     var ctx = canvas.getContext("2d");
    // ctx.beginPath(); //新建一条path
    // ctx.moveTo(50, 50); //把画笔移动到指定的坐标
    // ctx.lineTo(200, 50);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
    //
    // ctx.lineTo(200, 100);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
    // //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
    // // ctx.closePath();
    // ctx.arc(50, 50, 40, 0, Math.PI / 2, false);
    //
    // ctx.stroke(); //绘制路径。
    //


    let sun;
    let earth;
    let moon;
    let ctx;

    function init() {
      sun = new Image();
      earth = new Image();
      moon = new Image();
      sun.src = "/img/application/create.webp";
      earth.src = "/img/application/create.webp";
      moon.src = "/img/application/create.webp";

      let canvas = document.querySelector("#tutorial");
      ctx = canvas.getContext("2d");

      sun.onload = function () {
        draw()
      }

    }

    init();

    function draw() {
      ctx.clearRect(0, 0, 300, 300); //清空所有的内容
      /*绘制 太阳*/
      ctx.drawImage(sun, 0, 0, 300, 300);

      ctx.save();
      ctx.translate(150, 150);

      //绘制earth轨道
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,0,0.5)";
      ctx.arc(0, 0, 100, 0, 2 * Math.PI)
      ctx.stroke()

      let time = new Date();
      //绘制地球
      ctx.rotate(2 * Math.PI / 60 * time.getSeconds() + 2 * Math.PI / 60000 * time.getMilliseconds())
      ctx.translate(100, 0);
      ctx.drawImage(earth, -12, -12)

      //绘制月球轨道
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,.3)";
      ctx.arc(0, 0, 40, 0, 2 * Math.PI);
      ctx.stroke();

      //绘制月球
      ctx.rotate(2 * Math.PI / 6 * time.getSeconds() + 2 * Math.PI / 6000 * time.getMilliseconds());
      ctx.translate(40, 0);
      ctx.drawImage(moon, -3.5, -3.5);
      ctx.restore();

      requestAnimationFrame(draw);
    }
  }, [])


  return (
    <div>
      <canvas id="tutorial" width="1000" height="1000"></canvas>


      {/*    <div>*/}
      {/*      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className={styles.path}>*/}
      {/*        <path id="path" fill="none" stroke="#000" strokeWidth="1px" d="M452,293c0,0,0-61,72-44c0,0-47,117,81,57*/}
      {/*s5-110,10-67s-51,77.979-50,33.989"/>*/}
      {/*      </svg>*/}
      {/*    </div>*/}

    </div>
  )
}
