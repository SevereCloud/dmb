import { classNames, isPrimitiveReactNode } from '@vkontakte/vkjs';
import {
  AdaptivityProps,
  getClassName,
  Text,
  usePlatform,
  VKCOM,
  withAdaptivity,
} from '@vkontakte/vkui';
import type { HasRef, HasRootRef } from '@vkontakte/vkui/dist/types';
import React, { FC, ReactNode, HTMLAttributes } from 'react';

import './BottomBar.css';

export interface BottomBarProps
  extends HTMLAttributes<HTMLDivElement>,
    HasRef<HTMLDivElement>,
    HasRootRef<HTMLDivElement>,
    AdaptivityProps {
  left?: ReactNode;
  right?: ReactNode;
}

const BottomBarInTypography: FC<BottomBarProps> = ({
  children,
}: BottomBarProps) => {
  const platform = usePlatform();

  return platform === VKCOM ? (
    <Text Component="span" weight="medium">
      {children}
    </Text>
  ) : (
    <span className="BottomBar__content-in">{children}</span>
  );
};

const BottomBar: FC<BottomBarProps> = ({
  left,
  right,
  children,
  sizeX,
  sizeY,
  getRef,
  getRootRef,
  ...restProps
}: BottomBarProps) => {
  const isPrimitive = isPrimitiveReactNode(children);
  const platform = usePlatform();
  const isFixed = platform === VKCOM;

  return (
    <div
      {...restProps}
      className={classNames(
        getClassName('BottomBar', platform),
        {
          'BottomBar--no-left': !left,
          'BottomBar--no-right': !right,
        },
        `BottomBar--sizeX-${sizeX}`,
      )}
      ref={isFixed ? getRootRef : getRef}
    >
      <div className="BottomBar__in">
        <div className="BottomBar__left">{left}</div>
        <div className="BottomBar__content">
          {isPrimitive ? (
            <BottomBarInTypography>{children}</BottomBarInTypography>
          ) : (
            children
          )}
        </div>
        <div className="BottomBar__right">{right}</div>
      </div>
    </div>
  );
};

export default withAdaptivity(BottomBar, {
  sizeX: true,
  sizeY: true,
});
