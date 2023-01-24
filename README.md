# Go To Travel
1. 輸入房間之後就可以顯示房間可訂時間
2. 核心概念是共享想去的民宿的日期狀態
3. 以 when2meet 為模型
4. 結合日期投票、民宿投票、匯集民宿訂房資訊

**重要：在日期及人數及地點皆未定的情況下使用**  
若有其中兩項確定→直接用 booking.com

## Getting Start
本專案使用 Vite 進行開發
```
npm install && npm run dev
```

## Tech Stack
- Vue3
- expressjs
- Firebase Realtime Database

## 功能
1. 開一個旅遊頁面
2. 日期投票 (跟 Line 一樣有圈叉跟三角形)
3. 民宿投票
4. 填入訂房網網址，python 爬蟲爬可訂房時間跟可訂房人數來顯示
5. 傳網址給其他人
6. local storage 存 recent trip 
6. 

## 其他
1. 在側邊攔顯示基本資訊
2. 適合程度高的用深色 (跟 when2meet 一樣)


## 限制
只實作 2 天 1 夜，並且以要住的那天(第一天)為主，因為需求就是跑去玩一天  
booking.com、樂活


## backend API
##### POST /api/trip
新增一個

##### GET /api/trip



##### GET /api/crawling/:bnb_url
body:{
    from: date string  // 2023-1-24
    to: date string    // 2023-2-3
}
response

爬取一間旅館在特定時間是否有空房
