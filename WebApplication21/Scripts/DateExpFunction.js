var undefined;

function isUndefined(property) {
  return (typeof property == 'undefined');
}

/****************************************************************************************\
Date.DateAdd(interval, number)
���� 
	�Ǧ^���e���Y�Ӱ�Ǥ���[�W�ƭӮɶ����j���᪺����C 

�y�k
	object.DateAdd(interval, number)
	�Ѽ�		���� 
	interval	���n���C�r��B�⦡�A��ܩҭn�[�W�h���ɶ����j���C��ȽаѦҳ]�w�����C 
	number		���n���C�ƭȹB�⦡�A��ܭn�[�W���ɶ����j��쪺���ơC
				��ƭȥi�H������(�i�o���Ӥ��)�A��i�H���t��(�i�o�L�h�����)�C 

�]�w
	�޼� interval ���]�w�Ȧp�U:
	�]�w	����			�]�w	����
	yyyy	�褸�~			w		�@�g�����
	q		�u 				ww		�g        
	m		�� 				h		��        
	y		�@�~����� 		n		��        
	d		�� 				s		��        

����
	�z�i�H�ϥ� DateAdd ��ƭp���Ǥ���[�W�δ�h�z�ҫ��w���ɶ����j�᪺���G�C
	�Ҧp�A�z�i�H�� DateAdd �ӭp��q���Ѱ_�T�Q�ѫ�ΤT�Q�ѫe������O���@�ѡF
	�Ϊ̭p��Z���{�b 45 �����e�� 45 �����᪺�ɶ��C
	�p�G�ɶ����j�O�H [��] �ӭp��Ainterval �޼ƥi�H�O [�@�~�����] ("y")�A[��] ("d")�A�� [�@�g�����] ("w")�C
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
���� 
	�Ǧ^�榡�ƪ�����r��C

�y�k
	object.toFormatString(interval, isAddZeroChar, index, iLength)
	�Ѽ�			���� 
	interval		���n���C�r��B�⦡�A��ܩҭn�^�Ǫ��覡�C��ȽаѦҳ]�w�����C
	isAddZeroChar	���n���C���L�B�⦡�A��ܬO�_�H����Ʀr�^�ǡF�Y�u���Ӧ�ƮɡA��Q��Ƹɹs�C
	index			�D���n���C�ƭȹB�⦡�A�n�^�Ǧr�ꪺ�_�l���ޭȡA�ѹs�}�l�F�w�]��0�C
					��index�p��s�ɡA�h�ѥk��_��Ǧ^�S�w�ƶq���r���C
	iLength			�D���n���C�ƭȹB�⦡�A�n�^�Ǧr�ꪺ���סF�w�]���r�����סC

�]�w
	�޼� interval ���]�w�Ȧp�U:
	�]�w	����											�Ƶ�
	ed		yyyy/mm/dd										
	et24	hh:nn:ss										(24hr)
	et12	hh:nn:ss am/pm									(12hr)
	edt24	yyyy/mm/dd hh:nn:ss								(24hr)
	edt12	yyyy/mm/dd hh:nn:ss	am/pm						(12hr)
	cd		yyyy�~mm��dd��
	ct24	hh��nn��ss��									(24hr)
	ct12	�W��/�U�� hh��nn��ss��							(12hr)
	ct12e	�W��/�U�� hh:nn:ss								(12hr)
	cdt24	yyyy�~mm��dd�� hh��nn��ss��						(24hr)
	cdt12	yyyy�~mm��dd�� �W��/�U�� hh��nn��ss��			(12hr)
	td		����yyy�~mm��dd��
	tdt24	����yyy�~mm��dd�� hh��nn��ss��					(24hr)
	tdt12	����yyy�~mm��dd�� �W��/�U�� hh��nn��ss��		(12hr)
	esd		mm/dd
	csd		mm��dd��
�Ƶ�
	�H����ɶ�Wed Mar-9-2005 14:6:43���ҡG
	��interval��ed�BisAddZeroChar��true�ɡA�N�^��2005/03/09�F
	��interval��ed�BisAddZeroChar��false�ɡA�N�^��2005/3/9�F
	��interval��cdt24�BisAddZeroChar��false�ɡA�N�^��2005�~3��9�� 14��6��43��C
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
				s = n.getFullYear() + '�~' + 
					(isAddZeroChar ? (new String(n.getMonth() + 101).substr(1, 2)) : (n.getMonth() + 1)) + '��' + 
					(isAddZeroChar ? (new String(n.getDate() + 100).substr(1, 2)) : (n.getDate())) + '��';
				break;
			case 'td':
			case 'tdt24':
			case 'tdt12':
				if (isAddZeroChar) {
					s = '����' + new String(n.getFullYear() - 911).substr(1, 3) + '�~' +
						new String(n.getMonth() + 101).substr(1, 2) + '��' + 
						new String(n.getDate() + 100).substr(1, 2) + '��';
				} else {
					s = '����' + (n.getFullYear() - 1911) + '�~' + (n.getMonth() + 1) + '��' + n.getDate() + '��';
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
					s = new String(n.getMonth() + 101).substr(1, 2) + '��' + 
						new String(n.getDate() + 100).substr(1, 2) + '��';
				} else {
					s = (n.getMonth() + 1) + '��' + n.getDate() + '��';
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
				t = h1 + '��' + nn + '��' + ss + '��';
				break;
			case 'ct12':
			case 'cdt12':
			case 'tdt12':
				t = ((Math.floor(hh / 12) == 0) ? '�W��' : '�U��') + ' ' + h2 + '��' + nn + '��' + ss + '��';
				break;
			case 'ct12e':
				t = ((Math.floor(hh / 12) == 0) ? '�W��' : '�U��') + ' ' + h2 + ':' + nn + ':' + ss;
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
���� 
	�Ǧ^�ϥΪ̩w�q���/�ɶ��榡�r��C

�y�k
	object.toFormat(interval)
	�Ѽ�			���� 
	interval		���n���C�r��B�⦡�A��ܩҭn�^�Ǫ��覡�C��ȽаѦҳ]�w�����C

�]�w
	yy		�N�~����ܦ����ƪ��ƭȮ榡�A�åB�[�W�e�m�s (�p�G�ݭn����)�C  
	yyy		�N�~����ܦ��|��ƪ��ƭȮ榡�C 
	yyyy	�N�~����ܦ��|��ƪ��ƭȮ榡�C 
	d		�N�����ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�A1)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %d�C 
	dd		�N�����ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�A01)�C 
	ddd		���Y�g����ܬP���X (�Ҧp�ASun)�C 
	dddd	�Χ���W�٨���ܬP���X (�Ҧp�ASunday)�C 
	m		�N�����ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�A�H 1 ��ܤ@��)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %m�C 
	mm		�N�����ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�A01/12/01)�C  
	mmm		���Y�g����ܤ�� (�Ҧp�AJan)�C 
	mmmm	�Χ���W�٨���ܤ�� (�Ҧp�AJanuary)�C 
	h		�ϥ� 12 �p�ɨ�N�p����ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�A1:15:15 PM)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %h�C 
	hh		�ϥ� 12 �p�ɨ�N�p����ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�A01:15:15 PM)�C 
	H		�ϥ� 24 �p�ɨ�N�p����ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�G1:15:15)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %H�C 
	HH		�ϥ� 24 �p�ɨ�N�p����ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�G01:15:15)�C 
	n		�N������ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�A12:1:15)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %n�C 
	nn		�N������ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�A12:01:15)�C 
	s		�N�����ܦ��Ʀr�A�B���ݭn�e�m�s (�Ҧp�A12:15:5)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %s�C 
	ss		�N�����ܦ��Ʀr�A�åB�[�W�e�m�s (�Ҧp�A12:15:05)�C 
	T		�ϥ� 12 �p�ɨ�A�åB�b���Ȥ��e������p�ɥ[�W��ܤj�g A�F�b���ȻP 11:59 PM ���e������p�ɥ[�W��ܤj�g P�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %T�C 
	TT		�ϥ� 12 �p�ɨ�A�åB�b���Ȥ��e������p�ɥ[�W��ܤj�g AM�F�b���ȻP 11:59 PM ���e������p�ɥ[�W��ܤj�g PM�C 
	t		�ϥ� 12 �p�ɨ�A�åB�b���Ȥ��e������p�ɥ[�W��ܤp�g a�F�b���ȻP 11:59 PM ���e������p�ɥ[�W��ܤp�g p�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %t�C 
	tt		�ϥ� 12 �p�ɨ�A�åB�b���Ȥ��e������p�ɥ[�W��ܤp�g am�F�b���ȻP 11:59 PM ���e������p�ɥ[�W��ܤp�g pm�C 
	z		��ܮɰϮɮt�A�B���ݭn�e�m�s (�Ҧp�A-8)�C�p�G�o�O�ϥΪ̩w�q�ƭȮ榡�����ߤ@�r���A�Шϥ� %z�C 
	zz		��ܮɰϮɮt�A�åB�[�W�e�m�s (�Ҧp�A-08) 
	zzz		��ܧ���ɰϮɮt (�Ҧp�A-08:00) 
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
���� 
	�Ǧ^����r��C

�y�k
	object.getMonthString(bShort)
	�Ѽ�			���� 
	bShort			���n���C���L�B�⦡�A��ܦ^�Ǥ覡�O�_��²�ٮ榡�C
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
���� 
	�Ǧ^�P���r��C

�y�k
	object.getWeekString(bShort)
	�Ѽ�			���� 
	bShort			���n���C���L�B�⦡�A��ܦ^�Ǥ覡�O�_��²�ٮ榡�C
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
���� 
	�Ǧ^�g�O�C�Ĥ@�g���ޭȬ��s�C

�y�k
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
���� 
	�Ǧ^����P���r��C

�y�k
	object.getChtWeek()
\****************************************************************************************/
if (isUndefined(Date.prototype.getChtWeek) == true) {
	Date.prototype.getChtWeek = function () {
		var cws = new Array('�P����', '�P���@', '�P���G', '�P���T', '�P���|', '�P����', '�P����');
		return cws[this.getDay()];
	};
}

