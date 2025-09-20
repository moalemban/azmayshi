"use client";

import React, { useState, useMemo, useRef, createRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, CheckCircle, XCircle, MapPin, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationResult {
  isValid: boolean;
  message: string;
  province?: string;
  city?: string;
}

const cityCodes: { [key: string]: { province: string; city: string } } = {
    "001": { province: "تهران", city: "حوزه شمیران" },
    "002": { province: "تهران", city: "حوزه شمیران" },
    "003": { province: "تهران", city: "تهران" },
    "004": { province: "تهران", city: "تهران" },
    "005": { province: "تهران", city: "تهران" },
    "006": { province: "تهران", city: "تهران" },
    "007": { province: "تهران", city: "توابع تهران" },
    "008": { province: "تهران", city: "توابع تهران" },
    "010": { province: "تهران", city: "دماوند" },
    "011": { province: "تهران", city: "دماوند" },
    "012": { province: "تهران", city: "ورامین" },
    "013": { province: "تهران", city: "ورامین" },
    "014": { province: "تهران", city: "ساوجبلاغ" },
    "015": { province: "تهران", city: "کرج" },
    "016": { province: "تهران", city: "کرج" },
    "017": { province: "تهران", city: "شهریار" },
    "018": { province: "تهران", city: "شهریار" },
    "019": { province: "تهران", city: "رباط کریم" },
    "020": { province: "تهران", city: "رباط کریم" },
    "021": { province: "تهران", city: "شهر ری" },
    "022": { province: "تهران", city: "شهر ری" },
    "023": { province: "تهران", city: "اسلامشهر" },
    "024": { province: "تهران", city: "اسلامشهر" },
    "025": { province: "آذربایجان شرقی", city: "آذرشهر" },
    "026": { province: "آذربایجان شرقی", city: "اسکو" },
    "027": { province: "آذربایجان شرقی", city: "اهر" },
    "028": { province: "آذربایجان شرقی", city: "بستان آباد" },
    "029": { province: "آذربایجان شرقی", city: "بناب" },
    "030": { province: "آذربایجان شرقی", city: "تبریز" },
    "031": { province: "آذربایجان شرقی", city: "ترکمانچای" },
    "032": { province: "آذربایجان شرقی", city: "جلفا" },
    "033": { province: "آذربایجان شرقی", city: "چاروایماق" },
    "034": { province: "آذربایجان شرقی", city: "سراب" },
    "035": { province: "آذربایجان شرقی", city: "شبستر" },
    "036": { province: "آذربایجان شرقی", city: "عجب شیر" },
    "037": { province: "آذربایجان شرقی", city: "کلیبر" },
    "038": { province: "آذربایجان شرقی", city: "مراغه" },
    "039": { province: "آذربایجان شرقی", city: "مرند" },
    "040": { province: "آذربایجان شرقی", city: "ملکان" },
    "041": { province: "آذربایجان شرقی", city: "میانه" },
    "042": { province: "آذربایجان شرقی", city: "ورزقان" },
    "043": { province: "آذربایجان شرقی", city: "هریس" },
    "044": { province: "آذربایجان شرقی", city: "هشترود" },
    "045": { province: "آذربایجان شرقی", city: "هوراند" },
    "046": { province: "آذربایجان غربی", city: "ارومیه" },
    "047": { province: "آذربایجان غربی", city: "اشنویه" },
    "048": { province: "آذربایجان غربی", city: "انزل" },
    "049": { province: "آذربایجان غربی", city: "بوکان" },
    "050": { province: "آذربایجان غربی", city: "پلدشت" },
    "051": { province: "آذربایجان غربی", city: "پیرانشهر" },
    "052": { province: "آذربایجان غربی", city: "تخت سلیمان" },
    "053": { province: "آذربایجان غربی", city: "تکاب" },
    "054": { province: "آذربایجان غربی", city: "چایپاره" },
    "055": { province: "آذربایجان غربی", city: "خوی" },
    "056": { province: "آذربایجان غربی", city: "سلماس" },
    "057": { province: "آذربایجان غربی", city: "سیلوانه" },
    "058": { province: "آذربایجان غربی", city: "سیه چشمه(چالدران)" },
    "059": { province: "آذربایجان غربی", city: "شوط" },
    "060": { province: "آذربایجان غربی", city: "شاهین دژ" },
    "061": { province: "آذربایجان غربی", city: "کشاورز" },
    "062": { province: "آذربایجان غربی", city: "ماکو" },
    "063": { province: "آذربایجان غربی", city: "مهاباد" },
    "064": { province: "آذربایجان غربی", city: "میاندوآب" },
    "065": { province: "آذربایجان غربی", city: "نقده" },
    "066": { province: "اردبیل", city: "اردبیل" },
    "067": { province: "اردبیل", city: "ارشق" },
    "068": { province: "اردبیل", city: "انگوت" },
    "069": { province: "اردبیل", city: "بیله سوار" },
    "070": { province: "اردبیل", city: "پارس آباد" },
    "071": { province: "اردبیل", city: "خلخال" },
    "072": { province: "اردبیل", city: "خورش رستم" },
    "073": { province: "اردبیل", city: "سرعین" },
    "074": { province: "اردبیل", city: "سنجبد(کوثر)" },
    "075": { province: "اردبیل", city: "مشکین شهر" },
    "076": { province: "اردبیل", city: "مغان" },
    "077": { province: "اردبیل", city: "نمین" },
    "078": { province: "اردبیل", city: "نیر" },
    "079": { province: "اصفهان", city: "آران و بیدگل" },
    "080": { province: "اصفهان", city: "اردستان" },
    "081": { province: "اصفهان", city: "اصفهان" },
    "082": { province: "اصفهان", city: "باغ بهادران" },
    "083": { province: "اصفهان", city: "بوئین و میاندشت" },
    "084": { province: "اصفهان", city: "تیران و کرون" },
    "085": { province: "اصفهان", city: "جرقویه" },
    "086": { province: "اصفهان", city: "چادگان" },
    "087": { province: "اصفهان", city: "خمینی شهر" },
    "088": { province: "اصفهان", city: "خوانسار" },
    "089": { province: "اصفهان", city: "خور و بیابانک" },
    "090": { province: "اصفهان", city: "دولت آباد" },
    "091": { province: "اصفهan", city: "سمیرم" },
    "092": { province: "اصفهان", city: "سمیرم سفلی (دهاقان)" },
    "093": { province: "اصفهان", city: "شاهین شهر" },
    "094": { province: "اصفهان", city: "شهرضا" },
    "095": { province: "اصفهان", city: "فریدن" },
    "096": { province: "اصفهان", city: "فریدونشهر" },
    "097": { province: "اصفهان", city: "فلاورجان" },
    "098": { province: "اصفهان", city: "کاشان" },
    "099": { province: "اصفهان", city: "کوهپایه" },
    "100": { province: "اصفهان", city: "گلپایگان" },
    "101": { province: "اصفهان", city: "لنجان(زرینشهر)" },
    "102": { province: "اصفهان", city: "مبارکه" },
    "103": { province: "اصفهان", city: "میمه" },
    "104": { province: "اصفهان", city: "نائین" },
    "105": { province: "اصفهان", city: "نجف آباد" },
    "106": { province: "اصفهان", city: "نطنز" },
    "107": { province: "البرز", city: "کرج" },
    "108": { province: "البرز", city: "نظرآباد" },
    "109": { province: "البرز", city: "طالقان" },
    "110": { province: "البرز", city: "ساوجبلاغ" },
    "111": { province: "ایلام", city: "آبدانان" },
    "112": { province: "ایلام", city: "ارکوازی(ملکشاهی)" },
    "113": { province: "ایلام", city: "ایلام" },
    "114": { province: "ایلام", city: "ایوان" },
    "115": { province: "ایلام", city: "بدره" },
    "116": { province: "ایلام", city: "دره شهر" },
    "117": { province: "ایلام", city: "دهلران" },
    "118": { province: "ایلام", city: "زرین آباد" },
    "119": { province: "ایلام", city: "شیروان لومار" },
    "120": { province: "ایلام", city: "شیروان و چرداول" },
    "121": { province: "ایلام", city: "موسیان" },
    "122": { province: "ایلام", city: "مهران" },
    "123": { province: "بوشهر", city: "بندر دیلم" },
    "124": { province: "بوشهر", city: "بندر گناوه" },
    "125": { province: "بوشهر", city: "بوشهر" },
    "126": { province: "بوشهر", city: "تنگستان" },
    "127": { province: "بوشهر", city: "جم" },
    "128": { province: "بوشهر", city: "دشتستان" },
    "129": { province: "بوشهر", city: "دشتی" },
    "130": { province: "بوشهر", city: "دلوار" },
    "131": { province: "بوشهر", city: "دیر" },
    "132": { province: "بوشهر", city: "سعد آباد" },
    "133": { province: "بوشهر", city: "شبانکاره" },
    "134": { province: "بوشهر", city: "کنگان" },
    "135": { province: "چهارمحال و بختیاری", city: "اردل" },
    "136": { province: "چهارمحال و بختیاری", city: "بروجن" },
    "137": { province: "چهارمحال و بختیاری", city: "شهرکرد" },
    "138": { province: "چهارمحال و بختیاری", city: "فارسان" },
    "139": { province: "چهارمحال و بختیاری", city: "فلارد" },
    "140": { province: "چهارمحال و بختیاری", city: "کوهرنگ" },
    "141": { province: "چهارمحال و بختیاری", city: "کیار" },
    "142": { province: "چهارمحال و بختیاری", city: "گندمان" },
    "143": { province: "چهارمحال و بختیاری", city: "لردگان" },
    "144": { province: "چهارمحال و بختیاری", city: "میانکوه" },
    "145": { province: "خراسان جنوبی", city: "بشرویه" },
    "146": { province: "خراسان جنوبی", city: "بیرجند" },
    "147": { province: "خراسان جنوبی", city: "درمیان" },
    "148": { province: "خراسان جنوبی", city: "زیرکوه" },
    "149": { province: "خراسان جنوبی", city: "سرایان" },
    "150": { province: "خراسان جنوبی", city: "سربیشه" },
    "151": { province: "خراسان جنوبی", city: "فردوس" },
    "152": { province: "خراسان جنوبی", city: "قائنات" },
    "153": { province: "خراسان جنوبی", city: "نهبندان" },
    "154": { province: "خراسان رضوی", city: "احمدآباد" },
    "155": { province: "خراسان رضوی", city: "بجستان" },
    "156": { province: "خراسان رضوی", city: "بردسکن" },
    "157": { province: "خراسان رضوی", city: "تایباد" },
    "158": { province: "خراسان رضوی", city: "تخت جلگه" },
    "159": { province: "خراسان رضوی", city: "تربت جام" },
    "160": { province: "خراسان رضوی", city: "تربت حیدریه" },
    "161": { province: "خراسان رضوی", city: "جغتای" },
    "162": { province: "خراسان رضوی", city: "جوین" },
    "163": { province: "خراسان رضوی", city: "چناران" },
    "164": { province: "خراسان رضوی", city: "خلیل آباد" },
    "165": { province: "خراسان رضوی", city: "خواف" },
    "166": { province: "خراسان رضوی", city: "درگز" },
    "167": { province: "خراسان رضوی", city: "رشتخوار" },
    "168": { province: "خراسان رضوی", city: "زبرخان" },
    "169": { province: "خراسان رضوی", city: "سبزوار" },
    "170": { province: "خراسان رضوی", city: "سرخس" },
    "171": { province: "خراسان رضوی", city: "فریمان" },
    "172": { province: "خراسان رضوی", city: "فیض آباد" },
    "173": { province: "خراسان رضوی", city: "قوچان" },
    "174": { province: "خراسان رضوی", city: "کاشمر" },
    "175": { province: "خراسان رضوی", city: "کلات" },
    "176": { province: "خراسان رضوی", city: "گناباد" },
    "177": { province: "خراسان رضوی", city: "مشهد" },
    "178": { province: "خراسان رضوی", city: "مشهد منطقه2" },
    "179": { province: "خراسان رضوی", city: "مشهد منطقه3" },
    "180": { province: "خراسان رضوی", city: "مشهد منطقه1" },
    "181": { province: "خراسان رضوی", city: "نیشابور" },
    "182": { province: "خراسان شمالی", city: "اسفراین" },
    "183": { province: "خراسان شمالی", city: "بجنورد" },
    "184": { province: "خراسان شمالی", city: "جاجرم" },
    "185": { province: "خراسان شمالی", city: "رازوجرکلان" },
    "186": { province: "خراسان شمالی", city: "شیروان" },
    "187": { province: "خراسان شمالی", city: "فاروج" },
    "188": { province: "خراسان شمالی", city: "مانه و سملقان" },
    "189": { province: "خوزستان", city: "آبادان" },
    "190": { province: "خوزستان", city: "آغاجاری" },
    "191": { province: "خوزستان", city: "اروندکنار" },
    "192": { province: "خوزستان", city: "امیدیه" },
    "193": { province: "خوزستان", city: "اندیکا" },
    "194": { province: "خوزستان", city: "اندیمشک" },
    "195": { province: "خوزستان", city: "اهواز" },
    "196": { province: "خوزستان", city: "ایذه" },
    "197": { province: "خوزستان", city: "باغ ملک" },
    "198": { province: "خوزستان", city: "بندر امام خمینی" },
    "199": { province: "خوزستان", city: "بندرماهشهر" },
    "200": { province: "خوزستان", city: "بهبهان" },
    "201": { province: "خوزستان", city: "خرمشهر" },
    "202": { province: "خوزستان", city: "دزفول" },
    "203": { province: "خوزستان", city: "دشت آزادگان" },
    "204": { province: "خوزستان", city: "رامشیر" },
    "205": { province: "خوزستان", city: "رامهرمز" },
    "206": { province: "خوزستان", city: "سردشت" },
    "207": { province: "خوزستان", city: "شادگان" },
    "208": { province: "خوزستان", city: "شاوور" },
    "209": { province: "خوزستان", city: "شوش" },
    "210": { province: "خوزستان", city: "شوشتر" },
    "211": { province: "خوزستان", city: "گتوند" },
    "212": { province: "خوزستان", city: "لالی" },
    "213": { province: "خوزستان", city: "مسجدسلیمان" },
    "214": { province: "خوزستان", city: "هندیجان" },
    "215": { province: "خوزستان", city: "هویزه" },
    "216": { province: "زنجان", city: "ابهر و خرمدره" },
    "217": { province: "زنجان", city: "زنجان" },
    "218": { province: "سمنان", city: "ایوانکی" },
    "219": { province: "سمنان", city: "بسطام" },
    "220": { province: "سمنان", city: "بیارجمند" },
    "221": { province: "سمنان", city: "دامغان" },
    "222": { province: "سمنان", city: "سمنان" },
    "223": { province: "سمنان", city: "شاهرود" },
    "224": { province: "سمنان", city: "گرمسار" },
    "225": { province: "سمنان", city: "مهدیشهر" },
    "226": { province: "سمنان", city: "میامی" },
    "227": { province: "سیستان و بلوچستان", city: "ایرانشهر" },
    "228": { province: "سیستان و بلوچستان", city: "بزمان" },
    "229": { province: "سیستان و بلوچستان", city: "بمپور" },
    "230": { province: "سیستان و بلوچستان", city: "چابهار" },
    "231": { province: "سیستان و بلوچستان", city: "خاش" },
    "232": { province: "سیستان و بلوچستان", city: "دشتیاری" },
    "233": { province: "سیستان و بلوچستان", city: "راسک" },
    "234": { province: "سیستان و بلوچستان", city: "زابل" },
    "235": { province: "سیستان و بلوچستان", city: "زابلی" },
    "236": { province: "سیستان و بلوچستان", city: "زاهدان" },
    "237": { province: "سیستان و بلوچستان", city: "سراوان" },
    "238": { province: "سیستان و بلوچستان", city: "سیب و سوران" },
    "239": { province: "سیستان و بلوچستان", city: "شهرکی و ناروئی(زهک)" },
    "240": { province: "سیستان و بلوچستان", city: "شیب آب" },
    "241": { province: "سیستان و بلوچستان", city: "فنوج" },
    "242": { province: "سیستان و بلوچستان", city: "قصرقند" },
    "243": { province: "سیستان و بلوچستان", city: "کنارک" },
    "244": { province: "سیستان و بلوچستان", city: "لاشار(اسپکه)" },
    "245": { province: "سیستان و بلوچستان", city: "میرجاوه" },
    "246": { province: "سیستان و بلوچستان", city: "نیک شهر" },
    "247": { province: "فارس", city: "آباده" },
    "248": { province: "فارس", city: "آباده طشک" },
    "249": { province: "فارس", city: "ارسنجان" },
    "250": { province: "فارس", city: "استهبان" },
    "251": { province: "فارس", city: "اشکنان" },
    "252": { province: "فارس", city: "اقلید" },
    "253": { province: "فارس", city: "اوز" },
    "254": { province: "فارس", city: "بوانات" },
    "255": { province: "فارس", city: "بیضا" },
    "256": { province: "فارس", city: "جویم" },
    "257": { province: "فارس", city: "جهرم" },
    "258": { province: "فارس", city: "حاجی آباد(زرین دشت)" },
    "259": { province: "فارس", city: "خرامه" },
    "260": { province: "فارس", city: "خشت و کمارج" },
    "261": { province: "فارس", city: "خفر" },
    "262": { province: "فارس", city: "داراب" },
    "263": { province: "فارس", city: "سروستان" },
    "264": { province: "فارس", city: "سعادت آباد" },
    "265": { province: "فارس", city: "سپیدان" },
    "266": { province: "فارس", city: "شیبکوه" },
    "267": { province: "فارس", city: "شیراز" },
    "268": { province: "فارس", city: "فراشبند" },
    "269": { province: "فارس", city: "فسا" },
    "270": { province: "فارس", city: "فیروزآباد" },
    "271": { province: "فارس", city: "قنقری(خرم بید)" },
    "272": { province: "فارس", city: "قیروکارزین" },
    "273": { province: "فارس", city: "کازرون" },
    "274": { province: "فارس", city: "کوار" },
    "275": { province: "فارس", city: "کراش" },
    "276": { province: "فارس", city: "لارستان" },
    "277": { province: "فارس", city: "لامرد" },
    "278": { province: "فارس", city: "مرودشت" },
    "279": { province: "فارس", city: "ممسنی" },
    "280": { province: "فارس", city: "مهر" },
    "281": { province: "فارس", city: "نی ریز" },
    "282": { province: "قزوین", city: "آبیک" },
    "283": { province: "قزوین", city: "آوج" },
    "284": { province: "قزوین", city: "البرز" },
    "285": { province: "قزوین", city: "بوئین زهرا" },
    "286": { province: "قزوین", city: "تاکستان" },
    "287": { province: "قزوین", city: "رودبار الموت" },
    "288": { province: "قزوین", city: "رودبار شهرستان" },
    "289": { province: "قزوین", city: "ضیاءآباد" },
    "290": { province: "قزوین", city: "طارم سفلی" },
    "291": { province: "قزوین", city: "قزوین" },
    "292": { province: "قم", city: "قم" },
    "293": { province: "قم", city: "کهک" },
    "294": { province: "کردستان", city: "بانه" },
    "295": { province: "کردستان", city: "بیجار" },
    "296": { province: "کردستان", city: "دهگلان" },
    "297": { province: "کردستان", city: "دیواندره" },
    "298": { province: "کردستان", city: "سروآباد" },
    "299": { province: "کردستان", city: "سقز" },
    "300": { province: "کردستان", city: "سنندج" },
    "301": { province: "کردستان", city: "قروه" },
    "302": { province: "کردستان", city: "کامیاران" },
    "303": { province: "کردستان", city: "کرانی" },
    "304": { province: "کردستان", city: "مریوان" },
    "305": { province: "کردستان", city: "نمشیر" },
    "306": { province: "کرمان", city: "ارزونیه" },
    "307": { province: "کرمان", city: "انار" },
    "308": { province: "کرمان", city: "بافت" },
    "309": { province: "کرمان", city: "بردسیر" },
    "310": { province: "کرمان", city: "بم" },
    "311": { province: "کرمان", city: "جیرفت" },
    "312": { province: "کرمان", city: "رابر" },
    "313": { province: "کرمان", city: "راور" },
    "314": { province: "کرمان", city: "رفسنجان" },
    "315": { province: "کرمان", city: "رودبار کهنوج" },
    "316": { province: "کرمان", city: "ریگان" },
    "317": { province: "کرمان", city: "زرند" },
    "318": { province: "کرمان", city: "سیرجان" },
    "319": { province: "کرمان", city: "شهداد" },
    "320": { province: "کرمان", city: "شهربابک" },
    "321": { province: "کرمان", city: "عنبرآباد" },
    "322": { province: "کرمان", city: "فهرج" },
    "323": { province: "کرمان", city: "قلعه گنج" },
    "324": { province: "کرمان", city: "کرمان" },
    "325": { province: "کرمان", city: "کوهبنان" },
    "326": { province: "کرمان", city: "کهنوج" },
    "327": { province: "کرمان", city: "گلباف" },
    "328": { province: "کرمان", city: "ماهان" },
    "329": { province: "کرمان", city: "منوجان" },
    "330": { province: "کرمانشاه", city: "اسلام آباد" },
    "331": { province: "کرمانشاه", city: "باینگان" },
    "332": { province: "کرمانشاه", city: "پاوه" },
    "333": { province: "کرمانشاه", city: "ثلاث باباجانی" },
    "334": { province: "کرمانشاه", city: "جوانرود" },
    "335": { province: "کرمانشاه", city: "حمیل" },
    "336": { province: "کرمانشاه", city: "دالاهو" },
    "337": { province: "کرمانشاه", city: "روانسر" },
    "338": { province: "کرمانشاه", city: "سرپل ذهاب" },
    "339": { province: "کرمانشاه", city: "سنقر" },
    "340": { province: "کرمانشاه", city: "صحنه" },
    "341": { province: "کرمانشاه", city: "قصرشیرین" },
    "342": { province: "کرمانشاه", city: "کرمانشاه" },
    "343": { province: "کرمانشاه", city: "کرند" },
    "344": { province: "کرمانشاه", city: "کنگاور" },
    "345": { province: "کرمانشاه", city: "گیلانغرب" },
    "346": { province: "کرمانشاه", city: "هرسین" },
    "347": { province: "کهگیلویه و بویراحمد", city: "باشت" },
    "348": { province: "کهگیلویه و بویراحمد", city: "بویراحمد(یاسوج)" },
    "349": { province: "کهگیلویه و بویراحمد", city: "بهمنی" },
    "350": { province: "کهگیلویه و بویراحمد", city: "چاروسا" },
    "351": { province: "کهگیلویه و بویراحمد", city: "دروهان" },
    "352": { province: "کهگیلویه و بویراحمد", city: "کهکیلویه(دهدشت)" },
    "353": { province: "کهگیلویه و بویراحمد", city: "گچساران(دوگنبدان)" },
    "354": { province: "کهگیلویه و بویراحمد", city: "لنده" },
    "355": { province: "کهگیلویه و بویراحمد", city: "مارگون" },
    "356": { province: "گلستان", city: "آزادشهر" },
    "357": { province: "گلستان", city: "آق قلا" },
    "358": { province: "گلستان", city: "بندرترکمن" },
    "359": { province: "گلستان", city: "بندرگز" },
    "360": { province: "گلستان", city: "رامیان" },
    "361": { province: "گلستان", city: "علی آباد" },
    "362": { province: "گلستان", city: "کردکوی" },
    "363": { province: "گلستان", city: "گرگان" },
    "364": { province: "گلستان", city: "گمیشان" },
    "365": { province: "گلستان", city: "گنبد کاووس" },
    "366": { province: "گلستان", city: "مراوه تپه" },
    "367": { province: "گلستان", city: "مینودشت" },
    "368": { province: "گیلان", city: "آستارا" },
    "369": { province: "گیلان", city: "آستانه" },
    "370": { province: "گیلان", city: "املش" },
    "371": { province: "گیلان", city: "بندرانزلی" },
    "372": { province: "گیلان", city: "خمام" },
    "373": { province: "گیلان", city: "رحیم آباد" },
    "374": { province: "گیلان", city: "رشت" },
    "375": { province: "گیلان", city: "رضوانشهر" },
    "376": { province: "گیلان", city: "رودبار" },
    "377": { province: "گیلان", city: "رودسر" },
    "378": { province: "گیلان", city: "سنگر" },
    "379": { province: "گیلان", city: "سیاهکل" },
    "380": { province: "گیلان", city: "شفت" },
    "381": { province: "گیلان", city: "صومعه سرا" },
    "382": { province: "گیلان", city: "طالش" },
    "383": { province: "گیلان", city: "فومن" },
    "384": { province: "گیلان", city: "کوچصفهان" },
    "385": { province: "گیلان", city: "لاهیجان" },
    "386": { province: "گیلان", city: "لشت نشاء" },
    "387": { province: "گیلان", city: "لنگرود" },
    "388": { province: "گیلان", city: "ماسال و شاندرمن" },
    "389": { province: "لرستان", city: "ازنا" },
    "390": { province: "لرستان", city: "اشترینان" },
    "391": { province: "لرستان", city: "الشتر" },
    "392": { province: "لرستان", city: "الیگودرز" },
    "393": { province: "لرستان", city: "بروجرد" },
    "394": { province: "لرستان", city: "پاپی" },
    "395": { province: "لرستان", city: "چغلوندی" },
    "396": { province: "لرستان", city: "چگنی" },
    "397": { province: "لرستان", city: "خرم آباد" },
    "398": { province: "لرستان", city: "دورود" },
    "399": { province: "لرستان", city: "رومشکان" },
    "400": { province: "لرستان", city: "کوهدشت" },
    "401": { province: "لرستان", city: "نورآباد(دلفان)" },
    "402": { province: "لرستان", city: "ویسیان" },
    "403": { province: "مازندران", city: "آمل" },
    "404": { province: "مازندران", city: "بابل" },
    "405": { province: "مازندران", city: "بندپی" },
    "406": { province: "مازندران", city: "بندپی شرقی" },
    "407": { province: "مازندران", city: "بهشهر" },
    "408": { province: "مازندران", city: "تنکابن" },
    "409": { province: "مازندران", city: "جویبار" },
    "410": { province: "مازندران", city: "چالوس" },
    "411": { province: "مازندران", city: "چمستان" },
    "412": { province: "مازندران", city: "چهاردانگه" },
    "413": { province: "مازندران", city: "دودانگه" },
    "414": { province: "مازندران", city: "رامسر" },
    "415": { province: "مازندران", city: "ساری" },
    "416": { province: "مازندران", city: "سوادکوه" },
    "417": { province: "مازندران", city: "شیرگاه" },
    "418": { province: "مازندران", city: "عباس آباد" },
    "419": { province: "مازندران", city: "قائمشهر" },
    "420": { province: "مازندران", city: "کجور" },
    "421": { province: "مازندران", city: "کلاردشت" },
    "422": { province: "مازندران", city: "گلوگاه" },
    "423": { province: "مازندران", city: "میاندورود" },
    "424": { province: "مازندران", city: "نکاء" },
    "425": { province: "مازندران", city: "نور" },
    "426": { province: "مازندران", city: "نوشهر" },
    "427": { province: "مازندران", city: "هراز و محمودآباد" },
    "428": { province: "مرکزی", city: "آشتیان" },
    "429": { province: "مرکزی", city: "اراک" },
    "430": { province: "مرکزی", city: "تفرش" },
    "431": { province: "مرکزی", city: "خمین" },
    "432": { province: "مرکزی", city: "خنداب" },
    "433": { province: "مرکزی", city: "دلیجان" },
    "434": { province: "مرکزی", city: "زرند مرکزی" },
    "435": { province: "مرکزی", city: "ساوه" },
    "436": { province: "مرکزی", city: "سربند" },
    "437": { province: "مرکزی", city: "فراهان" },
    "438": { province: "مرکزی", city: "محلات" },
    "439": { province: "مرکزی", city: "وفس" },
    "440": { province: "هرمزگان", city: "ابوموسی" },
    "441": { province: "هرمزگان", city: "بستک" },
    "442": { province: "هرمزگان", city: "بشاگرد" },
    "443": { province: "هرمزگان", city: "بندرعباس" },
    "444": { province: "هرمزگان", city: "بندرلنگه" },
    "445": { province: "هرمزگان", city: "جاسک" },
    "446": { province: "هرمزگان", city: "حاجی آباد هرمزگان" },
    "447": { province: "هرمزگان", city: "خمیر" },
    "448": { province: "هرمزگان", city: "رودان" },
    "449": { province: "هرمزگان", city: "فین" },
    "450": { province: "هرمزگان", city: "قشم" },
    "451": { province: "هرمزگان", city: "گاوبندی" },
    "452": { province: "هرمزگان", city: "میناب" },
    "453": { province: "همدان", city: "اسدآباد" },
    "454": { province: "همدان", city: "بهار" },
    "455": { province: "همدان", city: "تویسرکان" },
    "456": { province: "همدان", city: "رزن" },
    "457": { province: "همدان", city: "شراء و پیشخوار" },
    "458": { province: "همدان", city: "فامنین" },
    "459": { province: "همدان", city: "قلقل رود" },
    "460": { province: "همدان", city: "کبودرآهنگ" },
    "461": { province: "همدان", city: "ملایر" },
    "462": { province: "همدان", city: "نهاوند" },
    "463": { province: "همدان", city: "همدان" },
    "464": { province: "یزد", city: "ابرکوه" },
    "465": { province: "یزد", city: "اردکان" },
    "466": { province: "یزد", city: "اشکذر" },
    "467": { province: "یزد", city: "بافق" },
    "468": { province: "یزد", city: "بهاباد" },
    "469": { province: "یزد", city: "تفت" },
    "470": { province: "یزد", city: "دستگردان" },
    "471": { province: "یزد", city: "طبس" },
    "472": { province: "یزد", city: "مهریز" },
    "473": { province: "یزد", city: "میبد" },
    "474": { province: "یزد", city: "نیر" },
    "475": { province: "یزد", city: "هرات و مروست" },
    "476": { province: "یزد", city: "یزد" },
    "477": { province: "توابع تهران", city: "توابع تهران" },
    "478": { province: "توابع تهران", city: "توابع تهران" },
    "479": { province: "توابع تهران", city: "توابع تهران" },
    "480": { province: "توابع تهران", city: "توابع تهران" },
    "481": { province: "توابع تهران", city: "توابع تهران" },
    "482": { province: "توابع تهران", city: "توابع تهران" },
    "483": { province: "توابع تهران", city: "توابع تهران" },
    "484": { province: "توابع تهران", city: "توابع تهران" },
    "485": { province: "توابع تهران", city: "توابع تهران" },
    "486": { province: "توابع تهران", city: "توابع تهران" },
    "487": { province: "توابع تهران", city: "توابع تهران" },
    "488": { province: "توابع تهران", city: "توابع تهران" },
    "489": { province: "توابع تهران", city: "توابع تهران" },
    "490": { province: "توابع تهران", city: "توابع تهران" },
    "491": { province: "توابع تهران", city: "توابع تهران" },
    "492": { province: "توابع تهران", city: "توابع تهران" },
    "493": { province: "توابع تهران", city: "توابع تهران" },
    "494": { province: "توابع تهران", city: "توابع تهران" },
    "495": { province: "توابع تهران", city: "توابع تهران" },
    "496": { province: "توابع تهران", city: "توابع تهران" },
    "497": { province: "توابع تهران", city: "توابع تهران" },
    "498": { province: "توابع تهران", city: "توابع تهران" },
    "499": { province: "توابع تهران", city: "توابع تهران" },
    "501": { province: "توابع تهران", city: "توابع تهران" },
    "502": { province: "توابع تهران", city: "توابع تهران" },
    "503": { province: "توابع تهران", city: "توابع تهران" },
    "504": { province: "توابع تهران", city: "توابع تهران" },
    "505": { province: "توابع تهران", city: "توابع تهران" },
    "506": { province: "توابع تهران", city: "توابع تهران" },
    "507": { province: "توابع تهران", city: "توابع تهران" },
    "508": { province: "توابع تهران", city: "توابع تهران" },
    "509": { province: "توابع تهران", city: "توابع تهران" },
    "510": { province: "توابع تهران", city: "توابع تهران" },
    "511": { province: "توابع تهران", city: "توابع تهران" },
    "512": { province: "توابع تهران", city: "توابع تهران" },
    "513": { province: "توابع تهران", city: "توابع تهران" },
    "514": { province: "توابع تهران", city: "توابع تهران" },
    "515": { province: "توابع تهران", city: "توابع تهران" },
    "516": { province: "توابع تهران", city: "توابع تهران" },
    "517": { province: "توابع تهران", city: "توابع تهران" },
    "518": { province: "توابع تهران", city: "توابع تهران" },
    "519": { province: "توابع تهران", city: "توابع تهران" },
    "520": { province: "توابع تهران", city: "توابع تهران" },
    "521": { province: "توابع تهران", city: "توابع تهران" },
    "522": { province: "توابع تهران", city: "توابع تهران" },
    "523": { province: "توابع تهران", city: "توابع تهران" },
    "524": { province: "توابع تهران", city: "توابع تهران" },
    "525": { province: "توابع تهران", city: "توابع تهران" },
    "526": { province: "توابع تهران", city: "توابع تهران" },
    "527": { province: "توابع تهران", city: "توابع تهران" },
    "528": { province: "توابع تهران", city: "توابع تهران" },
    "529": { province: "توابع تهران", city: "توابع تهران" },
    "530": { province: "توابع تهران", city: "توابع تهران" },
    "531": { province: "توابع تهران", city: "توابع تهران" },
    "532": { province: "توابع تهران", city: "توابع تهران" },
    "533": { province: "توابع تهران", city: "توابع تهران" },
    "534": { province: "توابع تهران", city: "توابع تهران" },
    "535": { province: "توابع تهران", city: "توابع تهران" },
    "536": { province: "توابع تهران", city: "توابع تهران" },
    "537": { province: "توابع تهران", city: "توابع تهران" },
    "538": { province: "توابع تهران", city: "توابع تهران" },
    "539": { province: "توابع تهران", city: "توابع تهران" },
    "540": { province: "توابع تهران", city: "توابع تهران" },
    "541": { province: "توابع تهران", city: "توابع تهران" },
    "542": { province: "توابع تهران", city: "توابع تهران" },
    "543": { province: "توابع تهران", city: "توابع تهران" },
    "544": { province: "توابع تهران", city: "توابع تهران" },
    "545": { province: "توابع تهران", city: "توابع تهران" },
    "546": { province: "توابع تهران", city: "توابع تهران" },
    "547": { province: "توابع تهران", city: "توابع تهران" },
    "548": { province: "توابع تهران", city: "توابع تهران" },
    "549": { province: "توابع تهران", city: "توابع تهران" },
    "550": { province: "توابع تهران", city: "توابع تهران" },
    "551": { province: "توابع تهران", city: "توابع تهران" },
    "552": { province: "توابع تهران", city: "توابع تهران" },
    "553": { province: "توابع تهران", city: "توابع تهران" },
    "554": { province: "توابع تهران", city: "توابع تهران" },
    "555": { province: "توابع تهران", city: "توابع تهران" },
    "556": { province: "توابع تهران", city: "توابع تهران" },
    "557": { province: "توابع تهران", city: "توابع تهران" },
    "558": { province: "توابع تهران", city: "توابع تهران" },
    "559": { province: "توابع تهران", city: "توابع تهران" },
    "560": { province: "توابع تهران", city: "توابع تهران" },
    "561": { province: "توابع تهران", city: "توابع تهران" },
    "562": { province: "توابع تهران", city: "توابع تهران" },
    "563": { province: "توابع تهران", city: "توابع تهران" },
    "564": { province: "توابع تهران", city: "توابع تهران" },
    "565": { province: "توابع تهران", city: "توابع تهران" },
    "566": { province: "توابع تهران", city: "توابع تهران" },
    "567": { province: "توابع تهران", city: "توابع تهران" },
    "568": { province: "توابع تهران", city: "توابع تهران" },
    "569": { province: "توابع تهران", city: "توابع تهران" },
    "570": { province: "توابع تهران", city: "توابع تهران" },
    "571": { province: "توابع تهران", city: "توابع تهران" },
    "572": { province: "توابع تهران", city: "توابع تهران" },
    "573": { province: "توابع تهران", city: "توابع تهران" },
    "574": { province: "توابع تهران", city: "توابع تهران" },
    "575": { province: "توابع تهران", city: "توابع تهران" },
    "576": { province: "توابع تهران", city: "توابع تهران" },
    "577": { province: "توابع تهران", city: "توابع تهران" },
    "578": { province: "توابع تهران", city: "توابع تهران" },
    "579": { province: "توابع تهران", city: "توابع تهران" },
    "580": { province: "توابع تهران", city: "توابع تهران" },
    "581": { province: "توابع تهران", city: "توابع تهران" },
    "582": { province: "توابع تهران", city: "توابع تهران" },
    "583": { province: "توابع تهران", city: "توابع تهران" },
    "584": { province: "توابع تهران", city: "توابع تهران" },
    "585": { province: "توابع تهران", city: "توابع تهران" },
    "586": { province: "توابع تهران", city: "توابع تهران" },
    "587": { province: "توابع تهران", city: "توابع تهران" },
    "588": { province: "توابع تهران", city: "توابع تهران" },
    "589": { province: "توابع تهران", city: "توابع تهران" },
    "590": { province: "توابع تهران", city: "توابع تهران" },
    "591": { province: "توابع تهران", city: "توابع تهران" },
    "592": { province: "توابع تهران", city: "توابع تهران" },
    "593": { province: "توابع تهران", city: "توابع تهران" },
    "594": { province: "توابع تهران", city: "توابع تهران" },
    "595": { province: "توابع تهران", city: "توابع تهران" },
    "596": { province: "توابع تهران", city: "توابع تهران" },
    "597": { province: "توابع تهران", city: "توابع تهران" },
    "598": { province: "توابع تهران", city: "توابع تهران" },
    "599": { province: "توابع تهران", city: "توابع تهران" },
    "600": { province: "توابع تهران", city: "توابع تهران" },
    "601": { province: "توابع تهران", city: "توابع تهران" },
    "602": { province: "توابع تهران", city: "توابع تهران" },
    "603": { province: "توابع تهران", city: "توابع تهران" },
    "604": { province: "توابع تهران", city: "توابع تهران" },
    "605": { province: "توابع تهران", city: "توابع تهران" },
    "606": { province: "توابع تهران", city: "توابع تهران" },
    "607": { province: "توابع تهران", city: "توابع تهران" },
    "608": { province: "توابع تهران", city: "توابع تهران" },
    "609": { province: "توابع تهران", city: "توابع تهران" },
    "610": { province: "توابع تهران", city: "توابع تهران" },
    "611": { province: "توابع تهران", city: "توابع تهران" },
    "612": { province: "توابع تهران", city: "توابع تهران" },
    "613": { province: "توابع تهران", city: "توابع تهران" },
    "614": { province: "توابع تهران", city: "توابع تهران" },
    "615": { province: "توابع تهران", city: "توابع تهران" },
    "616": { province: "توابع تهران", city: "توابع تهران" },
    "617": { province: "توابع تهران", city: "توابع تهران" },
    "618": { province: "توابع تهران", city: "توابع تهران" },
    "619": { province: "توابع تهران", city: "توابع تهران" },
    "620": { province: "توابع تهران", city: "توابع تهران" },
    "621": { province: "توابع تهران", city: "توابع تهران" },
    "622": { province: "توابع تهران", city: "توابع تهران" },
    "623": { province: "توابع تهران", city: "توابع تهران" },
    "624": { province: "توابع تهران", city: "توابع تهران" },
    "625": { province: "توابع تهران", city: "توابع تهران" }
};

function getCityByCode(code: string): { province: string; city: string } | undefined {
    return cityCodes[code];
}

const validateNationalId = (id: string): ValidationResult => {
    if (!/^\d{10}$/.test(id)) {
        return { isValid: false, message: 'کد ملی باید ۱۰ رقم و فقط شامل اعداد باشد.' };
    }
    
    if (/^(\d)\1{9}$/.test(id)) {
        return { isValid: false, message: 'کد ملی با ارقام تکراری نامعتبر است.' };
    }

    const check = +id[9];
    const sum = id.slice(0, 9).split('').reduce((acc, digit, index) => {
        return acc + (+digit * (10 - index));
    }, 0);
    
    const remainder = sum % 11;
    const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;

    const isValid = check === expectedCheckDigit;
    
    if (!isValid) {
        return { isValid: false, message: 'ساختار کد ملی نامعتبر است (رقم کنترل اشتباه است).' };
    }

    const cityInfo = getCityByCode(id.substring(0, 3));

    return {
        isValid: true,
        message: 'کد ملی معتبر است.',
        province: cityInfo?.province,
        city: cityInfo?.city
    };
};

export default function NationalIdValidator() {
  const [digits, setDigits] = useState(Array(10).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const nationalId = digits.join('');

  const result = useMemo(() => {
    if (nationalId.length !== 10) return null;
    return validateNationalId(nationalId);
  }, [nationalId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newDigits = [...digits];

    if (/^[0-9]?$/.test(value)) {
      newDigits[index] = value;
      setDigits(newDigits);
      
      if (value && index < 9 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits];
      if (!newDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        newDigits[index-1] = '';
        setDigits(newDigits);
      } else {
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
      if (pastedData.length === 10) {
          setDigits(pastedData.split(''));
          inputRefs.current[9]?.focus();
      }
  }

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="national-id-input-0" className="text-muted-foreground">شماره ملی را وارد کنید</Label>
        
        <div className="relative w-full max-w-sm mx-auto p-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700" dir="ltr">
            <div className="absolute top-3 left-4 flex items-center gap-2">
                <div className="w-8 h-5 bg-white border border-gray-300 rounded-sm flex flex-col justify-around p-0.5">
                    <div className="h-1 bg-green-500"></div>
                    <div className="h-1 bg-white"></div>
                    <div className="h-1 bg-red-500"></div>
                </div>
                <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400">I.R. IRAN</p>
            </div>
            <div className="absolute top-3 right-4">
                 <Fingerprint className="h-6 w-6 text-gray-400" />
            </div>

            <div className="flex justify-center items-center gap-1.5 mt-8" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <React.Fragment key={index}>
                  <Input
                    ref={(el) => (inputRefs.current[index] = el)}
                    id={`national-id-input-${index}`}
                    type="tel"
                    inputMode='numeric'
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="w-8 h-12 text-center text-xl font-body bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:bg-blue-50 focus:dark:bg-blue-900/50 focus:ring-2 focus:ring-blue-400"
                  />
                  {index === 2 && <div className="w-1 h-5" />} 
                  {index === 8 && <div className="w-1 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 tracking-widest">National ID</p>
        </div>
      </div>

      {result ? (
        <div className={`p-4 rounded-lg shadow-inner text-center space-y-3 ${
            result.isValid 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className={`flex items-center justify-center gap-2 font-semibold ${
            result.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {result.isValid ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span>{result.message}</span>
          </div>
          {result.isValid && result.province && (
            <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
               <div className='flex items-center justify-center gap-2'>
                  <MapPin className='w-5 h-5 text-primary'/>
                  <p className="text-md text-foreground">
                    <span className="text-muted-foreground">استان:</span> {result.province}
                  </p>
               </div>
               <div className='flex items-center justify-center gap-2'>
                  <Building className='w-5 h-5 text-muted-foreground'/>
                   <p className="text-md text-foreground">
                    <span className="text-muted-foreground">شهرستان:</span> {result.city}
                  </p>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
          <p>شماره ملی ۱۰ رقمی خود را وارد کنید.</p>
        </div>
      )}
    </CardContent>
  );
}
