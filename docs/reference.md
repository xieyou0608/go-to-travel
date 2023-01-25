# Reference

## What is the "right" JSON date format?
https://stackoverflow.com/questions/10286204/what-is-the-right-json-date-format

用 toJSON() 轉換，用 new Date() 轉回日期
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON  

註: axios 會自動轉換 date 成 UTC string, post 的時候不用自己做 toJSON