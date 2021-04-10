import React from 'react';

import type { PSG9080 } from 'psg9080';

import Amplitude from './actions/Amplitude';
import Display from './actions/Display';
import Duty from './actions/Duty';
import Frequency from './actions/Frequency';
import Offset from './actions/Offset';
import Output from './actions/Output';
import Phase from './actions/Phase';
import Waveform from './actions/Waveform';

interface ChannelProps {
  channelNo: 1 | 2;
  device: PSG9080;
}

const Channel = (props: ChannelProps) => {
  return (
    <div className="flex flex-col w-1/2 border-r border-l">
      <div className="flex h-8 w-full bg-gray-100 shadow-md">
        <div className=" ml-2 my-auto font-medium">
          Channel {props.channelNo}
        </div>
      </div>
      <div>
        <Display channel={props.channelNo} device={props.device} />
        <Output channel={props.channelNo} device={props.device} />
        <Waveform channel={props.channelNo} device={props.device} />
        <Frequency channel={props.channelNo} device={props.device} />
        <Amplitude channel={props.channelNo} device={props.device} />
        <Phase channel={props.channelNo} device={props.device} />
        <Offset channel={props.channelNo} device={props.device} />
        <Duty channel={props.channelNo} device={props.device} />
      </div>
    </div>
  );
};

export default Channel;
