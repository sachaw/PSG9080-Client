import React, { useEffect, useState } from 'react';

import type { PSG9080 } from 'psg9080';

interface AmplitudeProps {
  channel: 1 | 2;
  device: PSG9080;
}

const Amplitude = (props: AmplitudeProps) => {
  const [localAmplitude, setLocalAmplitude] = useState(0);
  useEffect(() => {
    props.device.onAmplitudeChange.subscribe((amplitude) => {
      if (amplitude.channel === props.channel) {
        console.log(
          `Amplitude changed: CH${amplitude.channel}, ${
            amplitude.amplitude / 1000
          }V`,
        );
        setLocalAmplitude(amplitude.amplitude / 1000);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Amplitude</div>
      <div className="my-auto font-medium text-2xl">
        <input
          type="text"
          pattern="[0-9]*"
          className="text-right"
          value={localAmplitude}
          onChange={(e) => {
            setLocalAmplitude(parseInt(e.target.value));
            props.device.setAmplitude(
              props.channel,
              parseInt(e.target.value) * 1000,
            );
          }}
        />
        V
      </div>
    </div>
  );
};

export default Amplitude;