/****************************************************************************************\
Date.getDayMilliseconds()
���� 
	�Ǧ^�@�Ѫ�����ơC

�y�k
	object.getDayMilliseconds()
\****************************************************************************************/
if (isUndefined(Date.prototype.getDayMilliseconds) == true) {
	Date.prototype.getDayMilliseconds = function () {
		return 24 * 60 * 60 * 1000;
	};
}

/****************************************************************************************\
Date.getDayNo()
���� 
	�Ǧ^�Ӧ~���骺�ѼơC�@��@�鬰�Ĥ@�ѡC

�y�k
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
���� 
	�Ǧ^����(this)�P�ǤJ������ۮt���ɶ����j���ƥءC

�y�k
	object.DateDiff(interval, dateValue)
	DateDiff ��ƻy�k�����U�C�X�����G

	�զ�����	����  
	interval	���n���C�r��B�⦡�A�Ψӭp�⥻��� dateValue ���ɶ��t���ɶ����j���C�аѾ\�]�w�����C 
	dateValue	���n���C����B�⦡�C�z�n�Ψӭp�⪺����C 

�]�w
	�޼� interval ���]�w�Ȧp�U:
	�]�w	����			�]�w	����
	yyyy	�褸�~			w		�@�g�����
	q		�u 				ww		�g        
	m		�� 				h		��        
	y		�@�~����� 		n		��        
	d		�� 				s		��        

����
	�z�i�H�ϥ� DateDiff ��ƨӨM�w��Ӥ���������ɶ����j���ƥءC
	�Ҧp�A�z�i�H�ϥ� DateDiff �ӭp��Y��Ӥ�������۹j�X��A�έp��q���Ѱ_��~���٦��h�֭ӬP���C

	�p�G�Q���D����P dateValue �ۮt�� [��] �ơAinterval �i�H�O [�@�~�����] ("y") �� [��] ("d")�C
	�p�G interval �O [�@�g�����] ("w")�ADateDiff �|�Ǧ^�������ۮt���g�ơC
	�p�G����O�P���@�ADateDiff �|�p��� dateValue ����P���@���ӼơA�]�t dateValue �����]�t����C
	���L�A�p�G interval �O [�g] ("ww")�ADateDiff ��Ʒ|�ǥѭp�⥻��P dateValue �����P���Ѫ��ӼơA�|�Ǧ^�������� [����g] �ơC
	�p�G dateValue ��n�O�P���ѡA�h dateValue �]�|�Q�[�i�p�Ƶ��G���F�����ץ���O�_���P���ѡA�������|�Q��i�h�C

	�p�G����� dateValue �ӱo�ߡADateDiff ��ƶǦ^�Ȭ��t�ơC

	���Y�p��Q�G��T�Q�@��M�Ӧ~���@��@�骺�~���t�ADateDiff �|�Ǧ^ 1 ��ܬۮt�@�Ӧ~���A���M��ڤW�u�ۮt�@�ѦӤw�C 

	�H�U�d�ҧY�ϥ� DateDiff ��ƨӪ�ܫ��w������P���Ѭۮt���ѼơG 

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

