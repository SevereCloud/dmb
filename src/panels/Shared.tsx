import React from 'react';
import {
  PanelHeader,
  FixedLayout,
  Div,
  Button,
  PanelHeaderClose,
} from '@vkontakte/vkui';

import type { Timer } from '../types';
import Counter from '../components/Counter';
import Name from '../components/Name';

interface SharedState {
  timer: Timer;
}

export interface SharedProps {
  setPanel: (name: string) => void;
  newTimer: (t: Timer) => void;
}

export class Shared extends React.Component<SharedProps, SharedState> {
  constructor(props: SharedProps) {
    super(props);


    this.state = {
      timer: { title: "title", start_date: 0, end_date: 365*60*60*24 },
    };
  }
  componentDidMount() {
    const {setPanel} = this.props
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const title = params.get("title")
    if (!title||title.length>20) {setPanel("main");return}

    const s = Number(params.get("s"))
    if (!s) {setPanel("main");return}

    const e = Number(params.get("e"))
    if (!e || e<s) {setPanel("main");return}

    this.setState({
      timer: { title: title, start_date: s, end_date: e },
    });
  }

  render(): JSX.Element {
    const { setPanel, newTimer } = this.props;
    const { timer } = this.state;

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
            }}>
        <Div>
          <Name timer={timer} />
        </Div>
        <FixedLayout vertical="bottom">
          <Div>
            <Counter timer={timer} />
            <Button
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
