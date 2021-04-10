import React, { useEffect, useState } from 'react';

import type { PSG9080 } from 'psg9080';

interface OffsetProps {
  channel: 1 | 2;
  device: PSG9080;
}

const Offset = (props: OffsetProps) => {
  const [localOffset, setLocalOffset] = useState(0);
  useEffect(() => {
    props.device.onOffsetChangeEvent.subscribe((offset) => {
      if (offset.channel === props.channel) {
        console.log(
          `Offset changed: CH${offset.channel}, ${
            (offset.offset - 1000) / 100
          }V`,
        );

        setLocalOffset((offset.offset - 1000) / 100);
      }
    });
  }, []);
  return (
    <div className="flex border-b w-full justify-between pr-2">
      <div className="font-medium my-auto ml-2 py-2">Offset</div>
      <div className="my-auto font-medium text-2xl">
        <input
          className="text-right"
          value={localOffset}
          onChange={(e) => {
            setLocalOffset(parseInt(e.target.value));
            props.device.setOffset(
              props.channel,
              (parseInt(e.target.value) + 1000) * 100,
            );
          }}
        />
        V
      </div>
    </div>
  );
};

export default Offset;
