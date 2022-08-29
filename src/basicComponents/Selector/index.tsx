import { MenuItem, TextField } from "@mui/material";
import React, { useRef, useState } from "react"
import { selectorProps } from "./type";
import styles from "./index.module.scss";
import { defaultloadingIconUrl } from "./const";
export default function Selector(props: selectorProps) {
  const { filterProps, List, isLoading, loadingText, onChange, defaultValue, placeholder, loadingNode, loadingIconUrl, onOpen } = props
  const [isListShow, setIsListShow] = useState(isLoading === undefined ? false : !isLoading)
  const [isInputShow, setIsInputShow] = useState(false)
  const [optionValue, setOptionValue] = useState(defaultValue || '')
  const [filterValue, setFilterValue] = useState(optionValue)
  const selectorRef = useRef<HTMLDivElement | null>(null)
  const filterList = (!filterValue && List.length === 0) ? List : List.filter(item => item.value.toLowerCase().match(filterValue ? filterValue.toLowerCase() : ''))
  function showInput() {
    setIsListShow(true);
    setIsInputShow(true);
    setFilterValue(optionValue);
  }
  return (
    <>
      {/* 目前通过创建一个全屏mask拦截用户点击模仿输入框的blur让下拉列表消失，后续寻求更佳解决方案 */}
      {/* 不直接用blur原因，点击下拉列表的回调执行顺序是1、blur 2、click，会导致下拉列表无法点击 */}
      {isListShow && (<div className={styles.mask} onClick={() => setIsListShow(false)}></div>)}
      <div className={styles.selector} ref={selectorRef}>
        {
          isInputShow ? (
            // 输入框
            <TextField {...filterProps}
              fullWidth
              onChange={e => setFilterValue(e.target.value)}
              value={filterValue}
              onFocus={() => setIsListShow(true)}
              placeholder={placeholder}
              onBlur={() => {
                setTimeout(() => {
                  setIsInputShow(false)
                }, 200);
              }}
              autoFocus
              autoComplete="off"
            />
          ) : (
            // 展示框
            <TextField {...filterProps}
              fullWidth
              value={optionValue}
              placeholder={placeholder}
              onClick={showInput}
              onFocus={showInput}
              autoComplete="off"
            />
          )
        }
        {
          isListShow && (
            <div className={styles.selectorList}>
              {
                isLoading && (
                  <div className={styles.loading}>
                    {
                      loadingNode ? loadingNode :
                        (
                          <>
                            <img src={loadingIconUrl ? loadingIconUrl : defaultloadingIconUrl} className={styles.loadingIcon} />
                            <span className={styles.loadingText}>
                              {loadingText}
                            </span>
                          </>
                        )
                    }
                  </div>
                )
              }
              <div className={styles.listContainer}>
                {
                  !isLoading && (
                    filterList.map(item => {
                      return (
                        <MenuItem
                          key={item.key}
                          onClick=
                          {e => {
                            setIsListShow(false)
                            setOptionValue((e.target as any).dataset.value)
                            onChange((e.target as any).dataset.value)
                            setIsInputShow(false)
                            onOpen && onOpen(e)
                          }}
                          data-value={item.value}>
                          {item.value}
                        </MenuItem>
                      )
                    })
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}
