import React, { FC } from 'react';
import type { Timer } from '../types';
import { getDate } from '../date';

import './Name.css';

const Name: FC<{ timer: Timer }> = ({ timer }: { timer: Timer }) => {
  return (
    <>
      <div className="Name__title">{timer.title}</div>
      <div className="Name__date">{getDate(timer.end_date)}</div>
    </>
  );
};

export default Name;
