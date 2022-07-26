import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";
import {isEmpty} from "lodash-es";


// const borderRadius = 10;

// const list = [80, 100, 200, 300, 500];

interface Props {
  arrList: number[];
}

export default function Canvas({arrList}: Props) {
  var ctx: any = null;
  var dom: any = null
  const [height, setHeight] = useState(0);

  useEffect(() => {
    dom = document.getElementById('tutorial');
    if (!dom.getContext) return;
    ctx = dom.getContext("2d");
    // ctx.scale(2, 2)
  }, [arrList])


  useEffect(() => {
    console.warn(arrList)
    setHeight(Math.max(...arrList) + 100)
    if (isEmpty(arrList)) {
      return;
    }

    setTimeout(() => {
      var w = dom.width;
      var h = dom.height;
      ctx.clearRect(0, 0, w, h);

      // setHeight(Math.max(...arrList) + 100)
      arrList.forEach(item => {
        ctx.beginPath();
        ctx.moveTo(50, 0);           // 创建起始点
        ctx.lineTo(10, 0);          // 创建水平线
        ctx.arcTo(0, 0, 0, 10, 10); // 创建弧
        ctx.lineTo(0, item - 10);         // 创建垂直线
        ctx.arcTo(0, item, 10, item, 10); // 创建弧
        ctx.lineTo(50, item);         // 创建垂直线
        ctx.strokeStyle = "#aab7ea";
        ctx.lineWidth = 1;
        ctx.stroke();
      })
    }, 0)

  }, [arrList])


  return (
    <div>
      {/*<canvas id="tutorial" width="50" height="2000" style={{"zoom": "0.5"}}>*/}
      <canvas id="tutorial" width="50" height={height || 1000} style={{marginTop: '70px'}}>
      </canvas>
    </div>
  )
}
