var undefined;

function isUndefined(property) {
  return (typeof property == 'undefined');
}

/****************************************************************************************\
Date.DateAdd(interval, number)
說明 
	傳回內容為某個基準日期加上數個時間間隔單位後的日期。 

語法
	object.DateAdd(interval, number)
	參數		說明 
	interval	必要項。字串運算式，表示所要加上去之時間間隔單位。其值請參考設定部份。 
	number		必要項。數值運算式，表示要加上之時間間隔單位的次數。
				其數值可以為正數(可得未來日期)，亦可以為負數(可得過去的日期)。 

設定
	引數 interval 的設定值如下:
	設定	說明			設定	說明
	yyyy	西元年			w		一週的日數
	q		季 				ww		週        
	m		月 				h		時        
	y		一年的日數 		n		分        
	d		日 				s		秒        

註解
	您可以使用 DateAdd 函數計算基準日期加上或減去您所指定的時間間隔後的結果。
	例如，您可以用 DateAdd 來計算從今天起三十天後或三十天前的日期是那一天；
	或者計算距離現在 45 分鐘前或 45 分鐘後的時間。
	如果時間間隔是以 [天] 來計算，interval 引數可以是 [一年的日數] ("y")，[日] ("d")，或 [一週的日數] ("w")。
\****************************************************************************************/
if (isUndefined(Date.prototype.DateAdd) == true) {
	Date.prototype.DateAdd = function (interval, number) {
		var nd = new Date(this);
		switch (interval) {
			case 'y':
			case 'd':
			case 'w':
				nd.setDate(nd.getDate() + number);
				break;
			case 'yyyy':
				nd.setYear(nd.getFullYear() + number);
				break;
			case 'q':
				nd.setMonth(nd.getMonth() + number * 3);
				break;
			case 'm':
				nd.setMonth(nd.getMonth() + number);
				break;
			case 'ww':
				nd.setDate(nd.getDate() + number * 7);
				break;
			case 'h':
				nd.setHour(nd.getHours() + number);
				break;
			case 'n':
				nd.setMinutes(nd.getMinutes() + number);
				break;
			case 's':
				nd.setSeconds(nd.getSeconds() + number);
				break;
			default:
		}
		return nd;
	};
}

