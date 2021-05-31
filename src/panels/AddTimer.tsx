import React from 'react';
import {
  PanelHeader,
  PanelHeaderClose,
  FormItem,
  FormLayout,
  Button,
  Input,
  DatePickerDateFormat,
} from '@vkontakte/vkui';

import type { Timer } from '../types';
import { getTime } from '../date';
import DatePicker from '../components/DatePicker/DatePicker';

interface AddTimerState {
  title: string;
  start_date: DatePickerDateFormat;
  end_date: DatePickerDateFormat;
}

export interface AddTimerProps {
  goBack: () => void;
  newTimer: (newTimer: Timer) => void;
}

export class AddTimer extends React.Component<AddTimerProps, AddTimerState> {
  constructor(props: AddTimerProps) {
    super(props);
    const nowDate = new Date();

    this.state = {
      title: 'Таймер',
      start_date: {
        day: nowDate.getDate(),
        month: nowDate.getMonth() + 1,
        year: nowDate.getFullYear(),
      },
      end_date: {
        day: nowDate.getDate(),
        month: nowDate.getMonth() + 1,
        year: nowDate.getFullYear() + 1,
      },
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    this.setState({ title: value });
  }

  render(): JSX.Element {
    const { goBack, newTimer } = this.props;
    const { title, start_date, end_date } = this.state;

    return (
      <>
        <PanelHeader
          separator={false}
          left={<PanelHeaderClose onClick={() => goBack()} />}
        >
          Счетчик
        </PanelHeader>
        <FormLayout>
          <FormItem top="Название">
            <Input
              name="title"
              value={title}
              type="text"
              maxLength={20}
              onChange={this.onChangeTitle}
            />
          </FormItem>
          <FormItem top="Начало службы">
            <DatePicker
              min={{ day: 1, month: 1, year: 1901 }}
              max={{ day: 1, month: 1, year: 2061 }}
              value={start_date}
              onDateChange={(value) => {
                this.setState({
                  start_date: value,
                  end_date: {
                    day: value.day,
                    month: value.month,
                    year: value.year + 1,
                  },
                });
              }}
            />
          </FormItem>

          <FormItem top="Конец службы">
            <DatePicker
              min={start_date}
              max={{ day: 1, month: 1, year: 2061 }}
              value={end_date}
              onDateChange={(value) => {
                this.setState({ end_date: value });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              size="l"
              onClick={() => {
                newTimer({
                  title: title,
                  start_date: getTime(start_date),
                  end_date: getTime(end_date),
                });
                goBack();
              }}
              disabled={title.length === 0}
              stretched
            >
              Создать
            </Button>
          </FormItem>
        </FormLayout>
      </>
    );
  }
}
