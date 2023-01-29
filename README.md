# Go To Travel
後端 API(Node.js 爬蟲) https://github.com/xieyou0608/goto-api  
1. 結合日期投票、民宿投票、匯集民宿訂房資訊
2. 輸入民宿後可顯示每一天的空房諮詢
2. 核心概念是顯示所有想去的民宿的日期狀態
3. 以 when2meet 為模型

**重要：在日期、人數、地點皆未定的情況下使用**  
若有其中兩項確定→直接用 booking.com 等訂房網即可

## Getting Start
本專案使用 Vite 進行開發
```
npm install && npm run dev
```

## Tech Stack
- Vue3
- Nodejs + Express.js
- Firebase Realtime Database

## 功能
1. 開一個旅遊頁面
2. 日期投票 (跟 Line 一樣有圈叉跟三角形)
3. 民宿投票
4. 填入訂房網網址，後端會爬空房資訊
5. 以網址分享給其他人

## 其他
1. 在側邊攔顯示基本資訊
3. 只實作 2 天 1 夜，並且以要住的那天(第一天)為主，因為需求就是跑去玩一天  
4. 從 booking.com、樂活宜蘭民宿網爬蟲
6. 不提供排行程功能，市面上已經有很多可用的 app
7. 日期不提供增減，若想改動日期要直接新增一個新的 trip
6. local storage 存 recent trip 

## Realtime Database 資料庫格式
```javascript
{
    trip:{
        $tripId:{
            tripName: "來去宜蘭",
            availableDates: ["2023-01-25",...]
            bnbs: {
                $bnbName: {
                    bnbUrl: "https://twstay.com/RWD2/booking.aspx?BNB=shenzhou&OrderType=2",
                    rooms:{
                        "2023-01-25":[
                            {
                                roomTitle: "4~8人包棟(二房)",
                                roomStatus: "15000 元 1 間"
                            },
                            {
                                roomTitle: "6~10人包棟(三房)",
                                roomStatus: "沒有空房"
                            }
                        ],
                        "2023-01-26":...
                    }
                }
            },
            members: {
                $userName:{
                    datesVote:{
                        "2023-01-25": "O",
                        "2023-01-26": "A",
                        "2023-01-27": "X",
                    }
                }
            },
        }
    }
}
```
註: 用 firebase rest api 存 array 會自動產生 index 當作 key，如果想用 firebase 產生的 id 當作 key，要 (1) 把資料一個一個 post 進去(不合理)，或 (2) 用後端去接 firebase admin，然後用 push() 產生 id，(3)直接用日期當 id  

##### votes 放 date 底下
可以直接讀取特定日期各種選擇有哪些人  
讀取特定 user 時需要跑 m 個日期檢查該 user 在各個日期下的選擇  
針對每個日期要在 3 種選擇的 array 跑 includes  
投票:兩個人同時要提交投票可能會 race condition(可用 transaction 解決)  
新增日期: 直接新增  
刪除日期: 直接刪除
```javascript
votes: {
    circle: string[]
    triangle: string[]
    cross: string[]
}
```
##### votes 放 user 底下
可以直接讀取特定 user 在各個日期的選擇  
讀取特定日期時需要跑 n 個用戶的迴圈把選擇依序加入  
投票:各個用戶只會寫入自己的那塊資料  
新增日期: 直接新增  
刪除日期: 要跑迴圈把用戶的日期選擇刪除
```javascript
votes: {
    "2023-01-25": "circle",
    "2023-01-26": "cross",
    .
    .
    .
}
```