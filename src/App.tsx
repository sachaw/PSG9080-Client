import React, { useEffect, useState } from 'react';

import { PSG9080 } from 'psg9080';
import {
  FaCode,
  FaMicrochip,
  FaQrcode,
  FaServer,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

import Channel from './components/Channel';

const device = new PSG9080();

export default function App() {
  const [connected, setConnected] = useState(false);
  const [mute, setMute] = useState(false);
  const [versions, setVersions] = useState({
    hardware: 0,
    firmware: 0,
    fpga: 0,
  });
  const [serial, setSerial] = useState(0);
  useEffect(() => {
    device.onDeviceReadyChangeEvent.subscribe(setConnected);
    device.onMuteChangeEvent.subscribe(setMute);
    device.onFirmwareChangeEvent.subscribe(setVersions);
    device.onSerialChangeEvent.subscribe(setSerial);
  }, []);
  return (
    <div className="h-screen w-screen">
      <div className="flex w-full h-12 text-xl font-semibold bg-gray-200 shadow-md justify-between">
        <div className="ml-2 my-auto">PSG9080</div>
        <div className=" flex mr-2 my-auto">
          <div className="flex bg-gray-300 rounded-lg shadow-md px-2 py-1 mr-2">
            <FaQrcode className="m-auto mr-2" />
            {serial}
          </div>
          <div className="flex bg-gray-300 rounded-lg shadow-md px-2 py-1 mr-2">
            <FaServer className="m-auto mr-2" />v{versions.hardware / 100}
          </div>
          <div className="flex bg-gray-300 rounded-lg shadow-md px-2 py-1 mr-2">
            <FaCode className="m-auto mr-2" />v{versions.firmware / 100}
          </div>
          <div className="flex bg-gray-300 rounded-lg shadow-md px-2 py-1 mr-2">
            <FaMicrochip className="m-auto mr-2" />v{versions.fpga / 100}
          </div>
          <div
            className="flex bg-gray-300 hover:bg-gray-400 rounded-lg shadow-md px-2 py-1 mr-2"
            onClick={() => {
              device.toggleMute();
              // sendInstruction(`w27=${deviceState.mute ? 0 : 1}.`);
            }}
          >
            {mute ? (
              <FaVolumeUp className="m-auto" />
            ) : (
              <FaVolumeMute className="m-auto" />
            )}
          </div>
          {connected ? (
            <button
              className="bg-red-300 hover:bg-red-400 rounded-lg shadow-md px-2 py-1"
              onClick={device.disconnect}
            >
              Disconnect
            </button>
          ) : (
            <button
              className="bg-blue-300 hover:bg-blue-400 rounded-lg shadow-md px-2 py-1"
              onClick={() => {
                device.connect();
              }}
            >
              Connect
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-grow">
        {connected ? (
          <>
            <Channel channelNo={1} device={device} />
            <Channel channelNo={2} device={device} />
          </>
        ) : (
          <div className="flex-grow">Not Connected</div>
        )}
        {/* <div className="w-32 h-full rounded-tl rounded-bl border-l border-b border-t">
          tmp
        </div> */}
      </div>
    </div>
  );
}
