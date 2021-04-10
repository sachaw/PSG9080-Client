import React, { useEffect, useState } from 'react';

import type { PSG9080 } from 'psg9080';

interface DutyProps {
  channel: 1 | 2;
  device: PSG9080;
  // sendInstruction: (instruction: string) => void;
}

const Duty = (props: DutyProps) => {
  const [localDuty, setLocalDuty] = useState(0);
  useEffect(() => {
    props.device.onDutyChangeEvent.subscribe((duty) => {
      if (duty.channel === props.channel) {
        console.log(`Duty changed: CH${props.channel}, ${duty.duty / 100}%`);
        setLocalDuty(duty.duty);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Duty</div>
      <div className="my-auto font-medium text-2xl">
        <input
          className="text-right"
          value={localDuty > 0 ? localDuty / 100 : localDuty}
          onChange={(e) => {
            props.device.setDuty(props.channel, parseInt(e.target.value));
          }}
        />
        %
      </div>
    </div>
  );
};

export default Duty;
