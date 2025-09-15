// Gregorian to Jalali conversion
export function gregorianToJalali(gDate: Date) {
  const gy = gDate.getFullYear();
  const gm = gDate.getMonth() + 1;
  const gd = gDate.getDate();

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const jy = (gy <= 1600) ? 0 : 979;
  let g_y = (gy <= 1600) ? gy - 621 : gy - 1600;
  let g_day_no = 365 * g_y + Math.floor((g_y + 3) / 4) - Math.floor((g_y + 99) / 100) + Math.floor((g_y + 399) / 400);
  g_day_no = g_day_no + g_d_m[gm - 1] + gd;
  if (gm > 2 && (((g_y % 4 === 0) && (g_y % 100 !== 0)) || (g_y % 400 === 0)))
    g_day_no++;
  
  let j_day_no = g_day_no - 79;
  const j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;
  let j_y = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;
  if (j_day_no >= 366) {
    j_y += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }
  let jm, jd;
  let i = 0;
  for (i = 0; i < 11 && j_day_no >= [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29][i]; i++) {
    j_day_no -= [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29][i];
  }
  jm = i + 1;
  jd = j_day_no + 1;

  return { jy: j_y, jm: jm, jd: jd };
}

// Jalali to Gregorian conversion
export function jalaliToGregorian(jy: number, jm: number, jd: number) {
  const gy = (jy <= 979) ? 621 : 1600;
  jy = (jy <= 979) ? jy : jy - 979;

  let j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
  for (let i = 1; i < jm; ++i)
    j_day_no += (i < 7) ? 31 : 30;
  j_day_no += jd - 1;

  let g_day_no = j_day_no + 79;
  let g_y = gy + 400 * Math.floor(g_day_no / 146097);
  g_day_no = g_day_no % 146097;
  let leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    g_y += 100 * Math.floor(g_day_no / 36524);
    g_day_no = g_day_no % 36524;
    if (g_day_no >= 365)
      g_day_no++;
    else
      leap = false;
  }
  g_y += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;
  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    g_y += Math.floor(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }
  let i = 0;
  for (i = 0; g_day_no >= [31, (leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]; i++)
    g_day_no -= [31, (leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
  
  const gm = i + 1;
  const gd = g_day_no + 1;
  
  return { gy: g_y, gm: gm, gd: gd };
}
