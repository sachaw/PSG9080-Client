import React, { useEffect, useState } from 'react';

import { PSG9080, waveform } from 'psg9080';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface WaveformProps {
  channel: 1 | 2;
  device: PSG9080;
  // sendInstruction: (instruction: string) => void;
}

const Waveform = (props: WaveformProps) => {
  const [localWaveform, setLocalWaveform] = useState(waveform.SINE);
  useEffect(() => {
    props.device.onWaveformChangeEvent.subscribe((newWaveform) => {
      if (newWaveform.channel === props.channel) {
        console.log(
          `Waveform changed: CH${props.channel}, ${
            waveform[newWaveform.waveform]
          } `,
        );

        setLocalWaveform(newWaveform.waveform);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Waveform</div>
      <div className="flex">
        <button
          className="mr-2 p-1 bg-gray-200 hover:bg-gray-400"
          onClick={() => {
            props.device.setWaveform(props.channel, 'previous');
          }}
        >
          <FaArrowLeft />
        </button>
        <div className="my-auto mr-2">{waveform[localWaveform]}</div>
        <button
          className="ml-2 p-1 bg-gray-300 hover:bg-gray-400"
          onClick={() => {
            props.device.setWaveform(props.channel, 'previous');
          }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Waveform;
