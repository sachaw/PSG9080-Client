import React, { useEffect, useState } from 'react';

import type { PSG9080 } from 'psg9080';

interface PhaseProps {
  channel: 1 | 2;
  device: PSG9080;
  // sendInstruction: (instruction: string) => void;
}

const Phase = (props: PhaseProps) => {
  const [localPhase, setLocalPhase] = useState(0);
  useEffect(() => {
    props.device.onPhaseChangeEvent.subscribe((phase) => {
      if (phase.channel === props.channel) {
        console.log(`Phase changed: CH${props.channel}, ${phase.phase / 100}°`);
        setLocalPhase(phase.phase / 100);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Phase</div>
      <div className="my-auto font-medium text-2xl">
        <input
          className="text-right"
          value={localPhase}
          onChange={(e) => {
            props.device.setPhase(
              props.channel,
              parseInt(e.target.value) * 100,
            );
          }}
        />
        °
      </div>
    </div>
  );
};

export default Phase;
