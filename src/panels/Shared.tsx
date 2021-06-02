import React from 'react';
import {
  PanelHeader,
  FixedLayout,
  Div,
  Button,
  PanelHeaderClose,
} from '@vkontakte/vkui';

import type { CounterType, Timer } from '../types';
import Counter from '../components/Counter';
import Name from '../components/Name';

export interface SharedProps {
  location: string;
  setPanel: (name: string) => void;
  newTimer: (t: Timer) => void;
}

interface SharedState {
  counterType: CounterType;
}

export class Shared extends React.Component<SharedProps, SharedState> {
  constructor(props: SharedProps) {
    super(props);

    const ct: CounterType = localStorage.getItem('counter-type')
      ? (localStorage.getItem('counter-type') as CounterType)
      : 'days_left';

    this.state = {
      counterType: ct,
    };
  }

  render(): JSX.Element {
    const { setPanel, newTimer, location } = this.props;
    const { counterType } = this.state;

    const params = new URLSearchParams(location);

    const title = params.get('title');
    console.log('title', title);
    if (!title || title.length > 20) {
      setPanel('main');
      return <></>;
    }

    const s = Number(params.get('s'));
    if (!s) {
      setPanel('main');
      return <></>;
    }

    const e = Number(params.get('e'));
    if (!e || e < s) {
      setPanel('main');
      return <></>;
    }

    const timer: Timer = { title: title, start_date: s, end_date: e };

    return (
      <>
        <PanelHeader
          separator={false}
          transparent={true}
          visor={false}
          left={
            <PanelHeaderClose
              onClick={() => {
                setPanel('main');
              }}
            />
          }
        />
        <div
          style={{
            boxSizing: 'border-box',
            paddingTop: 56,
            minHeight: '100vh',
          }}
        >
          <Div>
            <Name timer={timer} />
          </Div>
          <FixedLayout vertical="bottom">
            <Div>
              <Counter
                counterType={counterType}
                updateCounterType={(ct) => this.setState({ counterType: ct })}
                timer={timer}
              />
              <Button
                style={{ marginTop: 24 }}
                size="l"
                onClick={() => {
                  newTimer(timer);
                  setPanel('main');
                }}
                stretched
              >
                Добавить счётчик себе
              </Button>
            </Div>
          </FixedLayout>
        </div>
      </>
    );
  }
}
