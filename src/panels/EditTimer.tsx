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

interface EditTimerState {
  title: string;
  start_date: DatePickerDateFormat;
  end_date: DatePickerDateFormat;
}

export interface EditTimerProps {
  timer: Timer;
  index: number;
  goBack: () => void;
  editTimer: (i: number, t: Timer) => void;
}

export class EditTimer extends React.Component<EditTimerProps, EditTimerState> {
  constructor(props: EditTimerProps) {
    super(props);
    const startDate = new Date(props.timer.start_date * 1000);
    const endDate = new Date(props.timer.end_date * 1000);

    this.state = {
      title: props.timer.title,
      start_date: {
        day: startDate.getDate(),
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
      },
      end_date: {
        day: endDate.getDate(),
        month: endDate.getMonth() + 1,
        year: endDate.getFullYear(),
      },
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    this.setState({ title: value });
  }

  render(): JSX.Element {
    const { goBack, index, editTimer } = this.props;
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
                editTimer(index, {
                  title: title,
                  start_date: getTime(start_date),
                  end_date: getTime(end_date),
                });
                goBack();
              }}
              disabled={title.length === 0}
              stretched
            >
              Сохранить
            </Button>
          </FormItem>
        </FormLayout>
      </>
    );
  }
}