/****************************************************************************************\
Date.toFormatString(interval, isAddZeroChar, index, iLength)
說明 
	傳回格式化的日期字串。

語法
	object.toFormatString(interval, isAddZeroChar, index, iLength)
	參數			說明 
	interval		必要項。字串運算式，表示所要回傳的方式。其值請參考設定部份。
	isAddZeroChar	必要項。布林運算式，表示是否以雙位數字回傳；即只有個位數時，於十位數補零。
	index			非必要項。數值運算式，要回傳字串的起始索引值，由零開始；預設為0。
					當index小於零時，則由右邊起算傳回特定數量的字元。
	iLength			非必要項。數值運算式，要回傳字串的長度；預設為字串原長度。

設定
	引數 interval 的設定值如下:
	設定	說明											備註
	ed		yyyy/mm/dd										
	et24	hh:nn:ss										(24hr)
	et12	hh:nn:ss am/pm									(12hr)
	edt24	yyyy/mm/dd hh:nn:ss								(24hr)
	edt12	yyyy/mm/dd hh:nn:ss	am/pm						(12hr)
	cd		yyyy年mm月dd日
	ct24	hh時nn分ss秒									(24hr)
	ct12	上午/下午 hh時nn分ss秒							(12hr)
	ct12e	上午/下午 hh:nn:ss								(12hr)
	cdt24	yyyy年mm月dd日 hh時nn分ss秒						(24hr)
	cdt12	yyyy年mm月dd日 上午/下午 hh時nn分ss秒			(12hr)
	td		民國yyy年mm月dd日
	tdt24	民國yyy年mm月dd日 hh時nn分ss秒					(24hr)
	tdt12	民國yyy年mm月dd日 上午/下午 hh時nn分ss秒		(12hr)
	esd		mm/dd
	csd		mm月dd日
備註
	以日期時間Wed Mar-9-2005 14:6:43為例：
	當interval為ed、isAddZeroChar為true時，將回傳2005/03/09；
	當interval為ed、isAddZeroChar為false時，將回傳2005/3/9；
	當interval為cdt24、isAddZeroChar為false時，將回傳2005年3月9日 14時6分43秒。
\****************************************************************************************/
if (isUndefined(Date.prototype.toFormatString) == true) {
	Date.prototype.toFormatString = function (interval, isAddZeroChar, index, iLength) {
		var n = new Date(this);
		var s = '';
		var t = '';
		switch (interval) {
			case 'ed':
			case 'edt24':
			case 'edt12':
				s = n.getFullYear() + '/' + 
					(isAddZeroChar ? (new String(n.getMonth() + 101).substr(1, 2)) : (n.getMonth() + 1)) + '/' + 
					(isAddZeroChar ? (new String(n.getDate() + 100).substr(1, 2)) : (n.getDate()));
				break;
			case 'cd':
			case 'cdt24':
			case 'cdt12':
				s = n.getFullYear() + '年' + 
					(isAddZeroChar ? (new String(n.getMonth() + 101).substr(1, 2)) : (n.getMonth() + 1)) + '月' + 
					(isAddZeroChar ? (new String(n.getDate() + 100).substr(1, 2)) : (n.getDate())) + '日';
				break;
			case 'td':
			case 'tdt24':
			case 'tdt12':
				if (isAddZeroChar) {
					s = '民國' + new String(n.getFullYear() - 911).substr(1, 3) + '年' +
						new String(n.getMonth() + 101).substr(1, 2) + '月' + 
						new String(n.getDate() + 100).substr(1, 2) + '日';
				} else {
					s = '民國' + (n.getFullYear() - 1911) + '年' + (n.getMonth() + 1) + '月' + n.getDate() + '日';
				}
				break;
			case 'esd':
				if (isAddZeroChar) {
					s = new String(n.getMonth() + 101).substr(1, 2) + '/' + new String(n.getDate() + 100).substr(1, 2);
				} else {
					s = (n.getMonth() + 1) + '/' + n.getDate();
				}
				break;
			case 'csd':
				if (isAddZeroChar) {
					s = new String(n.getMonth() + 101).substr(1, 2) + '月' + 
						new String(n.getDate() + 100).substr(1, 2) + '日';
				} else {
					s = (n.getMonth() + 1) + '月' + n.getDate() + '日';
				}
				break;
			default:
				break;
		}
		var hh = n.getHours();
		var h1 = (isAddZeroChar ? new String(hh + 100).substr(1, 2) : hh);
		var h2 = hh % 12;
		if (h2 == 0) {
			h2 = 12;
		} else {
			h2 = (isAddZeroChar ? new String(h2 + 100).substr(1, 2) : h2);
		}
		var nn = (isAddZeroChar ? new String(n.getMinutes() + 100).substr(1, 2) : n.getMinutes());
		var ss = (isAddZeroChar ? new String(n.getSeconds() + 100).substr(1, 2) : n.getSeconds());
		switch (interval) {
			case 'et24':
			case 'edt24':
				t = h1 + ':' + nn + ':' + ss;
				break;
			case 'et12':
			case 'edt12':
				t = h2 + ':' + nn + ':' + ss + ' ' + ((Math.floor(hh / 12) == 0) ? 'AM' : 'PM');
				break;
			case 'ct24':
			case 'cdt24':
			case 'tdt24':
				t = h1 + '時' + nn + '分' + ss + '秒';
				break;
			case 'ct12':
			case 'cdt12':
			case 'tdt12':
				t = ((Math.floor(hh / 12) == 0) ? '上午' : '下午') + ' ' + h2 + '時' + nn + '分' + ss + '秒';
				break;
			case 'ct12e':
				t = ((Math.floor(hh / 12) == 0) ? '上午' : '下午') + ' ' + h2 + ':' + nn + ':' + ss;
			default:
		}
		switch (interval) {
			case 'edt24':
			case 'cdt24':
			case 'tdt24':
			case 'edt12':
			case 'cdt12':
			case 'tdt12':
				s += ' ' + t;
				break;
			case 'ed':
			case 'cd':
			case 'td':
			case 'esd':
			case 'csd':
				break;
			default:
				s = t;
		}
		if (typeof(index) == 'undefined') index = 0;
		if (index < 0) index = s.length + index;
		if (typeof(iLength) == 'undefined') iLength = s.length - index;
		if (iLength > s.length - index) iLength = s.length;
		return s.substr(index, iLength);
	};
}

