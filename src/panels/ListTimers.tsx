import React from 'react';
import {
  PanelHeader,
  Cell,
  List,
  PanelHeaderClose,
  CellButton,
  Footer,
  Avatar,
  Snackbar,
} from '@vkontakte/vkui';
import type { Timer } from '../types';
import { daysLeft, getDate, getDayName } from '../date';
import {
  Icon16Clear,
  Icon16WarningTriangle,
  Icon28AddOutline,
} from '@vkontakte/icons';
import { loadEruda } from '../eruda';

interface ListTimersState {
  activeEruda: boolean;
  counterEruda: number;
  snackbar: JSX.Element | null;
}

export interface ListTimersProps {
  // setView: (view: string, name?: string) => void;
  setPanel: (name: string) => void;
  goBack: () => void;
  timers: Array<Timer>;
  reorderTimers: ({ from, to }: { from: number; to: number }) => void;
  choseSlide: (n: number) => void;
}

export class ListTimers extends React.Component<
  ListTimersProps,
  ListTimersState
> {
  constructor(props: ListTimersProps) {
    super(props);

    this.state = {
      activeEruda: localStorage.getItem('active-eruda') === 'true',
      counterEruda: 0,
      snackbar: null,
    };
  }

  /**
   * Показывает ошибку
   *
   * @param msg текст ошибки
   * @param duration время показа ошибки в ms
   */
  error = (msg: string, duration = 4e3) => {
    if (this.state.snackbar) return;
    this.setState({
      snackbar: (
        <Snackbar
          layout="vertical"
          duration={duration}
          onClose={() => this.setState({ snackbar: null })}
          before={
            <Avatar size={24} style={{ backgroundColor: 'var(--dynamic_red)' }}>
              <Icon16Clear fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          {msg}
        </Snackbar>
      ),
    });
  };

  /**
   * Показывает предупреждение
   *
   * @param msg текст предупреждения
   * @param duration время показа предупреждения в ms
   */
  warn = (msg: string, duration = 4e3) => {
    if (this.state.snackbar) return;
    this.setState({
      snackbar: (
        <Snackbar
          layout="vertical"
          duration={duration}
          onClose={() => this.setState({ snackbar: null })}
          before={
            <Avatar
              size={24}
              style={{ backgroundColor: 'var(--dynamic_orange)' }}
            >
              <Icon16WarningTriangle fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          {msg}
        </Snackbar>
      ),
    });
  };

  render(): JSX.Element {
    const { setPanel, goBack, timers, reorderTimers, choseSlide } = this.props;
    const { activeEruda, counterEruda, snackbar } = this.state;

    const enableEruda = () => {
      this.setState({ counterEruda: counterEruda + 1 });
      if (counterEruda < 5) return;

      localStorage.setItem('active-eruda', 'true');
      this.setState({ activeEruda: true });
      loadEruda();
      this.warn('eruda активирована');
    };

    const disableEruda = () => {
      if (counterEruda > 4) return;
      localStorage.removeItem('active-eruda');
      this.setState({ activeEruda: false });
      this.warn('eruda деактивирована. Требуется перезагрузка');
    };
    return (
      <>
        <PanelHeader
          separator={false}
          left={<PanelHeaderClose onClick={() => goBack()} />}
        >
          Счетчики
        </PanelHeader>
        <List>
          {timers.map((item, index) => (
            <Cell
              key={index}
              description={getDate(item.end_date)}
              indicator={
                daysLeft(item.end_date) +
                ' ' +
                getDayName(daysLeft(item.end_date))
              }
              draggable
              onClick={() => {
                choseSlide(index);
                goBack();
              }}
              onDragFinish={reorderTimers}
            >
              {item.title}
            </Cell>
          ))}
        </List>
        <CellButton
          before={<Icon28AddOutline />}
          onClick={() => setPanel('add-timer')}
        >
          Добавить
        </CellButton>
        <Footer onClick={activeEruda ? disableEruda : enableEruda}>
          {'Версия ' + import.meta.env.VERSION}
        </Footer>
        {/*<Spacing separator size={16} />
        <SimpleCell href="https://vk.com/public204885774">Группа ВКонтакте</SimpleCell>
        <SimpleCell>Политика конфиденциальности</SimpleCell>
        <SimpleCell>Лицензия открытого ПО</SimpleCell>
        {activeEruda ? (
          <SimpleCell onClick={disableEruda}>Выключить eruda</SimpleCell>
        ) : (
          <SimpleCell onClick={enableEruda}>Включить eruda</SimpleCell>
        )}*/}
        {snackbar}
      </>
    );
  }
}
