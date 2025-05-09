import dayjs from 'dayjs'
//https://www.talvbansal.me/blog/human-readable-dates-with-dayjs-in-vue-js/
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
export default {
    phpTimeToJsDateString(time, withTime = false){
        if(typeof time == "string"){
            time = parseFloat(time);
        }
        var dtTime = time * 1000;
        var thisDate = new Date();
        thisDate.setTime(dtTime);
        var str = this.getDateString(thisDate, withTime);
        return str;
    },
    getDateString(thisDate, withTime){
        if (typeof thisDate == "undefined" || thisDate == null) {
          thisDate = new Date();
        }
        if (typeof thisDate == "string") {
            thisDate = new Date(thisDate);
          }
        if (typeof withTime == "undefined" || withTime == null) {
          withTime = false;
        }
        var m = (1 + thisDate.getMonth());
        m = m < 10 ? ("0" + m) : m;
        var d = thisDate.getDate();
        d = d < 10 ? ("0" + d) : d;
        var thisDateStr = thisDate.getFullYear() + "-" + m + "-" + d;
        if (withTime == true) {
          thisDateStr = thisDateStr + " " + thisDate.toLocaleTimeString();
        }
        return thisDateStr;
    },
    jsDateToPhpTimestamp(jsDate){
        if(typeof jsDate == 'string'){
            jsDate = jsDate.trim();
            if(jsDate.length == 0){
                return 0;
            }else{
                jsDate =  new Date(jsDate);
            }
        }
        return Math.floor(jsDate.getTime()/1000)
    },
    jsDateAddDays(jsDate, days){
        if(typeof jsDate == 'string'){
            jsDate = jsDate.trim();
            if(jsDate.length == 0){
                return "";
            }
            jsDate = new Date(jsDate);
        }
        const dateCopy = new Date(jsDate);
        dateCopy.setDate(jsDate.getDate() + days);
        return dateCopy;
    },
    daysBetweenDates(greaterDate, lesserDate){
        if(typeof greaterDate == "string"){
            greaterDate = greaterDate.trim();
            if(greaterDate.length == 0){
                return 0;
            }
        }
        if(typeof lesserDate == "string"){
            lesserDate = lesserDate.trim();
            if(lesserDate.length == 0){
                return 0;
            }
        }
        //https://linuxhint.com/calculate-days-between-two-dates-javascript/
        let date_1 = new Date(greaterDate);
        let date_2 = new Date(lesserDate);

        const days = (date_1, date_2) =>{
            let difference = date_1.getTime() - date_2.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        return days(date_1, date_2);
    },
    formatDate(date, format) {
        //https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
        if(typeof date == "string"){
            date = date.trim();
            if(date.length == 0){
                return "";
            }
        }
        var d = new Date(date);
        var jsMonthNo = d.getMonth();
        var month = '' + (jsMonthNo + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        var monthShortNames = ['Jan', "Feb", 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        if(typeof format == 'undefined'){
            format = "yyyy-mm-dd";
        }
        if(format == "yyyy-mm-dd"){
            return [year, month, day].join('-');
        }else if(format == "MMM dd, yyyy"){
            let monthShortName = monthShortNames[jsMonthNo];
            return `${monthShortName} ${day}, ${year}`;
        }
        return date.toLocaleString();
    },
    daysAgo(date){
        if(typeof date == "string"){
            date = date.trim();
            if(date.length == 0){
                return "";
            }
        }
        let formatedDate = this.formatDate(date,"yyyy-mm-dd");
        var dayjsDate = dayjs(formatedDate);
        var agoDate = dayjs().to(dayjsDate);
        return agoDate;

    },
    comma(val, def = "") {
        if(val == null){
            return def;
        }
        //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        var t = parseFloat(val);
        var bt = t.toLocaleString();
        return bt;
    },
}