/****************************************************************************************\
Date.toFormat(interval)
說明 
	傳回使用者定義日期/時間格式字串。

語法
	object.toFormat(interval)
	參數			說明 
	interval		必要項。字串運算式，表示所要回傳的方式。其值請參考設定部份。

設定
	yy		將年份顯示成兩位數的數值格式，並且加上前置零 (如果需要的話)。  
	yyy		將年份顯示成四位數的數值格式。 
	yyyy	將年份顯示成四位數的數值格式。 
	d		將日期顯示成數字，且不需要前置零 (例如，1)。如果這是使用者定義數值格式中的唯一字元，請使用 %d。 
	dd		將日期顯示成數字，並且加上前置零 (例如，01)。 
	ddd		用縮寫來顯示星期幾 (例如，Sun)。 
	dddd	用完整名稱來顯示星期幾 (例如，Sunday)。 
	m		將月份顯示成數字，且不需要前置零 (例如，以 1 表示一月)。如果這是使用者定義數值格式中的唯一字元，請使用 %m。 
	mm		將月份顯示成數字，並且加上前置零 (例如，01/12/01)。  
	mmm		用縮寫來顯示月份 (例如，Jan)。 
	mmmm	用完整名稱來顯示月份 (例如，January)。 
	h		使用 12 小時制將小時顯示成數字，且不需要前置零 (例如，1:15:15 PM)。如果這是使用者定義數值格式中的唯一字元，請使用 %h。 
	hh		使用 12 小時制將小時顯示成數字，並且加上前置零 (例如，01:15:15 PM)。 
	H		使用 24 小時制將小時顯示成數字，且不需要前置零 (例如：1:15:15)。如果這是使用者定義數值格式中的唯一字元，請使用 %H。 
	HH		使用 24 小時制將小時顯示成數字，並且加上前置零 (例如：01:15:15)。 
	n		將分鐘顯示成數字，且不需要前置零 (例如，12:1:15)。如果這是使用者定義數值格式中的唯一字元，請使用 %n。 
	nn		將分鐘顯示成數字，並且加上前置零 (例如，12:01:15)。 
	s		將秒數顯示成數字，且不需要前置零 (例如，12:15:5)。如果這是使用者定義數值格式中的唯一字元，請使用 %s。 
	ss		將秒數顯示成數字，並且加上前置零 (例如，12:15:05)。 
	T		使用 12 小時制，並且在正午之前的任何小時加上顯示大寫 A；在正午與 11:59 PM 之前的任何小時加上顯示大寫 P。如果這是使用者定義數值格式中的唯一字元，請使用 %T。 
	TT		使用 12 小時制，並且在正午之前的任何小時加上顯示大寫 AM；在正午與 11:59 PM 之前的任何小時加上顯示大寫 PM。 
	t		使用 12 小時制，並且在正午之前的任何小時加上顯示小寫 a；在正午與 11:59 PM 之前的任何小時加上顯示小寫 p。如果這是使用者定義數值格式中的唯一字元，請使用 %t。 
	tt		使用 12 小時制，並且在正午之前的任何小時加上顯示小寫 am；在正午與 11:59 PM 之前的任何小時加上顯示小寫 pm。 
	z		顯示時區時差，且不需要前置零 (例如，-8)。如果這是使用者定義數值格式中的唯一字元，請使用 %z。 
	zz		顯示時區時差，並且加上前置零 (例如，-08) 
	zzz		顯示完整時區時差 (例如，-08:00) 
\****************************************************************************************/

