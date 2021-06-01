import React from 'react';
import { Panel, AppRoot, View, Alert } from '@vkontakte/vkui';
import type {
  AppearanceSchemeType,
  UpdateConfigData,
} from '@vkontakte/vk-bridge';
import type { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';

import { Main } from './panels/Main';
import { ListTimers } from './panels/ListTimers';
import type { Timer } from './types';
import { AddTimer } from './panels/AddTimer';
import { EditTimer } from './panels/EditTimer';
import { Shared } from './panels/Shared';

interface AppState {
  scheme: AppearanceSchemeType;
  activeView: string;
  activePanel: string;
  popout?: React.ReactNode;
  history: Array<{ view: string; panel: string }>;

  indexSlide: number;
  timers: Array<Timer>;

  accessToken: string;
}

export interface AppProps {
  vkAPI: VKMiniAppAPI;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const panel = window.location.hash.startsWith('#shared')
      ? 'shared'
      : 'main';

    this.state = {
      scheme: 'bright_light',
      activeView: '',
      activePanel: panel,
      popout: null,
      history: [{ view: '', panel: 'main' }],

      indexSlide: 0,
      timers: [
        /*{
          title: 'Даня',
          start_date: getTime({ day: 9, month: 12, year: 2020 }),
          end_date: getTime({ day: 9, month: 12, year: 2021 }),
        },
        {
          title: 'Ваня',
          start_date: getTime({ day: 26, month: 11, year: 2020 }),
          end_date: getTime({ day: 26, month: 11, year: 2021 }),
        },
        {
          title: 'Леха',
          start_date: getTime({ day: 6, month: 7, year: 2020 }),
          end_date: getTime({ day: 6, month: 7, year: 2021 }),
        },
        {
          title: 'Егор',
          start_date: getTime({ day: 6, month: 11, year: 2020 }),
          end_date: getTime({ day: 6, month: 11, year: 2021 }),
        },
        {
          title: 'Паша',
          start_date: getTime({ day: 16, month: 11, year: 2020 }),
          end_date: getTime({ day: 16, month: 11, year: 2021 }),
        },
        {
          title: 'Рустам',
          start_date: getTime({ day: 31, month: 10, year: 2020 }),
          end_date: getTime({ day: 31, month: 10, year: 2021 }),
        },*/
      ],

      accessToken: '',
    };

    this.setView = this.setView.bind(this);
    this.setPanel = this.setPanel.bind(this);
    this.setPopout = this.setPopout.bind(this);
    this.goBack = this.goBack.bind(this);
    this.setTimers = this.setTimers.bind(this);
    this.newTimer = this.newTimer.bind(this);
    this.deleteTimer = this.deleteTimer.bind(this);
    this.reorderTimers = this.reorderTimers.bind(this);
    this.choseSlide = this.choseSlide.bind(this);
  }

  componentDidMount(): void {
    const { vkAPI } = this.props;

    vkAPI.onUpdateConfig((data: UpdateConfigData) => {
      const schemeAttribute = document.createAttribute('scheme');
      schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
      this.setState({ scheme: data.scheme });
      document.body.attributes.setNamedItem(schemeAttribute);
    });

    vkAPI
      .storageGet('timers')
      .then((value: string) => {
        if (value === '') return;
        this.setState({ timers: JSON.parse(value) });
      })
      .finally(() => vkAPI.initApp());

    // vkAPI.getAccessToken(getAppID()).then(({ accessToken }) => {
    //  this.setState({ accessToken: accessToken });
    // });
  }

  setView(view: string, name = 'main'): void {
    const panel = this.state.activePanel;

    const newHistory = [...this.state.history, { view: view, panel: name }];

    this.setState({
      activeView: view,
      activePanel: panel,
      history: newHistory,
    });
  }

  setPanel(panel: string): void {
    const newHistory = [
      ...this.state.history,
      { view: this.state.activeView, panel },
    ];

    this.setState({ activePanel: panel, history: newHistory });
  }

  setPopout(popout?: React.ReactNode): void {
    this.setState({ popout: popout });
  }

  goBack(): void {
    const newHistory = [...this.state.history];
    if (newHistory.length > 1) {
      newHistory.pop();
      const { view, panel } = newHistory[newHistory.length - 1];

      this.setState({
        activeView: view,
        activePanel: panel,
        history: newHistory,
      });
    }
  }

  setTimers(newTimers: Array<Timer>): void {
    const { vkAPI } = this.props;
    this.setState({ timers: newTimers });
    vkAPI.storageSet('timers', JSON.stringify(newTimers));
  }

  newTimer(newTimer: Timer): void {
    console.log('newTimer', newTimer);
    this.setState({
      indexSlide: this.state.timers.length,
      // timers: [...this.state.timers, newTimer],
    });
    this.setTimers([...this.state.timers, newTimer]);
  }
  editTimer = (i: number, t: Timer) => {
    console.log('editTimer', i, t);
    const newTimers = [...this.state.timers];
    newTimers[i] = t;
    // this.setState({
    //   timers: newTimers,
    // });
    this.setTimers(newTimers);
  };

  deleteTimer(index: number): void {
    const confirmeDelete = () => {
      const newTimers = [...this.state.timers];
      newTimers.splice(index, 1);
      // this.setState({ timers: newTimers });
      this.setTimers(newTimers);
    };

    this.setPopout(
      <Alert
        actions={[
          {
            title: 'Отмена',
            autoclose: true,
            mode: 'cancel',
          },
          {
            title: 'Удалить',
            autoclose: true,
            mode: 'destructive',
            action: () => confirmeDelete(),
          },
        ]}
        actionsLayout="horizontal"
        onClose={() => this.setPopout(null)}
        header="Удаление счётчика"
        text="Вы уверены, что хотите удалить этот счётчик?"
      />,
    );
  }

  reorderTimers({ from, to }: { from: number; to: number }): void {
    const newTimers = [...this.state.timers];
    newTimers.splice(from, 1);
    newTimers.splice(to, 0, this.state.timers[from]);
    // this.setState({ timers: newTimers });
    this.setTimers(newTimers);
  }

  choseSlide(indexSlide: number): void {
    this.setState({ indexSlide });
  }

  render(): JSX.Element {
    const { vkAPI } = this.props;
    const { activePanel, indexSlide, timers, popout } = this.state;

    return (
      <AppRoot>
        <View activePanel={activePanel} popout={popout}>
          <Panel id="main">
            <Main
              vkAPI={vkAPI}
              indexSlide={indexSlide}
              timers={timers}
              setPanel={this.setPanel}
              deleteTimer={this.deleteTimer}
              choseSlide={this.choseSlide}
            />
          </Panel>
          <Panel id="shared">
            <Shared setPanel={this.setPanel} newTimer={this.newTimer} />
          </Panel>
          <Panel id="list-timers">
            <ListTimers
              timers={timers}
              setPanel={this.setPanel}
              goBack={this.goBack}
              reorderTimers={this.reorderTimers}
              choseSlide={this.choseSlide}
            />
          </Panel>
          <Panel id="add-timer">
            <AddTimer goBack={this.goBack} newTimer={this.newTimer} />
          </Panel>
          <Panel id="edit-timer">
            <EditTimer
              goBack={this.goBack}
              index={indexSlide}
              timer={timers[indexSlide]}
              editTimer={this.editTimer}
            />
          </Panel>
        </View>
      </AppRoot>
    );
  }
}
