export type DatePickerLocale = 'zh-CN' | 'en-US';

export const MONTH_NAMES: Record<DatePickerLocale, string[]> = {
  'zh-CN': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  'en-US': [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

// Indexed by JS weekday (0 = Sunday).
export const WEEKDAY_NAMES: Record<DatePickerLocale, string[]> = {
  'zh-CN': ['日', '一', '二', '三', '四', '五', '六'],
  'en-US': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export const CALENDAR_LABELS: Record<
  DatePickerLocale,
  { prevMonth: string; nextMonth: string }
> = {
  'zh-CN': { prevMonth: '上个月', nextMonth: '下个月' },
  'en-US': { prevMonth: 'Previous month', nextMonth: 'Next month' },
};