if (isUndefined(Date.prototype.toFormat) == true) {
	Date.prototype.toFormat = function (interval) {
		var s = interval;
		var n = new Date(this);
		if (s.indexOf('yyyy', 0) != -1) {
			s = s.replace(/yyyy/g, n.getFullYear());
		} else if (s.indexOf('yyy', 0) != -1) {
			s = s.replace(/yyy/g, n.getFullYear() - 1911);
		} else if (s.indexOf('yy', 0) != -1) {
			s = s.replace(/yy/g, new String(n.getFullYear()).substr(2, 2));
		} 
		if (s.indexOf('mmmm', 0) != -1) {
			s = s.replace(/mmmm/g, n.getMonthString(false));
		} else if (s.indexOf('mmm', 0) != -1) {
			s = s.replace(/mmm/g, n.getMonthString(true));
		} else if (s.indexOf('mm', 0) != -1) {
			s = s.replace(/mm/g, new String(n.getMonth() + 101).substr(1, 2));
		} else if (s.indexOf('%m', 0) != -1) {
			return n.getMonth() + 1;
		} else if (s.indexOf('m', 0) != -1) {
			s = s.replace(/m/g, (n.getMonth() + 1));
		}
		if (s.indexOf('dddd', 0) != -1) {
			s = s.replace(/dddd/g, n.getWeekString(false));
		} else if (s.indexOf('ddd', 0) != -1) {
			s = s.replace(/ddd/g, n.getWeekString(true));
		} else if (s.indexOf('dd', 0) != -1) {
			s = s.replace(/dd/g, new String(n.getDate() + 100).substr(1, 2));
		} else if (s.indexOf('%d', 0) != -1) {
			return n.getDate();
		} else if (s.indexOf('d', 0) != -1) {
			s = s.replace(/d/g, n.getDate());
		}
		if (s.indexOf('hh', 0) != -1) {
			s = s.replace(/hh/g, ((n.getHours() % 12 == 0) ? '12' : new String(n.getHours() % 12 + 100).substr(1, 2)));
		} else if (s.indexOf('%h', 0) != -1) {
			return ((n.getHours() % 12 == 0) ? '12' : n.getHours() % 12);
		} else if (s.indexOf('h', 0) != -1) {
			s = s.replace(/h/g, ((n.getHours() % 12 == 0) ? '12' : n.getHours() % 12));
		} else if (s.indexOf('HH', 0) != -1) {
			s = s.replace(/HH/g, new String(n.getHours() + 100).substr(1, 2));
		} else if (s.indexOf('%H', 0) != -1) {
			return n.getHours();
		} else if (s.indexOf('H', 0) != -1) {
			s = s.replace(/H/g, n.getHours());
		}
		if (s.indexOf('nn', 0) != -1) {
			s = s.replace(/nn/g, new String(n.getMinutes() + 100).substr(1, 2));
		} else if (s.indexOf('%n', 0) != -1) {
			return n.getMinutes();
		} else if (s.indexOf('n', 0) != -1) {
			s = s.replace(/n/g, n.getMinutes());
		}
		if (s.indexOf('ss', 0) != -1) {
			s = s.replace(/ss/g, new String(n.getSeconds() + 100).substr(1, 2));
		} else if (s.indexOf('%s', 0) != -1) {
			return n.getSeconds();
		} else if (s.indexOf('s', 0) != -1) {
			s = s.replace(/s/g, n.getSeconds());
		}
		if (s.indexOf('TT', 0) != -1) {
			s = s.replace(/TT/g, ((n.getHours() < 12) ? 'AM' : 'PM'));
		} else if (s.indexOf('%T', 0) != -1) {
			return ((n.getHours() < 12) ? 'A' : 'P');
		} else if (s.indexOf('T', 0) != -1) {
			s = s.replace(/T/g, ((n.getHours() < 12) ? 'A' : 'P'));
		} else if (s.indexOf('tt', 0) != -1) {
			s = s.replace(/tt/g, ((n.getHours() < 12) ? 'am' : 'pm'));
		} else if (s.indexOf('%t', 0) != -1) {
			return ((n.getHours() < 12) ? 'a' : 'p');
		} else if (s.indexOf('t', 0) != -1) {
			s = s.replace(/t/g, ((n.getHours() < 12) ? 'a' : 'p'));
		}
		var u = '';
		if (n.getTime() > new Date(n.toUTCString()).getTime()) {
			u = '+';
			var utc = n.getTime() - new Date(n.toUTCString()).getTime();
		} else {
			u = '-';
			var utc = new Date(n.toUTCString()).getTime() - n.getTime();
		}
		if (s.indexOf('zzz', 0) != -1) {
			s = s.replace(/zzz/g, u + new String(utc.getHours() + 100).substr(1, 2) + ':' + new String(utc.getMinutes()).substr(1, 2));
		} else if (s.indexOf('zz', 0) != -1) {
			s = s.replace(/zz/g, u + new String(utc.getHours() + 100).substr(1, 2));
		} else if (s.indexOf('%z', 0) != -1) {
			return (u + utc.getHours());
		} else if (s.indexOf('z', 0) != -1) {
			s = s.replace(/z/g, u + utc.getHours());
		}
		return s;
	};
}


