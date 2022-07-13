import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";


const borderRadius = 10;

const list = [80, 100, 200, 300, 500];

export default function Canvas() {

  useEffect(() => {

    var canvas = document.getElementById('tutorial');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    ctx.scale(2, 2)

    list.forEach(item => {
      ctx.beginPath();
      ctx.moveTo(50, 50);           // 创建起始点
      ctx.lineTo(10, 50);          // 创建水平线
      ctx.arcTo(0, 50, 0, 60, 10); // 创建弧
      ctx.lineTo(0, item + 50);         // 创建垂直线
      ctx.arcTo(0, item + 60, 10, item + 60, 10); // 创建弧
      ctx.lineTo(50, item + 60);         // 创建垂直线
      ctx.strokeStyle = "#aab7ea";
      ctx.lineWidth = 1;
      ctx.stroke();
    })


  }, [])

  return (
    <div>
      <canvas id="tutorial" width="1000" height="2000" style={{"zoom": "0.5"}}>
      {/*<canvas id="tutorial" width="1000" height="10000"> */}
      </canvas>
    </div>
  )
}
