import React, { FC } from 'react';
import { CounterType, counterTypeList, Timer } from '../types';
import { getDays, getWeeks, daysLeft, numberCase } from '../date';

import './Counter.css';

export interface CounterProps {
  timer: Timer;
}

export interface CounterState {
  counterType: CounterType;
}

const CounterDaysLeft: FC<{ timer: Timer }> = ({ timer }: { timer: Timer }) => {
  const count = daysLeft(timer.end_date);
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Остался', 'Осталось')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">
          {numberCase(count, 'день', 'дня', 'дней')}
        </span>
      </div>
    </>
  );
};

const CounterDaysPassed: FC<{ timer: Timer }> = ({
  timer,
}: {
  timer: Timer;
}) => {
  const count = getDays(new Date(timer.start_date * 1000), new Date());
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Прошел', 'Прошло')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">
          {numberCase(count, 'день', 'дня', 'дней')}
        </span>
      </div>
    </>
  );
};

const CounterWeeksLeft: FC<{ timer: Timer }> = ({
  timer,
}: {
  timer: Timer;
}) => {
  const count = getWeeks(new Date(), new Date(timer.end_date * 1000));
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Остался', 'Осталось')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">
          {numberCase(count, 'неделя', 'недели', 'недель')}
        </span>
      </div>
    </>
  );
};

const CounterWeeksPassed: FC<{ timer: Timer }> = ({
  timer,
}: {
  timer: Timer;
}) => {
  const count = getWeeks(new Date(timer.start_date * 1000), new Date());
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Прошел', 'Прошло')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">
          {numberCase(count, 'неделя', 'недели', 'недель')}
        </span>
      </div>
    </>
  );
};

const CounterPercentLeft: FC<{ timer: Timer }> = ({
  timer,
}: {
  timer: Timer;
}) => {
  const now_time = new Date().getTime() / 1000;
  const count = +(
    ((timer.end_date - now_time) * 100) /
    (timer.end_date - timer.start_date)
  ).toFixed(1);
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Остался', 'Осталось')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">%</span>
      </div>
    </>
  );
};

const CounterPercentPassed: FC<{ timer: Timer }> = ({
  timer,
}: {
  timer: Timer;
}) => {
  const now_time = new Date().getTime() / 1000;
  const count = +(
    ((now_time - timer.start_date) * 100) /
    (timer.end_date - timer.start_date)
  ).toFixed(1);
  return (
    <>
      <div className="Counter__description">
        {numberCase(count, 'Прошел', 'Прошло')}
      </div>
      <div className="Counter__number">
        {count}
        <span className="Counter__unit">%</span>
      </div>
    </>
  );
};

class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);

    const counterType: CounterType = localStorage.getItem('counter-type')
      ? (localStorage.getItem('counter-type') as CounterType)
      : 'days_left';
    this.state = {
      counterType,
    };
  }

  render(): JSX.Element {
    const { timer } = this.props;
    const { counterType } = this.state;

    return (
      <div
        onClick={() => {
          let index = counterTypeList.indexOf(counterType) + 1;
          if (index >= counterTypeList.length) index = 0;
          this.setState({
            counterType: counterTypeList[index],
          });
          localStorage.setItem('counter-type', counterTypeList[index]);
        }}
      >
        {
          {
            days_left: <CounterDaysLeft timer={timer} />,
            days_passed: <CounterDaysPassed timer={timer} />,
            weeks_left: <CounterWeeksLeft timer={timer} />,
            weeks_passed: <CounterWeeksPassed timer={timer} />,
            percent_left: <CounterPercentLeft timer={timer} />,
            percent_passed: <CounterPercentPassed timer={timer} />,
          }[counterType]
        }
      </div>
    );
  }
}

export default Counter;