/****************************************************************************************\
Date.getMonthString(bShort)
說明 
	傳回月份字串。

語法
	object.getMonthString(bShort)
	參數			說明 
	bShort			必要項。布林運算式，表示回傳方式是否為簡稱格式。
\****************************************************************************************/
if (isUndefined(Date.prototype.getMonthString) == true) {
	Date.prototype.getMonthString = function (bShort) {
		var ms = new Array('January', 'February', 'March', 'April', 'May', 'June', 
						   'July', 'August', 'September', 'October', 'November', 'December');
		if (bShort) {
			return ms[this.getMonth()].substr(0, 3);
		} else {
			return ms[this.getMonth()];
		}
	};
}

/****************************************************************************************\
Date.getWeekString(bShort)
說明 
	傳回星期字串。

語法
	object.getWeekString(bShort)
	參數			說明 
	bShort			必要項。布林運算式，表示回傳方式是否為簡稱格式。
\****************************************************************************************/
if (isUndefined(Date.prototype.getWeekString) == true) {
	Date.prototype.getWeekString = function (bShort) {
		var ws = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
		if (bShort) {
			return ws[this.getDay()].substr(0, 3);
		} else {
			return ws[this.getDay()];
		}
	};
}

/****************************************************************************************\
Date.getWeekNo()
說明 
	傳回週別。第一週索引值為零。

語法
	object.getWeekNo()
\****************************************************************************************/
if (isUndefined(Date.prototype.getWeekNo) == true) {
	Date.prototype.getWeekNo = function () {
		var n = new Date(this);
		var firstDay = new Date(n.getFullYear() + '/1/1');
		var iWeek = Math.ceil((n.getDayNo() - ((7 - firstDay.getDay()) % 7)) / 7);	// Week No. (First Index Is 0)
		return iWeek;
	};
}

/****************************************************************************************\
Date.getChtWeek()
說明 
	傳回中文星期字串。

語法
	object.getChtWeek()
\****************************************************************************************/
if (isUndefined(Date.prototype.getChtWeek) == true) {
	Date.prototype.getChtWeek = function () {
		var cws = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
		return cws[this.getDay()];
	};
}

/****************************************************************************************\
Date.getDayMilliseconds()
說明 
	傳回一天的豪秒數。

語法
	object.getDayMilliseconds()
\****************************************************************************************/
if (isUndefined(Date.prototype.getDayMilliseconds) == true) {
	Date.prototype.getDayMilliseconds = function () {
		return 24 * 60 * 60 * 1000;
	};
}

