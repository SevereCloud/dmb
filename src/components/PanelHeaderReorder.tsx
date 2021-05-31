import React, { FunctionComponent } from 'react';
import { Icon24Reorder, Icon24ReorderIos } from '@vkontakte/icons';

import {
  PanelHeaderButton,
  ANDROID,
  VKCOM,
  usePlatform,
  PanelHeaderButtonProps,
} from '@vkontakte/vkui';

const PanelHeaderReorder: FunctionComponent<PanelHeaderButtonProps> = ({
  ...restProps
}: PanelHeaderButtonProps) => {
  const platform = usePlatform();
  return (
    <PanelHeaderButton {...restProps}>
      {platform === ANDROID || platform === VKCOM ? (
        <Icon24Reorder />
      ) : (
        <Icon24ReorderIos />
      )}
    </PanelHeaderButton>
  );
};

export default PanelHeaderReorder;
