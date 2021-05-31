const ALL_COUNTER_TYPE = [
  'days_left',
  'days_passed',
  'weeks_left',
  'weeks_passed',
  'percent_left',
  'percent_passed',
];

export type CounterType = typeof ALL_COUNTER_TYPE[number];

export const counterTypeList: Array<CounterType> = ALL_COUNTER_TYPE;

export type Timer = {
  title: string;
  start_date: number;
  end_date: number;
};

export type Panel = 'main';

export type ctxValue = {
  setPanel: (panel: Panel) => void;
};
