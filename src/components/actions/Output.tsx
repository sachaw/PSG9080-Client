import React, { useEffect, useState } from 'react';

import type { PSG9080 } from 'psg9080';

import ToggleSwitch from '../ToggleSwitch';

interface OutputProps {
  channel: 1 | 2;
  device: PSG9080;
}

const Output = (props: OutputProps) => {
  const [localEnabled, setLocalEnabled] = useState(false);
  useEffect(() => {
    props.device.onOutputChangeEvent.subscribe((output) => {
      if (props.channel === 1 && output.enabled1 !== localEnabled) {
        console.log(
          `Output changed: CH1 ${output.enabled1 ? 'true' : 'false'}`,
        );
        setLocalEnabled(output.enabled1);
      }
      if (props.channel === 2 && output.enabled2 !== localEnabled) {
        console.log(
          `Output changed: CH2 ${output.enabled1 ? 'true' : 'false'}`,
        );
        setLocalEnabled(output.enabled2);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Ouput enabled?</div>
      <ToggleSwitch
        active={localEnabled}
        toggle={() => {
          props.device.toggleOutput(props.channel);
        }}
      />
    </div>
  );
};

export default Output;
