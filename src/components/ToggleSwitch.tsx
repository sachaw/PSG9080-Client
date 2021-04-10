import React, { useEffect, useState } from 'react';

interface ToggleSwitchProps {
  active: boolean;
  toggle?: Function;
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(props.active);
  }, [props]);

  return (
    <div
      onClick={() => {
        setActive(!active);
        if (props.toggle) {
          props.toggle();
        }
      }}
      className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out my-auto ${
        active ? 'bg-green-400' : null
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
          active ? 'translate-x-6' : null
        }`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
