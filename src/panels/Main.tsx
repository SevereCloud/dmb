import React from 'react';
import {
  PanelHeader,
  FixedLayout,
  Div,
  Gallery,
  PanelHeaderButton,
  Placeholder,
  Button,
} from '@vkontakte/vkui';

import PanelHeaderReorder from '../components/PanelHeaderReorder';
import type { Timer } from '../types';
import {
  Icon28AddOutline,
  Icon28DeleteOutline,
  Icon28EditOutline,
  Icon28StoryAddOutline,
  Icon56FavoriteOutline,
} from '@vkontakte/icons';
import BottomBar from '../components/BottomBar';
import Counter from '../components/Counter';
import Name from '../components/Name';

interface MainState {
  currentIndexSlide: number;
}

export interface MainProps {
  // setView: (view: string, name?: string) => void;
  setPanel: (name: string) => void;
  // goBack: () => void;

  indexSlide: number;
  timers: Array<Timer>;
  deleteTimer: (n: number) => void;
  choseSlide: (n: number) => void;
}

export class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);

    this.state = {
      currentIndexSlide: props.indexSlide,
    };
  }

  render(): JSX.Element {
    const { setPanel, timers, deleteTimer, indexSlide, choseSlide } =
      this.props;
    const { currentIndexSlide } = this.state;

    return (
      <>
        <PanelHeader
          separator={false}
          transparent={true}
          visor={false}
          left={
            <PanelHeaderReorder
              onClick={() => {
                choseSlide(currentIndexSlide);
                setPanel('list-timers');
              }}
            />
          }
        />
        {timers.length === 0 ? (
          <Placeholder
            style={{ background: 'transparent' }}
            icon={<Icon56FavoriteOutline />}
            header="Добавьте счетчик"
            action={
              <Button size="m" onClick={() => setPanel('add-timer')}>
                Добавить счетчик
              </Button>
            }
            stretched
          >
            Следите, сколько времени
            <br />
            осталось до дембеля
          </Placeholder>
        ) : (
          <Gallery
            slideWidth="100%"
            align="right"
            bullets={timers.length > 1 ? 'dark' : false}
            style={{
              boxSizing: 'border-box',
              paddingTop: 56,
              minHeight: '100vh',
            }}
            initialSlideIndex={indexSlide}
            onChange={(current) => {
              this.setState({ currentIndexSlide: current });
            }}
          >
            {timers.map((item, index) => (
              <div key={index}>
                <Div>
                  <Name timer={item} />
                </Div>
                <FixedLayout vertical="bottom">
                  <Div>
                    <Counter timer={item} />
                  </Div>
                  {Math.abs(currentIndexSlide - index) < 2 && (
                    <BottomBar
                      style={{ marginBottom: 12 }}
                      left={
                        <>
                          <PanelHeaderButton onClick={() => deleteTimer(index)}>
                            <Icon28DeleteOutline
                              style={{ color: 'var(--text_secondary)' }}
                            />
                          </PanelHeaderButton>
                          <PanelHeaderButton
                            onClick={() => {
                              choseSlide(currentIndexSlide);
                              setPanel('edit-timer');
                            }}
                          >
                            <Icon28EditOutline
                              style={{ color: 'var(--text_secondary)' }}
                            />
                          </PanelHeaderButton>
                          <PanelHeaderButton>
                            <Icon28StoryAddOutline
                              style={{ color: 'var(--text_secondary)' }}
                            />
                          </PanelHeaderButton>
                        </>
                      }
                      right={
                        <PanelHeaderButton
                          onClick={() => setPanel('add-timer')}
                        >
                          <Icon28AddOutline
                            style={{ color: 'var(--accent)' }}
                          />
                        </PanelHeaderButton>
                      }
                    />
                  )}
                </FixedLayout>
              </div>
            ))}
          </Gallery>
        )}
      </>
    );
  }
}
