import React, { useEffect, useState } from 'react';

import { frequencyCategory, PSG9080 } from 'psg9080';

interface FrequencyProps {
  channel: 1 | 2;
  device: PSG9080;
}

const Frequency = (props: FrequencyProps) => {
  const [localFrequency, setLocalFrequency] = useState(0);
  const [localFrequencyCategory, setLocalFrequencyCategory] = useState(
    frequencyCategory.Hz,
  );
  useEffect(() => {
    props.device.onFrequencyChangeEvent.subscribe((freq) => {
      if (freq.channel === props.channel) {
        console.log(
          `Frequency changed: CH${freq.channel} ${freq.frequency} ${
            frequencyCategory[freq.frequencyCategory]
          }`,
        );
        setLocalFrequency(freq.frequency / 1000);
        setLocalFrequencyCategory(freq.frequencyCategory);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Frequency</div>
      <div className="my-auto font-medium text-2xl">
        <input
          className="text-right"
          value={localFrequency}
          onChange={(e) => {
            setLocalFrequency(parseInt(e.target.value));
            props.device.setFrequency(
              props.channel,
              parseInt(e.target.value) * 1000,
              localFrequencyCategory,
            );
          }}
        />
        <small className="font-thin">
          <select
            value={localFrequencyCategory}
            onChange={(e) => {
              setLocalFrequencyCategory(parseInt(e.target.value));
              props.device.setFrequency(
                props.channel,
                localFrequency * 1000,
                parseInt(e.target.value),
              );
            }}
          >
            <option value={frequencyCategory.uHz}>
              {frequencyCategory[frequencyCategory.uHz]}
            </option>
            <option value={frequencyCategory.mHz}>
              {frequencyCategory[frequencyCategory.mHz]}
            </option>
            <option value={frequencyCategory.Hz}>
              {frequencyCategory[frequencyCategory.Hz]}
            </option>
            <option value={frequencyCategory.MHz}>
              {frequencyCategory[frequencyCategory.MHz]}
            </option>
            <option value={frequencyCategory.kHz}>
              {frequencyCategory[frequencyCategory.kHz]}
            </option>
          </select>
        </small>
      </div>
    </div>
  );
};

export default Frequency;
