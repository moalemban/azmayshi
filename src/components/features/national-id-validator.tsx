"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, CheckCircle, XCircle, MapPin, Building } from 'lucide-react';

// --- Data and Logic Embedded from user's suggestion ---

const cityCodes: { [key: string]: { province: string; city: string } } = {
    "001": { province: "تهران", city: "تهران" },
    "002": { province: "تهران", city: "تهران" },
    "003": { province: "تهران", city: "تهران" },
    "004": { province: "تهران", city: "تهران" },
    "005": { province: "تهران", city: "تهران" },
    "006": { province: "تهران", city: "تهران" },
    "007": { province: "تهران", city: "تهران" },
    "008": { province: "تهران", city: "حوزه شمیران" },
    "031": { province: "آذربایجان غربی", city: "آذربایجان غربی" },
    "032": { province: "اردبیل", city: "اردبیل" },
    "037": { province: "اصفهان", city: "اصفهان" },
    "038": { province: "اصفهان", city: "اصفهان" },
    "039": { province: "اصفهان", city: "حوزه کاشان" },
    "044": { province: "البرز", city: "کرج" },
    "045": { province: "البرز", city: "کرج" },
    "051": { province: "ایلام", city: "ایلام" },
    "052": { province: "ایلام", city: "ایلام" },
    "053": { province: "ایلام", city: "حوزه دهلران" },
    "061": { province: "بوشهر", city: "بوشهر" },
    "062": { province: "بوشهر", city: "بوشهر" },
    "063": { province: "بوشهر", city: "حوزه دشتستان" },
    "066": { province: "چهارمحال و بختیاری", city: "شهرکرد" },
    "067": { province: "چهارمحال و بختیاری", city: "شهرکرد" },
    "068": { province: "چهارمحال و بختیاری", city: "حوزه بروجن" },
    "076": { province: "خراسان جنوبی", city: "بیرجند" },
    "077": { province: "خراسان جنوبی", city: "بیرجند" },
    "078": { province: "خراسان جنوبی", city: "حوزه قائنات" },
    "081": { province: "خراسان رضوی", city: "مشهد" },
    "082": { province: "خراسان رضوی", city: "مشهد" },
    "083": { province: "خراسان رضوی", city: "مشهد" },
    "084": { province: "خراسان رضوی", city: "مشهد" },
    "085": { province: "خراسان رضوی", city: "حوزه کاشمر" },
    "086": { province: "خراسان رضوی", city: "حوزه گناباد" },
    "087": { province: "خراسان رضوی", city: "حوزه نیشابور" },
    "088": { province: "خراسان رضوی", city: "حوزه سبزوار" },
    "089": { province: "خراسان رضوی", city: "حوزه تربت حیدریه" },
    "090": { province: "خراسان رضوی", city: "حوزه قوچان" },
    "091": { province: "خراسان رضوی", city: "حوزه تربت جام" },
    "095": { province: "خراسان شمالی", city: "بجنورد" },
    "096": { province: "خراسان شمالی", city: "بجنورد" },
    "097": { province: "خراسان شمالی", city: "حوزه شیروان" },
    "105": { province: "خوزستان", city: "اهواز" },
    "106": { province: "خوزستان", city: "اهواز" },
    "121": { province: "زنجان", city: "زنجان" },
    "122": { province: "زنجان", city: "زنجان" },
    "123": { province: "زنجان", city: "حوزه ابهر" },
    "126": { province: "سمنان", city: "سمنان" },
    "127": { province: "سمنان", city: "حوزه شاهرود" },
    "128": { province: "سمنان", city: "حوزه دامغان" },
    "129": { province: "سمنان", city: "حوزه گرمسار" },
    "136": { province: "سیستان و بلوچستان", city: "زاهدان" },
    "137": { province: "سیستان و بلوچستان", city: "زاهدان" },
    "138": { province: "سیستان و بلوچستان", city: "حوزه ایرانشهر" },
    "139": { province: "سیستان و بلوچستان", city: "حوزه چابهار" },
    "149": { province: "فارس", city: "شیراز" },
    "150": { province: "فارس", city: "شیراز" },
    "151": { province: "فارس", city: "شیراز" },
    "152": { province: "فارس", city: "شیراز" },
    "153": { province: "فارس", city: "حوزه آباده" },
    "154": { province: "فارس", city: "حوزه کازرون" },
    "155": { province: "فارس", city: "حوزه فسا" },
    "159": { province: "قزوین", city: "قزوین" },
    "160": { province: "قزوین", city: "قزوین" },
    "168": { province: "قم", city: "قم" },
    "169": { province: "قم", city: "قم" },
    "176": { province: "کردستان", city: "سنندج" },
    "177": { province: "کردستان", city: "سنندج" },
    "178": { province: "کردستان", city: "حوزه سقز" },
    "181": { province: "کرمان", city: "کرمان" },
    "182": { province: "کرمان", city: "کرمان" },
    "183": { province: "کرمان", city: "حوزه سیرجان" },
    "184": { province: "کرمان", city: "حوزه رفسنجان" },
    "185": { province: "کرمان", city: "حوزه جیرفت" },
    "186": { province: "کرمان", city: "حوزه بم" },
    "191": { province: "کرمانشاه", city: "کرمانشاه" },
    "192": { province: "کرمانشاه", city: "کرمانشاه" },
    "193": { province: "کرمانشاه", city: "حوزه اسلام آباد غرب" },
    "201": { province: "کهگیلویه و بویراحمد", city: "یاسوج" },
    "202": { province: "کهگیلویه و بویراحمد", city: "حوزه گچساران" },
    "206": { province: "گلستان", city: "گرگان" },
    "207": { province: "گلستان", city: "گرگان" },
    "208": { province: "گلستان", city: "حوزه گنبد کاووس" },
    "211": { province: "گیلان", city: "رشت" },
    "212": { province: "گیلان", city: "رشت" },
    "213": { province: "گیلان", city: "حوزه لاهیجان" },
    "214": { province: "گیلان", city: "حوزه تالش" },
    "215": { province: "گیلان", city: "حوزه لنگرود" },
    "216": { province: "گیلان", city: "حوزه بندرانزلی" },
    "221": { province: "لرستان", city: "خرم آباد" },
    "222": { province: "لرستان", city: "خرم آباد" },
    "223": { province: "لرستان", city: "حوزه بروجرد" },
    "224": { province: "لرستان", city: "حوزه الیگودرز" },
    "225": { province: "لرستان", city: "حوزه دورود" },
    "228": { province: "مازندران", city: "ساری" },
    "229": { province: "مازندران", city: "ساری" },
    "230": { province: "مازندران", city: "حوزه آمل" },
    "231": { province: "مازندران", city: "حوزه بابل" },
    "232": { province: "مازندران", city: "حوزه تنکابن" },
    "233": { province: "مازندران", city: "حوزه قائمشهر" },
    "234": { province: "مازندران", city: "حوزه بهشهر" },
    "241": { province: "مرکزی", city: "اراک" },
    "242": { province: "مرکزی", city: "اراک" },
    "243": { province: "مرکزی", city: "حوزه ساوه" },
    "247": { province: "هرمزگان", city: "بندرعباس" },
    "248": { province: "هرمزگان", city: "بندرعباس" },
    "249": { province: "هرمزگان", city: "حوزه میناب" },
    "253": { province: "همدان", city: "همدان" },
    "254": { province: "همدان", city: "همدان" },
    "255": { province: "همدان", city: "حوزه ملایر" },
    "256": { province: "همدان", city: "حوزه نهاوند" },
    "257": { province: "همدان", city: "حوزه تویسرکان" },
    "259": { province: "یزد", city: "یزد" },
    "260": { province: "یزد", city: "یزد" },
    "269": { province: "آذربایجان شرقی", city: "تبریز" },
    "270": { province: "آذربایجان شرقی", city: "تبریز" },
    "271": { province: "آذربایجان شرقی", city: "تبریز" },
    "272": { province: "آذربایجان شرقی", city: "حوزه میانه" },
    "273": { province: "آذربایجان شرقی", city: "حوزه مراغه" },
    "274": { province: "آذربایجان شرقی", city: "حوزه اهر" },
    "275": { province: "آذربایجان شرقی", city: "حوزه مرند" },
    "276": { province: "آذربایجان غربی", city: "ارومیه" },
    "277": { province: "آذربایجان غربی", city: "ارومیه" },
    "278": { province: "آذربایجان غربی", city: "ارومیه" },
    "279": { province: "آذربایجان غربی", city: "حوزه خوی" },
    "280": { province: "آذربایجان غربی", city: "حوزه مهاباد" },
    "281": { province: "آذربایجان غربی", city: "حوزه میاندوآب" },
    "282": { province: "آذربایجان غربی", city: "حوزه سلماس" },
    "285": { province: "اردبیل", city: "حوزه خلخال" },
    "286": { province: "اردبیل", city: "حوزه مشگین شهر" },
    "291": { province: "اصفهان", city: "حوزه شهرضا" },
    "292": { province: "اصفهان", city: "حوزه نجف آباد" },
    "293": { province: "اصفهان", city: "حوزه خمینی شهر" },
    "294": { province: "اصفهان", city: "حوزه فلاورجان" },
    "295": { province: "اصفهان", city: "حوزه لنجان" },
    "296": { province: "اصفهان", city: "حوزه نائین" },
    "297": { province: "اصفهان", city: "حوزه گلپایگان" },
    "298": { province: "ایلام", city: "ایلام" },
    "303": { province: "بوشهر", city: "حوزه گناوه" },
    "304": { province: "بوشهر", city: "حوزه کنگان" },
    "307": { province: "تهران", city: "حوزه کرج" },
    "308": { province: "تهران", city: "حوزه کرج" },
    "309": { province: "تهران", city: "حوزه کرج" },
    "313": { province: "چهارمحال و بختیاری", city: "حوزه فارسان" },
    "314": { province: "چهارمحال و بختیاری", city: "حوزه لردگان" },
    "317": { province: "خراسان جنوبی", city: "حوزه فردوس" },
    "321": { province: "خراسان رضوی", city: "حوزه فریمان" },
    "324": { province: "خوزستان", city: "حوزه دزفول" },
    "325": { province: "خوزستان", city: "حوزه آبادان" },
    "326": { province: "خوزستان", city: "حوزه خرمشهر" },
    "327": { province: "خوزستان", city: "حوزه دشت آزادگان" },
    "328": { province: "خوزستان", city: "حوزه ماهشهر" },
    "329": { province: "خوزستان", city: "حوزه بهبهان" },
    "330": { province: "خوزستان", city: "حوزه اندیمشک" },
    "331": { province: "خوزستان", city: "حوزه رامهرمز" },
    "332": { province: "خوزستان", city: "حوزه مسجد سلیمان" },
    "333": { province: "خوزستان", city: "حوزه ایذه" },
    "334": { province: "خوزستان", city: "حوزه شوشتر" },
    "338": { province: "زنجان", city: "حوزه خدابنده" },
    "342": { province: "سیستان و بلوچستان", city: "حوزه زابل" },
    "347": { province: "فارس", city: "حوزه جهرم" },
    "348": { province: "فارس", city: "حوزه لارستان" },
    "349": { province: "فارس", city: "حوزه داراب" },
    "350": { province: "فارس", city: "حوزه نی ریز" },
    "351": { province: "فارس", city: "حوزه ممسنی" },
    "352": { province: "فارس", city: "حوزه سپیدان" },
    "353": { province: "فارس", city: "حوزه مرودشت" },
    "354": { province: "فارس", city: "حوزه فیروزآباد" },
    "358": { province: "قزوین", city: "حوزه تاکستان" },
    "363": { province: "کردستان", city: "حوزه بانه" },
    "364": { province: "کردستان", city: "حوزه بیجار" },
    "365": { province: "کردستان", city: "حوزه قروه" },
    "366": { province: "کردستان", city: "حوزه مریوان" },
    "370": { province: "کرمان", city: "حوزه شهربابک" },
    "371": { province: "کرمان", city: "حوزه بافت" },
    "372": { province: "کرمان", city: "حوزه کهنوج" },
    "373": { province: "کرمان", city: "حوزه زرند" },
    "376": { province: "کرمانشاه", city: "حوزه قصرشیرین" },
    "377": { province: "کرمانشاه", city: "حوزه پاوه" },
    "378": { province: "کرمانشاه", city: "حوزه گیلانغرب" },
    "379": { province: "کرمانشاه", city: "حوزه کنگاور" },
    "380": { province: "کرمانشاه", city: "حوزه سنقر" },
    "381": { province: "کرمانشاه", city: "حوزه هرسین" },
    "386": { province: "کهگیلویه و بویراحمد", city: "حوزه دهدشت" },
    "391": { province: "گلستان", city: "حوزه بندرترکمن" },
    "392": { province: "گلستان", city: "حوزه علی آباد کتول" },
    "396": { province: "گیلان", city: "حوزه رودسر" },
    "397": { province: "گیلان", city: "حوزه آستارا" },
    "398": { province: "گیلان", city: "حوزه رودبار" },
    "399": { province: "گیلان", city: "حوزه صومعه سرا" },
    "400": { province: "گیلان", city: "حوزه فومن" },
    "406": { province: "لرستان", city: "حوزه دلفان" },
    "407": { province: "لرستان", city: "حوزه ازنا" },
    "408": { province: "لرستان", city: "حوزه کوهدشت" },
    "409": { province: "لرستان", city: "حوزه الشتر" },
    "410": { province: "لرستان", city: "حوزه پلدختر" },
    "415": { province: "مازندران", city: "حوزه نور" },
    "416": { province: "مازندران", city: "حوزه نوشهر" },
    "417": { province: "مازندران", city: "حوزه چالوس" },
    "418": { province: "مازندران", city: "حوزه رامسر" },
    "419": { province: "مازندران", city: "حوزه سوادکوه" },
    "423": { province: "مرکزی", city: "حوزه خمین" },
    "424": { province: "مرکزی", city: "حوزه محلات" },
    "425": { province: "مرکزی", city: "حوزه تفرش" },
    "428": { province: "هرمزگان", city: "حوزه بندرلنگه" },
    "429": { province: "هرمزگان", city: "حوزه قشم" },
    "430": { province: "هرمزگان", city: "حوزه جاسک" },
    "433": { province: "همدان", city: "حوزه اسدآباد" },
    "434": { province: "همدان", city: "حوزه کبودرآهنگ" },
    "435": { province: "همدان", city: "حوزه رزن" },
    "438": { province: "یزد", city: "حوزه تفت" },
    "439": { province: "یزد", city: "حوزه اردکان" },
    "440": { province: "یزد", city: "حوزه بافق" },
    "441": { province: "یزد", city: "حوزه مهریز" },
    "442": { province: "یزد", city: "حوزه میبد" },
    "444": { province: "تهران", city: "حوزه ورامین" },
    "445": { province: "تهران", city: "حوزه ورامین" },
    "446": { province: "تهران", city: "حوزه ورامین" },
    "447": { province: "تهران", city: "حوزه شهریار" },
    "448": { province: "تهران", city: "حوزه شهریار" },
    "449": { province: "تهران", city: "حوزه شهریار" },
    "450": { province: "تهران", city: "حوزه فیروزکوه" },
    "451": { province: "تهران", city: "حوزه دماوند" },
    "452": { province: "تهران", city: "حوزه لواسان" },
    "453": { province: "تهران", city: "حوزه رباط کریم" },
    "454": { province: "تهران", city: "حوزه اسلامشهر" },
    "455": { province: "تهران", city: "حوزه پاکدشت" },
    "456": { province: "تهران", city: "حوزه نظرآباد" },
    "457": { province: "تهران", city: "حوزه ساوجبلاغ" },
    "458": { province: "تهران", city: "حوزه طالقان" },
    "459": { province: "تهران", city: "حوزه اشتهارد" },
    "461": { province: "توابع تهران", city: "توابع تهران" },
    "462": { province: "توابع تهران", city: "توابع تهران" },
    "463": { province: "توابع تهران", city: "توابع تهران" },
    "464": { province: "توابع تهران", city: "توابع تهران" },
    "465": { province: "توابع تهران", city: "توابع تهران" },
    "466": { province: "توابع تهران", city: "توابع تهران" },
    "467": { province: "توابع تهران", city: "توابع تهران" },
    "468": { province: "توابع تهران", city: "توابع تهران" },
    "469": { province: "توابع تهران", city: "توابع تهران" },
    "470": { province: "توابع تهران", city: "توابع تهران" },
    "471": { province: "توابع تهران", city: "توابع تهران" },
    "472": { province: "توابع تهران", city: "توابع تهران" },
    "473": { province: "توابع تهران", city: "توابع تهران" },
    "474": { province: "توابع تهران", city: "توابع تهران" },
    "475": { province: "توابع تهران", city: "توابع تهران" },
    "476": { province: "توابع تهران", city: "توابع تهران" },
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
    "500": { province: "توابع تهران", city: "توابع تهران" },
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

interface ValidationResult {
  isValid: boolean;
  message: string;
  province?: string;
  city?: string;
}

function getCityByCode(code: string): { province: string; city: string } | undefined {
    // This function can be expanded with more detailed ranges if needed.
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
    if (nationalId.length !== 10) return null;
    return validateNationalId(nationalId);
  }, [nationalId]);

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="national-id-input" className="text-muted-foreground">شماره ملی را وارد کنید</Label>
        <Input
          id="national-id-input"
          type="text"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={10}
          placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
          className="h-14 text-lg text-center tracking-[4px] font-mono"
          dir="ltr"
        />
      </div>

      {result ? (
        <div className={`p-4 rounded-lg shadow-inner text-center space-y-3 ${
            result.isValid 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className={`flex items-center justify-center gap-2 font-semibold ${
            result.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.isValid ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span>{result.message}</span>
          </div>

          {result.isValid && (
            <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
               <div className='flex items-center justify-center gap-2'>
                  <MapPin className='w-5 h-5 text-primary'/>
                  <p className="text-md text-foreground">
                    <span className="text-muted-foreground">استان:</span> {result.province || 'نامشخص'}
                  </p>
               </div>
               <div className='flex items-center justify-center gap-2'>
                  <Building className='w-5 h-5 text-muted-foreground'/>
                   <p className="text-md text-foreground">
                    <span className="text-muted-foreground">شهرستان:</span> {result.city || 'نامشخص'}
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