/****************************************************************************************\
Date.getDayNo()
說明 
	傳回該年到當日的天數。一月一日為第一天。

語法
	object.getDayNo()
\****************************************************************************************/
if (isUndefined(Date.prototype.getDayNo) == true) {
	Date.prototype.getDayNo = function () {
		var n = new Date(this);
		var firstDay = new Date(n.getFullYear() + '/1/1');
		var iDay = Math.ceil((n.getTime() - firstDay.getTime()) / n.getDayMilliseconds()); // Day No.(First Index Is 1)
		return iDay;
	};
}

/****************************************************************************************\
Date.DateDiff(interval, dateValue)
說明 
	傳回本體(this)與傳入日期間相差的時間間隔單位數目。

語法
	object.DateDiff(interval, dateValue)
	DateDiff 函數語法中有下列幾部份：

	組成部分	說明  
	interval	必要項。字串運算式，用來計算本體及 dateValue 之時間差的時間間隔單位。請參閱設定部份。 
	dateValue	必要項。日期運算式。您要用來計算的日期。 

設定
	引數 interval 的設定值如下:
	設定	說明			設定	說明
	yyyy	西元年			w		一週的日數
	q		季 				ww		週        
	m		月 				h		時        
	y		一年的日數 		n		分        
	d		日 				s		秒        

註解
	您可以使用 DateDiff 函數來決定兩個日期之間的時間間隔單位數目。
	例如，您可以使用 DateDiff 來計算某兩個日期之間相隔幾日，或計算從今天起到年底還有多少個星期。

	如果想知道本體與 dateValue 相差的 [日] 數，interval 可以是 [一年的日數] ("y") 或 [日] ("d")。
	如果 interval 是 [一週的日數] ("w")，DateDiff 會傳回兩日期間相差的週數。
	如果本體是星期一，DateDiff 會計算到 dateValue 為止之星期一的個數，包含 dateValue 但不包含本體。
	不過，如果 interval 是 [週] ("ww")，DateDiff 函數會藉由計算本體與 dateValue 之間星期天的個數，會傳回兩日期間的 [日歷週] 數。
	如果 dateValue 剛好是星期天，則 dateValue 也會被加進計數結果中；但不論本體是否為星期天，它都不會被算進去。

	如果本體比 dateValue 來得晚，DateDiff 函數傳回值為負數。

	但若計算十二月三十一日和來年的一月一日的年份差，DateDiff 會傳回 1 表示相差一個年份，雖然實際上只相差一天而已。 

	以下範例即使用 DateDiff 函數來表示指定的日期與今天相差的天數： 

	alert('Days from today: ' + new Date('2005/01/01').DiffDate('d', new Date()));
\****************************************************************************************/
if (isUndefined(Date.prototype.DateDiff) == true) {
	Date.prototype.DateDiff = function (interval, dateValue) {
		var n = new Date(this);
		var d = new Date(dateValue);
		switch (interval) {
			case 'yyyy':
				return d.getFullYear() - n.getFullYear();
				break;
			case 'q':
				return Math.ceil((d.getMonth() + 1) / 3) - Math.ceil((n.getMonth() + 1) / 3) ;
				break;
			case 'm':
				return d.getMonth() - n.getMonth();
				break;
			case 'y':
			case 'd':
			case 'w':
				return Math.floor((d.getTime() - n.getTime()) / n.getDayMilliseconds());
				break;
			case 'ww':
				var fWeek = new Date(n.DateAdd('d', (7 - n.getDay()) % 7));
				return Math.floor(fWeek.DateDiff('d', dateValue) / 7);
				break;
			case 'h':
				return Math.floor((d.getTime() - n.getTime()) / (n.getDayMilliseconds() / 24));
				break;
			case 'n':
				return Math.floor((d.getTime() - n.getTime()) / (n.getDayMilliseconds() / 24 / 60));
				break;
			case 's':
				return Math.floor((d.getTime() - n.getTime()) / 1000);
				break;
			default:
				break;
		}
	};
}

