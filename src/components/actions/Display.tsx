import React, { useEffect, useRef, useState } from 'react';

import type { PSG9080 } from 'psg9080';

interface DisplayProps {
  channel: 1 | 2;
  device: PSG9080;
}

const Display = (props: DisplayProps) => {
  const [localFrequency, setLocalFrequency] = useState(0);
  const [localAmplitude, setLocalAmplitude] = useState(0);

  useEffect(() => {
    props.device.onFrequencyChangeEvent.subscribe((frequency) => {
      if (frequency.channel === props.channel) {
        setLocalFrequency(frequency.frequency);
      }
    });
    props.device.onAmplitudeChange.subscribe((amplitude) => {
      if (amplitude.channel === props.channel) {
        setLocalAmplitude(amplitude.amplitude);
      }
    });
  }, []);
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    const ctx1 = canvas1?.getContext('2d');
    const ctx2 = canvas2?.getContext('2d');
    if (canvas1 && canvas2 && ctx1 && ctx2) {
      var ui = {
        inputType: {
          title: 'Input',
          value: 2,
          values: [
            ['Live Input (5 V peak amplitude)', 1],
            ['Sine Wave (amplitude 5 V)', 2],
            ['Square Wave (amplitude 5 V)', 3],
          ],
        },
        freeze: { title: 'Freeze Live Input', value: false },
        gain: {
          title: 'Oscilloscope gain',
          value: 1,
          range: [0, 5],
          resolution: 0.1,
        },
        dropdownExample: {
          title: 'Seconds / div',
          value: 1,
          values: [
            ['50 Âµs', 0.05],
            ['100 Âµs', 0.1],
            ['200 Âµs', 0.2],
            ['500 Âµs', 0.5],
            ['1 ms', 1],
            ['2 ms', 2],
            ['5 ms', 5],
          ],
        },
        horizOffset: {
          title: 'Horizontal Offset',
          value: 0,
          range: [-100, 100],
          resolution: 1,
          input: 'hidden',
        },
        vertOffset: {
          title: 'Vertical Offset',
          value: 0,
          range: [-100, 100],
          resolution: 1,
          input: 'hidden',
        },
      };
      canvas1.height = canvas1.width * 0.67 + 20;
      canvas2.height = canvas1.height;
      canvas1.style.backgroundColor = '#5db1a2';
      let midPoint = { x: canvas1.width / 2, y: canvas1.height / 2 };
      function createGrid(ctx: CanvasRenderingContext2D) {
        if (canvas1) {
          ctx.beginPath();
          ctx.moveTo(0, midPoint.y);
          ctx.lineTo(canvas1.width, midPoint.y);
          ctx.moveTo(midPoint.x, 0);
          ctx.lineTo(midPoint.x, canvas1.height);
          ctx.strokeStyle = '#196156';
          ctx.lineWidth = 2;
          ctx.globalCompositeOperation = 'source-over';
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          let gridLineX = midPoint.x - 100;
          ctx.lineWidth = 2;
          while (gridLineX >= 0) {
            ctx.moveTo(gridLineX, 0);
            ctx.lineTo(gridLineX, canvas1.height);
            gridLineX -= 100;
          }
          gridLineX = midPoint.x + 100;
          while (gridLineX <= canvas1.width) {
            ctx.moveTo(gridLineX, 0);
            ctx.lineTo(gridLineX, canvas1.height);
            gridLineX += 100;
          }
          let gridLineY = midPoint.y - 100;
          while (gridLineY >= 0) {
            ctx.moveTo(0, gridLineY);
            ctx.lineTo(canvas1.width, gridLineY);
            gridLineY -= 100;
          }
          gridLineY = midPoint.y + 100;
          while (gridLineY <= canvas1.height) {
            ctx.moveTo(0, gridLineY);
            ctx.lineTo(canvas1.width, gridLineY);
            gridLineY += 100;
          }
          let dashesX = midPoint.x - 20;
          while (dashesX >= 0) {
            ctx.moveTo(dashesX, midPoint.y - 5);
            ctx.lineTo(dashesX, midPoint.y + 5);
            dashesX -= 20;
          }
          while (dashesX <= canvas1.width) {
            ctx.moveTo(dashesX, midPoint.y - 5);
            ctx.lineTo(dashesX, midPoint.y + 5);
            dashesX += 20;
          }
          let dashesY = midPoint.y - 20;
          while (dashesY >= 0) {
            ctx.moveTo(midPoint.x - 5, dashesY);
            ctx.lineTo(midPoint.x + 5, dashesY);
            dashesY -= 20;
          }
          dashesY = midPoint.y + 20;
          while (dashesY <= canvas1.height) {
            ctx.moveTo(midPoint.x - 5, dashesY);
            ctx.lineTo(midPoint.x + 5, dashesY);
            dashesY += 20;
          }
          ctx.stroke();
        }
      }
      createGrid(ctx1);

      var analyser = {
        frequencyBinCount: 512,
      };
      var timeDomain = new Uint8Array(analyser.frequencyBinCount);
      var streaming = false;
      var previousTranslate = { x: 0, y: 0 };
      function animate() {
        if (streaming == true && ui.freeze.value == false) {
          window.requestAnimationFrame(animate);
        }
        drawData();
      }
      function drawData() {
        if (ctx2 && canvas1) {
          ctx2.translate(-previousTranslate.x, -previousTranslate.y);
          ctx2.clearRect(0, 0, canvas1.width, canvas1.height);
          ctx2.translate(ui.horizOffset.value, ui.vertOffset.value);
          ctx2.beginPath();
          ctx2.strokeStyle = '#befde5';
          ctx2.lineWidth = 1;
        }
        for (
          var i = -analyser.frequencyBinCount / 2;
          i <= analyser.frequencyBinCount / 2;
          i++
        ) {
          if (canvas1 && ctx2) {
            let index = i + analyser.frequencyBinCount / 2;
            if (streaming == true) {
              var height = (canvas1.height * timeDomain[i]) / 256;
              var offset =
                (canvas1.width *
                  (analyser.frequencyBinCount /
                    (analyser.frequencyBinCount - 1)) *
                  i) /
                analyser.frequencyBinCount;
              var xc = i * (canvas1.width / analyser.frequencyBinCount);
              var yc =
                (ui.gain.value * (timeDomain[index] / 255 - 0.5) * 200) /
                (localAmplitude / 1000);
              yc += canvas1.height / 2;
              // xc = mapRange(
              //   [0, 0.001 * ui.dropdownExample.value],
              //   [0, (100 * (numSamples / sampleRate)) / canvas1.width],
              //   xc
              // );
              xc += canvas1.width / 2;
              ctx2.lineTo(xc, yc);
            } else {
              var xc = i * (canvas1.width / analyser.frequencyBinCount);
              var amplitude = 100 / (localAmplitude / 1000);

              var yc =
                -amplitude *
                Math.sin(
                  2 *
                    Math.PI *
                    xc *
                    (localFrequency / 1000) *
                    0.00001 *
                    ui.dropdownExample.value,
                );

              if (ui.inputType.value == 3) {
                if (yc > 0) yc = amplitude;
                else yc = -amplitude;
              }
              yc *= ui.gain.value;
              yc = canvas1.height / 2 + yc;
              xc += canvas1.width / 2;
              ctx2.lineTo(xc, yc);
            }
            previousTranslate = {
              x: ui.horizOffset.value,
              y: ui.vertOffset.value,
            };
          }
        }
        if (ctx2) {
          ctx2.stroke();
          ctx2.strokeStyle = 'rgba(174,244,218,0.3)';
          ctx2.lineWidth = 1;
          ctx2.stroke();
          ctx2.strokeStyle = 'rgba(174,244,218,0.3)';
          ctx2.lineWidth = 2;
          ctx2.stroke();
        }
      }
      animate();
    }
  }, [localFrequency, localAmplitude]);
  return (
    <div className="relative w-full h-80 border-b">
      <canvas className="absolute w-full h-full" ref={canvasRef1}></canvas>
      <canvas className="absolute w-full h-full" ref={canvasRef2}></canvas>
    </div>
  );
};

export default Display;
