"use client";

import React, { useState, useMemo } from 'react';
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
    "001": { province: "تهران", city: "تهران مرکزی" },
    "002": { province: "تهران", city: "تهران مرکزی" },
    "003": { province: "تهران", city: "تهران مرکزی" },
    "004": { province: "تهران", city: "تهران مرکزی" },
    "005": { province: "تهران", city: "تهران مرکزی" },
    "006": { province: "تهران", city: "تهران مرکزی" },
    "007": { province: "تهران", city: "تهران مرکزی" },
    "008": { province: "تهران", city: "تهران مرکزی" },
    "011": { province: "تهران", city: "تهران جنوب" },
    "015": { province: "تهران", city: "تهران غرب" },
    "020": { province: "تهران", city: "تهران شرق" },
    "025": { province: "تهران", city: "تهران شمال" },
    "031": { province: "البرز", city: "کرج" },
    "032": { province: "البرز", city: "کرج" },
    "037": { province: "قم", city: "قم" },
    "038": { province: "قم", city: "قم" },
    "041": { province: "تهران", city: "ورامین" },
    "042": { province: "تهران", city: "ورامین" },
    "043": { province: "تهران", city: "دماوند" },
    "044": { province: "تهران", city: "شمیران" },
    "045": { province: "تهران", city: "شمیران" },
    "048": { province: "تهران", city: "شهرری" },
    "049": { province: "تهران", city: "شهرری" },
    "051": { province: "مرکزی", city: "آشتیان" },
    "052": { province: "مرکزی", city: "اراک" },
    "053": { province: "مرکزی", city: "اراک" },
    "055": { province: "مرکزی", city: "خمین" },
    "056": { province: "مرکزی", city: "محلات" },
    "057": { province: "مرکزی", city: "دلیجان" },
    "058": { province: "مرکزی", city: "تفرش" },
    "059": { province: "مرکزی", city: "ساوه" },
    "060": { province: "مرکزی", city: "ساوه" },
    "061": { province: "مرکزی", city: "سربند" },
    "062": { province: "مرکزی", city: "سربند" },
    "063": { province: "خراسان شمالی", city: "اسفراین" },
    "064": { province: "خراسان جنوبی", city: "بیرجند" },
    "065": { province: "خراسان جنوبی", city: "بیرجند" },
    "067": { province: "خراسان شمالی", city: "بجنورد" },
    "068": { province: "خراسان شمالی", city: "بجنورد" },
    "069": { province: "خراسان رضوی", city: "تربت حیدریه" },
    "070": { province: "خراسان رضوی", city: "تربت حیدریه" },
    "072": { province: "خراسان رضوی", city: "تربت جام" },
    "073": { province: "خراسان رضوی", city: "تربت جام" },
    "074": { province: "خراسان رضوی", city: "تایباد" },
    "075": { province: "خراسان شمالی", city: "جاجرم" },
    "076": { province: "خراسان رضوی", city: "خواف" },
    "077": { province: "خراسان رضوی", city: "درگز" },
    "078": { province: "خراسان رضوی", city: "سبزوار" },
    "079": { province: "خراسان رضوی", city: "سبزوار" },
    "081": { province: "خراسان رضوی", city: "سرخس" },
    "082": { province: "خراسان شمالی", city: "شیروان" },
    "083": { province: "یزد", city: "طبس" },
    "084": { province: "خراسان رضوی", city: "فریمان" },
    "085": { province: "خراسان جنوبی", city: "فردوس" },
    "086": { province: "خراسان رضوی", city: "قوچان" },
    "087": { province: "خراسان رضوی", city: "قوچان" },
    "088": { province: "خراسان جنوبی", city: "قائنات" },
    "089": { province: "خراسان رضوی", city: "کاشمر" },
    "090": { province: "خراسان رضوی", city: "کاشمر" },
    "091": { province: "خراسان رضوی", city: "گناباد" },
    "092": { province: "خراسان رضوی", city: "مشهد" },
    "093": { province: "خراسان رضوی", city: "مشهد" },
    "094": { province: "خراسان رضوی", city: "مشهد" },
    "096": { province: "خراسان رضوی", city: "مشهد منطقه1" },
    "097": { province: "خراسان رضوی", city: "مشهد منطقه2" },
    "098": { province: "خراسان رضوی", city: "مشهد منطقه3" },
    "105": { province: "خراسان رضوی", city: "نیشابور" },
    "106": { province: "خراسان رضوی", city: "نیشابور" },
    "108": { province: "اصفهان", city: "نجف آباد" },
    "109": { province: "اصفهان", city: "نجف آباد" },
    "110": { province: "اصفهان", city: "فلاورجان" },
    "111": { province: "اصفهان", city: "فلاورجان" },
    "112": { province: "اصفهان", city: "فریدونشهر" },
    "113": { province: "اصفهان", city: "خمینی شهر" },
    "114": { province: "اصفهان", city: "خمینی شهر" },
    "115": { province: "اصفهان", city: "فریدن" },
    "116": { province: "اصفهان", city: "لنجان(زرینشهر)" },
    "117": { province: "اصفهان", city: "لنجان(زرینشهر)" },
    "118": { province: "اصفهان", city: "اردستان" },
    "119": { province: "اصفهان", city: "شهرضا" },
    "120": { province: "اصفهان", city: "سمیرم" },
    "121": { province: "اصفهان", city: "گلپایگان" },
    "122": { province: "اصفهان", city: "خوانسار" },
    "123": { province: "اصفهان", city: "نطنز" },
    "124": { province: "اصفهان", city: "نائین" },
    "125": { province: "اصفهان", city: "کاشان" },
    "126": { province: "اصفهان", city: "کاشان" },
    "127": { province: "اصفهان", city: "اصفهان" },
    "128": { province: "اصفهان", city: "اصفهان" },
    "129": { province: "اصفهان", city: "اصفهان" },
    "136": { province: "آذربایجان شرقی", city: "تبریز" },
    "137": { province: "آذربایجان شرقی", city: "تبریز" },
    "138": { province: "آذربایجان شرقی", city: "تبریز" },
    "145": { province: "اردبیل", city: "اردبیل" },
    "146": { province: "اردبیل", city: "اردبیل" },
    "149": { province: "آذربایجان شرقی", city: "اهر" },
    "150": { province: "آذربایجان شرقی", city: "اهر" },
    "152": { province: "آذربایجان شرقی", city: "میانه" },
    "153": { province: "آذربایجان شرقی", city: "میانه" },
    "154": { province: "آذربایجان شرقی", city: "مراغه" },
    "155": { province: "آذربایجان شرقی", city: "مراغه" },
    "158": { province: "آذربایجان شرقی", city: "مرند" },
    "159": { province: "آذربایجان شرقی", city: "هشترود" },
    "160": { province: "آذربایجان شرقی", city: "هشترود" },
    "161": { province: "اردبیل", city: "مغان" },
    "162": { province: "اردبیل", city: "مغان" },
    "163": { province: "اردبیل", city: "خلخال" },
    "164": { province: "آذربایجان شرقی", city: "سراب" },
    "165": { province: "آذربایجان شرقی", city: "سراب" },
    "166": { province: "اردبیل", city: "مشکین شهر" },
    "167": { province: "اردبیل", city: "مشکین شهر" },
    "168": { province: "آذربایجان شرقی", city: "بناب" },
    "169": { province: "آذربایجان شرقی", city: "آذرشهر" },
    "170": { province: "آذربایجان شرقی", city: "اسکو" },
    "171": { province: "آذربایجان شرقی", city: "بستان آباد" },
    "172": { province: "آذربایجان شرقی", city: "شبستر" },
    "173": { province: "آذربایجان شرقی", city: "هریس" },
    "174": { province: "خوزستان", city: "اهواز" },
    "175": { province: "خوزستان", city: "اهواز" },
    "181": { province: "خوزستان", city: "آبادان" },
    "182": { province: "خوزستان", city: "خرمشهر" },
    "183": { province: "خوزستان", city: "ایذه" },
    "184": { province: "خوزستان", city: "ایذه" },
    "185": { province: "خوزستان", city: "بهبهان" },
    "186": { province: "خوزستان", city: "بهبهان" },
    "187": { province: "خوزستان", city: "شوشتر" },
    "188": { province: "خوزستان", city: "شوشتر" },
    "189": { province: "خوزستان", city: "شادگان" },
    "190": { province: "خوزستان", city: "رامهرمز" },
    "191": { province: "خوزستان", city: "رامهرمز" },
    "192": { province: "خوزستان", city: "اندیمشک" },
    "193": { province: "خوزستان", city: "اندیمشک" },
    "194": { province: "خوزستان", city: "بندرماهشهر" },
    "195": { province: "خوزستان", city: "بندرماهشهر" },
    "196": { province: "خوزستان", city: "مسجدسلیمان" },
    "197": { province: "خوزستان", city: "مسجدسلیمان" },
    "198": { province: "خوزستان", city: "دشت آزادگان" },
    "199": { province: "خوزستان", city: "دزفول" },
    "200": { province: "خوزستان", city: "دزفول" },
    "202": { province: "گلستان", city: "گنبد کاووس" },
    "203": { province: "گلستان", city: "گنبد کاووس" },
    "205": { province: "مازندران", city: "بابل" },
    "206": { province: "مازندران", city: "بابل" },
    "208": { province: "مازندران", city: "ساری" },
    "209": { province: "مازندران", city: "ساری" },
    "211": { province: "گلستان", city: "گرگان" },
    "212": { province: "گلستان", city: "گرگان" },
    "213": { province: "مازندران", city: "آمل" },
    "214": { province: "مازندران", city: "آمل" },
    "215": { province: "مازندران", city: "قائمشهر" },
    "216": { province: "مازندران", city: "قائمشهر" },
    "217": { province: "مازندران", city: "بهشهر" },
    "218": { province: "مازندران", city: "بهشهر" },
    "219": { province: "مازندران", city: "نوشهر" },
    "220": { province: "مازندران", city: "نوشهر" },
    "221": { province: "مازندران", city: "تنکابن" },
    "222": { province: "مازندران", city: "نور" },
    "223": { province: "گلستان", city: "بندرترکمن" },
    "224": { province: "گلستان", city: "کردکوی" },
    "225": { province: "مازندران", city: "سوادکوه" },
    "226": { province: "گلستان", city: "علی آباد" },
    "227": { province: "مازندران", city: "رامسر" },
    "228": { province: "فارس", city: "شیراز" },
    "229": { province: "فارس", city: "شیراز" },
    "230": { province: "فارس", city: "شیراز" },
    "236": { province: "فارس", city: "کازرون" },
    "237": { province: "فارس", city: "کازرون" },
    "238": { province: "فارس", city: "ممسنی" },
    "239": { province: "فارس", city: "ممسنی" },
    "240": { province: "فارس", city: "آباده" },
    "241": { province: "فارس", city: "آباده" },
    "242": { province: "فارس", city: "مرودشت" },
    "243": { province: "فارس", city: "مرودشت" },
    "244": { province: "فارس", city: "فیروزآباد" },
    "245": { province: "فارس", city: "فیروزآباد" },
    "246": { province: "فارس", city: "جهرم" },
    "247": { province: "فارس", city: "جهرم" },
    "248": { province: "فارس", city: "داراب" },
    "249": { province: "فارس", city: "داراب" },
    "250": { province: "فارس", city: "لارستان" },
    "251": { province: "فارس", city: "لارستان" },
    "252": { province: "فارس", city: "استهبان" },
    "253": { province: "فارس", city: "اقلید" },
    "255": { province: "فارس", city: "نی ریز" },
    "256": { province: "فارس", city: "فسا" },
    "257": { province: "فارس", city: "فسا" },
    "258": { province: "گیلان", city: "رشت" },
    "259": { province: "گیلان", city: "رشت" },
    "261": { province: "گیلان", city: "آستارا" },
    "262": { province: "گیلان", city: "طالش" },
    "263": { province: "گیلان", city: "طالش" },
    "264": { province: "گیلان", city: "بندرانزلی" },
    "265": { province: "گیلان", city: "رودبار" },
    "266": { province: "گیلان", city: "فومن" },
    "267": { province: "گیلان", city: "صومعه سرا" },
    "268": { province: "گیلان", city: "رودسر" },
    "269": { province: "گیلان", city: "رودسر" },
    "270": { province: "گیلان", city: "لنگرود" },
    "271": { province: "گیلان", city: "لاهیجان" },
    "272": { province: "گیلان", city: "لاهیجان" },
    "273": { province: "گیلان", city: "آستانه" },
    "274": { province: "آذربایجان غربی", city: "ارومیه" },
    "275": { province: "آذربایجان غربی", city: "ارومیه" },
    "279": { province: "آذربایجان غربی", city: "خوی" },
    "280": { province: "آذربایجان غربی", city: "خوی" },
    "282": { province: "آذربایجان غربی", city: "ماکو" },
    "283": { province: "آذربایجان غربی", city: "ماکو" },
    "284": { province: "آذربایجان غربی", city: "سلماس" },
    "285": { province: "آذربایجان غربی", city: "سلماس" },
    "286": { province: "آذربایجان غربی", city: "مهاباد" },
    "287": { province: "آذربایجان غربی", city: "مهاباد" },
    "288": { province: "آذربایجان غربی", city: "سردشت" },
    "289": { province: "آذربایجان غربی", city: "پیرانشهر" },
    "290": { province: "آذربایجان غربی", city: "نقده" },
    "291": { province: "آذربایجان غربی", city: "سیه چشمه(چالدران)" },
    "292": { province: "آذربایجان غربی", city: "بوکان" },
    "293": { province: "آذربایجان غربی", city: "شاهین دژ" },
    "294": { province: "آذربایجان غربی", city: "تکاب" },
    "295": { province: "آذربایجان غربی", city: "اشنویه" },
    "296": { province: "آذربایجان غربی", city: "میاندوآب" },
    "297": { province: "آذربایجان غربی", city: "میاندوآب" },
    "298": { province: "کرمان", city: "کرمان" },
    "299": { province: "کرمان", city: "کرمان" },
    "302": { province: "کرمان", city: "جیرفت" },
    "303": { province: "کرمان", city: "جیرفت" },
    "304": { province: "کرمان", city: "رفسنجان" },
    "305": { province: "کرمان", city: "رفسنجان" },
    "306": { province: "کرمان", city: "سیرجان" },
    "307": { province: "کرمان", city: "سیرجان" },
    "308": { province: "کرمان", city: "زرند" },
    "309": { province: "کرمان", city: "زرند" },
    "310": { province: "کرمان", city: "بم" },
    "311": { province: "کرمان", city: "بم" },
    "312": { province: "کرمان", city: "بافت" },
    "313": { province: "کرمان", city: "شهربابک" },
    "314": { province: "کرمان", city: "شهربابک" },
    "315": { province: "کرمان", city: "کهنوج" },
    "316": { province: "کرمان", city: "کهنوج" },
    "317": { province: "کرمان", city: "بردسیر" },
    "318": { province: "کرمان", city: "گلباف" },
    "319": { province: "کرمان", city: "شهداد" },
    "320": { province: "کرمان", city: "فهرج" },
    "321": { province: "کرمان", city: "راور" },
    "322": { province: "کرمانشاه", city: "پاوه" },
    "323": { province: "کرمانشاه", city: "پاوه" },
    "324": { province: "کرمانشاه", city: "کرمانشاه" },
    "325": { province: "کرمانشاه", city: "کرمانشاه" },
    "330": { province: "کرمانشاه", city: "کنگاور" },
    "331": { province: "کرمانشاه", city: "هرسین" },
    "332": { province: "کرمانشاه", city: "گیلانغرب" },
    "333": { province: "کرمانشاه", city: "اسلام آباد" },
    "334": { province: "کرمانشاه", city: "اسلام آباد" },
    "335": { province: "کرمانشاه", city: "سنقر" },
    "336": { province: "کرمانشاه", city: "سرپل ذهاب" },
    "337": { province: "هرمزگان", city: "حاجی آباد" },
    "338": { province: "هرمزگان", city: "بندرعباس" },
    "339": { province: "هرمزگان", city: "بندرعباس" },
    "341": { province: "هرمزگان", city: "میناب" },
    "342": { province: "هرمزگان", city: "میناب" },
    "343": { province: "هرمزگان", city: "بندرلنگه" },
    "344": { province: "هرمزگان", city: "بندرلنگه" },
    "345": { province: "هرمزگان", city: "قشم" },
    "346": { province: "هرمزگان", city: "جاسک" },
    "348": { province: "هرمزگان", city: "بستک" },
    "349": { province: "بوشهر", city: "بوشهر" },
    "350": { province: "بوشهر", city: "بوشهر" },
    "351": { province: "بوشهر", city: "دشتستان" },
    "352": { province: "بوشهر", city: "دشتستان" },
    "353": { province: "بوشهر", city: "بندر گناوه" },
    "354": { province: "بوشهر", city: "دشتی" },
    "355": { province: "بوشهر", city: "تنگستان" },
    "356": { province: "بوشهر", city: "کنگان" },
    "357": { province: "بوشهر", city: "دیر" },
    "358": { province: "سیستان و بلوچستان", city: "ایرانشهر" },
    "359": { province: "سیستان و بلوچستان", city: "ایرانشهر" },
    "361": { province: "سیستان و بلوچستان", city: "زاهدان" },
    "362": { province: "سیستان و بلوچستان", city: "زاهدان" },
    "364": { province: "سیستان و بلوچستان", city: "چابهار" },
    "365": { province: "سیستان و بلوچستان", city: "چابهار" },
    "366": { province: "سیستان و بلوچستان", city: "زابل" },
    "367": { province: "سیستان و بلوچستان", city: "زابل" },
    "369": { province: "سیستان و بلوچستان", city: "سراوان" },
    "370": { province: "سیستان و بلوچستان", city: "سراوان" },
    "371": { province: "سیستان و بلوچستان", city: "خاش" },
    "372": { province: "کردستان", city: "سنندج" },
    "373": { province: "کردستان", city: "سنندج" },
    "375": { province: "کردستان", city: "سقز" },
    "376": { province: "کردستان", city: "سقز" },
    "377": { province: "کردستان", city: "بیجار" },
    "378": { province: "کردستان", city: "بیجار" },
    "379": { province: "کردستان", city: "قروه" },
    "380": { province: "کردستان", city: "قروه" },
    "381": { province: "کردستان", city: "مریوان" },
    "382": { province: "کردستان", city: "مریوان" },
    "383": { province: "کردستان", city: "کامیاران" },
    "384": { province: "کردستان", city: "بانه" },
    "385": { province: "کردستان", city: "دیواندره" },
    "386": { province: "همدان", city: "همدان" },
    "387": { province: "همدان", city: "همدان" },
    "392": { province: "همدان", city: "ملایر" },
    "393": { province: "همدان", city: "ملایر" },
    "394": { province: "کرمانشاه", city: "کرند" },
    "395": { province: "همدان", city: "نهاوند" },
    "396": { province: "همدان", city: "نهاوند" },
    "397": { province: "همدان", city: "تویسرکان" },
    "398": { province: "همدان", city: "رزن" },
    "399": { province: "همدان", city: "رزن" },
    "400": { province: "همدان", city: "اسدآباد" },
    "401": { province: "همدان", city: "اسدآباد" },
    "402": { province: "همدان", city: "کبودرآهنگ" },
    "403": { province: "همدان", city: "کبودرآهنگ" },
    "404": { province: "همدان", city: "بهار" },
    "405": { province: "همدان", city: "بهار" },
    "406": { province: "لرستان", city: "خرم آباد" },
    "407": { province: "لرستان", city: "خرم آباد" },
    "412": { province: "لرستان", city: "بروجرد" },
    "413": { province: "لرستان", city: "بروجرد" },
    "416": { province: "لرستان", city: "الیگودرز" },
    "417": { province: "لرستان", city: "الیگودرز" },
    "418": { province: "لرستان", city: "الشتر" },
    "419": { province: "لرستان", city: "کوهدشت" },
    "420": { province: "لرستان", city: "نورآباد(دلفان)" },
    "421": { province: "لرستان", city: "دورود" },
    "422": { province: "کهگیلویه و بویراحمد", city: "بویراحمد(یاسوج)" },
    "423": { province: "کهگیلویه و بویراحمد", city: "بویراحمد(یاسوج)" },
    "424": { province: "کهگیلویه و بویراحمد", city: "کهکیلویه(دهدشت)" },
    "425": { province: "کهگیلویه و بویراحمد", city: "کهکیلویه(دهدشت)" },
    "426": { province: "کهگیلویه و بویراحمد", city: "گچساران(دوگنبدان)" },
    "427": { province: "زنجان", city: "زنجان" },
    "428": { province: "زنجان", city: "زنجان" },
    "431": { province: "قزوین", city: "قزوین" },
    "432": { province: "قزوین", city: "قزوین" },
    "438": { province: "قزوین", city: "تاکستان" },
    "439": { province: "قزوین", city: "تاکستان" },
    "442": { province: "یزد", city: "یزد" },
    "443": { province: "یزد", city: "یزد" },
    "444": { province: "یزد", city: "اردکان" },
    "445": { province: "یزد", city: "تفت" },
    "446": { province: "یزد", city: "مهریز" },
    "447": { province: "یزد", city: "بافق" },
    "448": { province: "یزد", city: "میبد" },
    "449": { province: "ایلام", city: "ایلام" },
    "450": { province: "ایلام", city: "ایلام" },
    "451": { province: "ایلام", city: "دهلران" },
    "452": { province: "ایلام", city: "مهران" },
    "453": { province: "ایلام", city: "شیروان و چرداول" },
    "454": { province: "ایلام", city: "آبدانان" },
    "455": { province: "ایلام", city: "دره شهر" },
    "456": { province: "سمنان", city: "سمنان" },
    "457": { province: "سمنان", city: "دامغان" },
    "458": { province: "سمنان", city: "شاهرود" },
    "459": { province: "سمنان", city: "شاهرود" },
    "460": { province: "سمنان", city: "گرمسار" },
    "461": { province: "چهارمحال و بختیاری", city: "شهرکرد" },
    "462": { province: "چهارمحال و بختیاری", city: "شهرکرد" },
    "465": { province: "چهارمحال و بختیاری", city: "بروجن" },
    "466": { province: "چهارمحال و بختیاری", city: "لردگان" },
    "467": { province: "چهارمحال و بختیاری", city: "فارسان" },
    "468": { province: "چهارمحال و بختیاری", city: "اردل" },
    "469": { province: "هرمزگان", city: "رودان" },
    "470": { province: "هرمزگان", city: "گاوبندی" },
    "471": { province: "امور خارجه", city: "امور خارجه" },
    "472": { province: "امور خارجه", city: "امور خارجه" },
    "481": { province: "خوزستان", city: "باغ ملک" },
    "483": { province: "مازندران", city: "چالوس" },
    "484": { province: "لرستان", city: "ازنا" },
    "486": { province: "گلستان", city: "کلاله" },
    "487": { province: "گلستان", city: "رامیان" },
    "488": { province: "گلستان", city: "مینودشت" },
    "489": { province: "تهران", city: "ساوجبلاغ" },
    "490": { province: "تهران", city: "شهریار" },
    "491": { province: "تهران", city: "شهریار" },
    "492": { province: "آذربایجان غربی", city: "پلدشت" },
    "493": { province: "آذربایجان غربی", city: "چایپاره" },
    "496": { province: "کرمانشاه", city: "صحنه" },
    "497": { province: "گلستان", city: "آق قلا" },
    "498": { province: "مازندران", city: "بابلسر" },
    "499": { province: "مازندران", city: "نکاء" },
    "500": { province: "مازندران", city: "هراز و محمودآباد" },
    "501": { province: "مازندران", city: "هراز و محمودآباد" },
    "502": { province: "همدان", city: "فامنین" },
    "503": { province: "یزد", city: "ابرکوه" },
    "504": { province: "اردبیل", city: "پارس آباد" },
    "505": { province: "آذربایجان شرقی", city: "جلفا" },
    "506": { province: "آذربایجان شرقی", city: "عجب شیر" },
    "507": { province: "آذربایجان شرقی", city: "ملکان" },
    "508": { province: "قزوین", city: "آبیک" },
    "509": { province: "قزوین", city: "بوئین زهرا" },
    "510": { province: "اصفهان", city: "شاهین شهر" },
    "511": { province: "اصفهان", city: "شاهین شهر" },
    "512": { province: "اصفهان", city: "سمیرم سفلی (دهاقان)" },
    "513": { province: "فارس", city: "بوانات" },
    "514": { province: "فارس", city: "سروستان" },
    "515": { province: "فارس", city: "لامرد" },
    "516": { province: "گیلان", city: "ماسال و شاندرمن" },
    "517": { province: "گیلان", city: "سیاهکل" },
    "518": { province: "گیلان", city: "خمام" },
    "519": { province: "آذربایجان شرقی", city: "کلیبر" },
    "520": { province: "سمنان", city: "میامی" },
    "521": { province: "خراسان رضوی", city: "جغتای" },
    "522": { province: "خراسان رضوی", city: "چناران" },
    "523": { province: "خراسان جنوبی", city: "درمیان" },
    "524": { province: "خراسان شمالی", city: "مانه و سملقان" },
    "525": { province: "سیستان و بلوچستان", city: "نیک شهر" },
    "526": { province: "خوزستان", city: "شوش" },
    "527": { province: "خوزستان", city: "آغاجاری" },
    "528": { province: "لرستان", city: "ویسیان" },
    "529": { province: "بوشهر", city: "بندر دیلم" },
    "530": { province: "سمنان", city: "مهدیشهر" },
    "531": { province: "گلستان", city: "مراوه تپه" },
    "532": { province: "بوشهر", city: "سعد آباد" },
    "533": { province: "سیستان و بلوچستان", city: "شهرکی و ناروئی(زهک)" },
    "534": { province: "ایلام", city: "بدره" },
    "535": { province: "کرمان", city: "کوهبنان" },
    "536": { province: "کرمان", city: "رودبار کهنوج" },
    "537": { province: "هرمزگان", city: "فین" },
    "538": { province: "قزوین", city: "آوج" },
    "540": { province: "اصفهان", city: "خور و بیابانک" },
    "541": { province: "اصفهان", city: "مبارکه" },
    "542": { province: "کرمان", city: "انار" },
    "543": { province: "یزد", city: "هرات و مروست" },
    "544": { province: "مرکزی", city: "فراهان" },
    "545": { province: "آذربایجان شرقی", city: "ترکمانچای" },
    "546": { province: "فارس", city: "بیضا" },
    "547": { province: "فارس", city: "خشت و کمارج" },
    "548": { province: "فارس", city: "خرامه" },
    "549": { province: "اصفهان", city: "تیران و کرون" },
    "550": { province: "کهگیلویه و بویراحمد", city: "لنده" },
    "551": { province: "یزد", city: "اشکذر" },
    "552": { province: "یزد", city: "نیر" },
    "553": { province: "خراسان رضوی", city: "کلات" },
    "554": { province: "هرمزگان", city: "خمیر" },
    "555": { province: "چهارمحال و بختیاری", city: "کوهرنگ" },
    "556": { province: "تهران", city: "اسلامشهر" },
    "557": { province: "لرستان", city: "اشترینان" },
    "558": { province: "کردستان", city: "دهگلان" },
    "559": { province: "قزوین", city: "ضیاءآباد" },
    "561": { province: "یزد", city: "بهاباد" },
    "562": { province: "خراسان رضوی", city: "بجستان" },
    "563": { province: "خراسان جنوبی", city: "نهبندان" },
    "564": { province: "اصفهان", city: "جرقویه" },
    "565": { province: "اصفهان", city: "کوهپایه" },
    "566": { province: "اردبیل", city: "سنجبد(کوثر)" },
    "567": { province: "آذربایجان شرقی", city: "ورزقان" },
    "568": { province: "مازندران", city: "بندپی" },
    "569": { province: "گیلان", city: "شفت" },
    "570": { province: "گیلان", city: "رضوانشهر" },
    "571": { province: "مرکزی", city: "وفس" },
    "572": { province: "خراسان رضوی", city: "بردسکن" },
    "573": { province: "خراسان رضوی", city: "جوین" },
    "574": { province: "خراسان رضوی", city: "زبرخان" },
    "575": { province: "اصفهان", city: "چادگان" },
    "576": { province: "مازندران", city: "چهاردانگه" },
    "577": { province: "مازندران", city: "شیرگاه" },
    "578": { province: "مازندران", city: "دودانگه" },
    "579": { province: "مازندران", city: "گلوگاه" },
    "580": { province: "قزوین", city: "رودبار الموت" },
    "581": { province: "ایلام", city: "ارکوازی(ملکشاهی)" },
    "582": { province: "مازندران", city: "جویبار" },
    "583": { province: "کرمان", city: "رابر" },
    "584": { province: "همدان", city: "قلقل رود" },
    "585": { province: "خوزستان", city: "اروندکنار" },
    "586": { province: "هرمزگان", city: "بشاگرد" },
    "588": { province: "قزوین", city: "طارم سفلی" },
    "590": { province: "قزوین", city: "رودبار شهرستان" },
    "591": { province: "خراسان شمالی", city: "رازوجرکلان" },
    "592": { province: "لرستان", city: "پاپی" },
    "593": { province: "گیلان", city: "عمارلو" },
    "595": { province: "کرمانشاه", city: "ثلاث باباجانی" },
    "596": { province: "کرمانشاه", city: "روانسر" },
    "597": { province: "سیستان و بلوچستان", city: "لاشار(اسپکه)" },
    "598": { province: "لرستان", city: "رومشکان" },
    "599": { province: "کهگیلویه و بویراحمد", city: "بهمنی" },
    "600": { province: "کهگیلویه و بویراحمد", city: "چاروسا" },
    "601": { province: "اردبیل", city: "بیله سوار" },
    "603": { province: "اردبیل", city: "نیر" },
    "604": { province: "آذربایجان شرقی", city: "هوراند" },
    "605": { province: "کرمان", city: "ریگان" },
    "606": { province: "کرمان", city: "عنبرآباد" },
    "607": { province: "کرمان", city: "ماهان" },
    "608": { province: "کرمان", city: "منوجان" },
    "609": { province: "بوشهر", city: "جم" },
    "610": { province: "بوشهر", city: "شبانکاره" },
    "611": { province: "سیستان و بلوچستان", city: "میرجاوه" },
    "612": { province: "لرستان", city: "چغلوندی" },
    "613": { province: "لرستان", city: "چگنی" },
    "615": { province: "زنجان", city: "ابهر و خرمدره" },
    "616": { province: "ایلام", city: "ایوان" },
    "617": { province: "مرکزی", city: "خنداب" },
    "618": { province: "مرکزی", city: "زرند مرکزی" },
    "619": { province: "اصفهان", city: "آران و بیدگل" },
    "620": { province: "اصفهان", city: "باغ بهادران" },
    "621": { province: "اصفهان", city: "بوئین و میاندشت" },
    "622": { province: "اصفهان", city: "میمه" },
    "623": { province: "گلستان", city: "آزادشهر" },
    "625": { province: "مازندران", city: "چمستان" },
    "626": { province: "مازندران", city: "کجور" },
    "627": { province: "مازندران", city: "کلاردشت" },
    "628": { province: "گلستان", city: "گمیشان" },
    "629": { province: "چهارمحال و بختیاری", city: "گندمان" },
    "630": { province: "گیلان", city: "املش" },
    "631": { province: "گیلان", city: "رحیم آباد" },
    "632": { province: "چهارمحال و بختیاری", city: "فلارد" },
    "633": { province: "چهارمحال و بختیاری", city: "کیار" },
    "634": { province: "ایلام", city: "شیروان لومار" },
    "635": { province: "سیستان و بلوچستان", city: "سرباز" },
    "636": { province: "آذربایجان شرقی", city: "چاروایماق" },
    "637": { province: "آذربایجان غربی", city: "انزل" },
    "638": { province: "آذربایجان غربی", city: "سیلوانه" },
    "640": { province: "آذربایجان غربی", city: "شوط" },
    "641": { province: "کرمانشاه", city: "حمیل" },
    "642": { province: "سمنان", city: "بیارجمند" },
    "643": { province: "خراسان رضوی", city: "احمدآباد" },
    "644": { province: "خراسان رضوی", city: "تخت جلگه" },
    "646": { province: "کردستان", city: "سروآباد" },
    "647": { province: "همدان", city: "شراء و پیشخوار" },
    "648": { province: "فارس", city: "ارسنجان" },
    "649": { province: "فارس", city: "اوز" },
    "650": { province: "خراسان رضوی", city: "رشتخوار" },
    "651": { province: "خراسان رضوی", city: "فیض آباد" },
    "652": { province: "خراسان جنوبی", city: "زیرکوه" },
    "653": { province: "گیلان", city: "سنگر" },
    "654": { province: "فارس", city: "حاجی آباد(زرین دشت)" },
    "655": { province: "فارس", city: "خفر" },
    "656": { province: "فارس", city: "کراش" },
    "657": { province: "فارس", city: "مهر" },
    "658": { province: "تهران", city: "پاکدشت" },
    "659": { province: "تهران", city: "فیروزکوه" },
    "660": { province: "اصفهان", city: "دولت آباد" },
    "661": { province: "خوزستان", city: "هندیجان" },
    "662": { province: "خوزستان", city: "رامشیر" },
    "663": { province: "خوزستان", city: "اندیکا" },
    "664": { province: "تهران", city: "کهریزک" },
    "665": { province: "فارس", city: "سعادت آباد" },
    "666": { province: "تهران", city: "رباط کریم" },
    "667": { province: "هرمزگان", city: "ابوموسی" },
    "668": { province: "سیستان و بلوچستان", city: "سیب و سوران" },
    "669": { province: "سیستان و بلوچستان", city: "قصرقند" },
    "670": { province: "فارس", city: "آباده طشک" },
    "671": { province: "فارس", city: "جویم" },
    "673": { province: "فارس", city: "شیبکوه" },
    "674": { province: "کردستان", city: "کرانی" },
    "675": { province: "آذربایجان غربی", city: "کشاورز" },
    "676": { province: "کردستان", city: "نمشیر" },
    "677": { province: "آذربایجان غربی", city: "تخت سلیمان" },
    "678": { province: "فارس", city: "اشکنان" },
    "679": { province: "فارس", city: "فراشبند" },
    "680": { province: "خوزستان", city: "هویزه" },
    "681": { province: "فارس", city: "قنقری(خرم بید)" },
    "682": { province: "سیستان و بلوچستان", city: "بزمان" },
    "683": { province: "فارس", city: "کوار" },
    "684": { province: "سمنان", city: "ایوانکی" },
    "685": { province: "خوزستان", city: "امیدیه" },
    "686": { province: "اردبیل", city: "نمین" },
    "687": { province: "کهگیلویه و بویراحمد", city: "باشت" },
    "688": { province: "کهگیلویه و بویراحمد", city: "دروهان" },
    "689": { province: "گلستان", city: "بندرگز" },
    "690": { province: "اردبیل", city: "انگوت" },
    "691": { province: "کرمانشاه", city: "باینگان" },
    "692": { province: "خوزستان", city: "سردشت" },
    "693": { province: "گیلان", city: "کوچصفهان" },
    "694": { province: "گیلان", city: "لشت نشاء" },
    "695": { province: "تهران", city: "طالقان" },
    "696": { province: "چهارمحال و بختیاری", city: "میانکوه" },
    "697": { province: "کهگیلویه و بویراحمد", city: "مارگون" },
    "698": { province: "کرمان", city: "قلعه گنج" },
    "699": { province: "سیستان و بلوچستان", city: "فنوج" },
    "700": { province: "سمنان", city: "بسطام" },
    "701": { province: "سیستان و بلوچستان", city: "دشتیاری" },
    "702": { province: "قم", city: "کهک" },
    "703": { province: "سیستان و بلوچستان", city: "بمپور" },
    "704": { province: "سیستان و بلوچستان", city: "زابلی" },
    "705": { province: "سیستان و بلوچستان", city: "شیب آب" },
    "706": { province: "خوزستان", city: "بندر امام خمینی" },
    "707": { province: "خوزستان", city: "شاوور" },
    "711": { province: "مازندران", city: "بندپی شرقی" },
    "712": { province: "مازندران", city: "عباس آباد" },
    "713": { province: "مازندران", city: "میاندورود" },
    "714": { province: "اردبیل", city: "خورش رستم" },
    "715": { province: "اردبیل", city: "سرعین" },
    "716": { province: "خراسان جنوبی", city: "سربیشه" },
    "717": { province: "تهران", city: "نظرآباد" },
    "718": { province: "یزد", city: "دستگردان" },
    "719": { province: "خراسان جنوبی", city: "سرایان" },
    "720": { province: "سیستان و بلوچستان", city: "راسک" },
    "721": { province: "خراسان جنوبی", city: "بشرویه" },
    "722": { province: "کرمان", city: "ارزونیه" },
    "723": { province: "فارس", city: "قیروکارزین" },
    "724": { province: "خراسان رضوی", city: "خلیل آباد" },
    "725": { province: "سیستان و بلوچستان", city: "کنارک" },
    "726": { province: "ایلام", city: "زرین آباد" },
    "727": { province: "ایلام", city: "موسیان" },
    "728": { province: "قزوین", city: "البرز" },
    "729": { province: "خوزستان", city: "گتوند" },
    "730": { province: "خوزستان", city: "لالی" },
    "731": { province: "اردبیل", city: "ارشق" },
    "732": { province: "بوشهر", city: "دلوار" }
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
  const [nationalId, setNationalId] = useState('');

  const result = useMemo(() => {
    const cleanId = nationalId.replace(/-/g, '');
    if (cleanId.length !== 10) return null;
    return validateNationalId(cleanId);
  }, [nationalId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue.length > 10) return;
    
    let formattedValue = rawValue;
    if (rawValue.length > 3) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    }
    if (rawValue.length > 9) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 9)}-${rawValue.slice(9)}`;
    }
    setNationalId(formattedValue);
  };
  

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="national-id-input" className="text-muted-foreground">شماره ملی را وارد کنید</Label>
        
        <div className="relative w-full max-w-sm mx-auto p-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 glass-effect" dir="ltr">
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

            <div className="mt-8">
              <Input
                  id="national-id-input"
                  type="tel"
                  inputMode='numeric'
                  value={nationalId}
                  onChange={handleInputChange}
                  placeholder="--- - ------ - -"
                  maxLength={12}
                  className="w-full h-12 text-center text-3xl font-display tracking-[.25em] bg-transparent border-none focus:ring-0 focus:ring-offset-0"
              />
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
        nationalId.replace(/-/g, '').length === 10 ? (
           <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
                <p>در حال بررسی...</p>
            </div>
        ) : (
             <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
                <p>شماره ملی ۱۰ رقمی خود را وارد کنید.</p>
            </div>
        )
      )}
    </CardContent>
  );
}
