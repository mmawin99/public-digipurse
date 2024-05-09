export const cacheExpiry = 21600000; // Cache expiry time in milliseconds (1 hour)
export const TrendsDataBackCount = 10;
export function formatNumberWithPrefix(number) {
    if(typeof number == "undefined"){
      number = 0;
    }else if(typeof number == "string"){
        number = parseFloat(number);
    }
    if (Math.abs(number) >= 1e12) {
      return (number / 1e12).toFixed(2) + 'T';
    } else if (Math.abs(number) >= 1e9) {
      return (number / 1e9).toFixed(2) + 'B';
    } else if (Math.abs(number) >= 1e6) {
      return (number / 1e6).toFixed(2) + 'M';
    } else if (Math.abs(number) >= 1e3) {
      return (number / 1e3).toFixed(2) + 'K';
    } else {
      return number.toFixed(2);
    }
}
export function formatNumberWithPrefixAndCommas(number) {
    if(typeof number == "undefined"){
      number = 0;
    }else if(typeof number == "string"){
        number = parseFloat(number);
    }
    if (Math.abs(number) >= 1e12) {
      return formatNumberWithCommas((number / 1e12).toFixed(2)) + 'T';
    } else if (Math.abs(number) >= 1e9) {
      return formatNumberWithCommas((number / 1e9).toFixed(2)) + 'B';
    } else if (Math.abs(number) >= 1e6) {
      return formatNumberWithCommas((number / 1e6).toFixed(2)) + 'M';
    } else if (Math.abs(number) >= 1e3) {
      return formatNumberWithCommas((number / 1e3).toFixed(2)) + 'K';
    } else {
      return formatNumberWithCommas(number.toFixed(2));
    }
}
export function formatNumberWithCommas(number) {
  if(typeof number == "undefined"){
    number = 0;
  }
  const parts = parseFloat(number).toFixed(2).split('.');
  // console.log(parts,number);
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
export function getDatabaseName(uid){
    if(typeof uid != "string" || uid == "" || uid == null){
        return null;
    }else{
        return {
            "txn":uid+"_txn",
            "wallet":uid+"_wallet",
            "group":uid+"_group",
            "pref":uid+"_pref"
        }
    }
}
export function getISOWeek(date) {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));
  const yearStart = new Date(currentDate.getFullYear(), 0, 1);
  return Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
}

export function sortByCreated(array) {
  return array.sort((a, b) => a.created.seconds - b.created.seconds);
}

export function getCustomWeekString(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const weekNumber = getISOWeek(date); // Define or import getISOWeek function
  
  // Adjust the week number for January if ISO week is 52
  if (weekNumber === 52 && month === 0) {
    return `${year - 1}-Week-${weekNumber}`;
  } else {
    return `${year}-Week-${weekNumber}`;
  }
}
export function getCurrentDateFormat(){
  return {
    Day: "Y-m-d",
    Week: "\\Week-W_Y",
    Month: "\\Mo\\nt\\h-F_Y",
    Year: "\\Year-Y"
  };
}
export function getFormatOfDate(date){
  format = getCurrentDateFormat();
  return {
    Day: formatDateWithTokens(date, format["Day"]),
    Week: formatDateWithTokens(date, format["Week"]),
    Month: formatDateWithTokens(date, format["Month"]),
    Year: formatDateWithTokens(date, format["Year"])
  }
}
export const formatDateWithTokens = (date, format) =>
format.replace(
  /(d|D|l|j|J|w|W|F|m|n|M|U|y|Y|Z|h|H|G|i|S|s|K)|\\([dDljJwWFmnMUyYZhHGisK])/g, (match, token, escapedToken) => {
  if (token) {
    return {
      d: String(date.getDate()).padStart(2, '0'), 
      D: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()], 
      l: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()], 
      j: date.getDate(), 
      J: date.getDate() + (date.getDate() === 1 ? 'st' : 
                            (date.getDate() === 2 ? 'nd' : 
                              (date.getDate() === 3 ? 'rd' : 'th')
                            )
                          ), 
      w: date.getDay(), 
      W: getISOWeek(date), 
      F: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()], 
      m: String(date.getMonth() + 1).padStart(2, '0'), 
      n: date.getMonth() + 1, 
      M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()], 
      U: Math.floor(date.getTime() / 1000), 
      y: String(date.getFullYear()).slice(2), 
      Y: date.getFullYear(), 
      Z: date.toISOString(),
      h: String((date.getHours() % 12) || 12).padStart(2, '0'),
      H: String(date.getHours()).padStart(2, '0'),
      G: String(date.getHours()).padStart(2, '0'),
      i: String(date.getMinutes()).padStart(2, '0'),
      S: String(date.getSeconds()).padStart(2, '0'),
      s: String(date.getSeconds()),
      K: date.getHours() >= 12 ? 'PM' : 'AM',
    }[token] || match;
  } else if (escapedToken) {
    return escapedToken;
  } else {
    return match;
  }
}
);

export const expensifyVersion = "1.0.1";
export const expensifyVersionText = "V"+expensifyVersion+" Expensify";