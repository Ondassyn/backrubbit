import { useEffect, useRef, useState } from 'react';
import { Rive, Layout, Fit, Alignment, RuntimeLoader, StateMachineInputType } from '@rive-app/canvas';
import riveWasm from '@rive-app/canvas/rive.wasm?url';
import { RABBIT } from '../config';

RuntimeLoader.setWasmUrl(riveWasm); // bundle wasm → works offline
const DEBUG = new URLSearchParams(location.search).has('debug');

export default function Rabbit({ pose = 'idle', onReady }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const riveRef = useRef(null);
  const inputs = useRef({});
  const readyCb = useRef(onReady);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [aspect, setAspect] = useState(RABBIT.fallbackAspect);
  const [list, setList] = useState([]);
  const [, tick] = useState(0);
  const [smName, setSmName] = useState('');

  useEffect(() => { readyCb.current = onReady; }, [onReady]);

  useEffect(() => {
    let r;
    r = new Rive({
      src: RABBIT.src,
      canvas: canvasRef.current,
      autoplay: true,
      stateMachines: RABBIT.stateMachine || undefined,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        const name = RABBIT.stateMachine || r.stateMachineNames?.[0];
        if (name && !RABBIT.stateMachine) r.play(name);
        const found = name ? r.stateMachineInputs(name) || [] : [];
        inputs.current = Object.fromEntries(found.map((i) => [i.name, i]));
        setList(found);
        setSmName(name || '(none)');
        const b = r.bounds;
        if (b && b.maxY > b.minY) setAspect((b.maxX - b.minX) / (b.maxY - b.minY));
        r.resizeDrawingSurfaceToCanvas();
        setReady(true);
        readyCb.current?.();
      },
      onLoadError: () => {
        setFailed(true);
        readyCb.current?.();
      },
    });
    riveRef.current = r;
    return () => r.cleanup();
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(() => riveRef.current?.resizeDrawingSurfaceToCanvas());
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const setInput = (name, v) => {
    const i = inputs.current[name];
    if (!i) return;
    if (i.type === StateMachineInputType.Trigger) i.fire();
    else i.value = v;
  };

  useEffect(() => {
    if (!ready) return;
    const spec = RABBIT.poses[pose];
    if (!spec) return;
    Object.entries(spec).forEach(([k, v]) => setInput(k, v));
    if (RABBIT.trigger) setInput(RABBIT.trigger);
  }, [pose, ready]);

  const { left, width } = RABBIT.crop;
  return (
    <>
      <div className="rabbit-crop" ref={wrapRef} style={{ aspectRatio: `${aspect * width} / 1` }}>
        <div className="rabbit-inner" style={{ width: `${100 / width}%`, left: `${(-100 * left) / width}%` }}>
          <canvas ref={canvasRef} />
        </div>
        {failed && <div className="rabbit-fallback">🐰</div>}
      </div>
      {DEBUG && (
        <div className="rabbit-debug">
          <b>rive · sm: {smName}</b>
          {list.map((i) => (
            <div key={i.name}>
              {i.name}
              {i.type === StateMachineInputType.Trigger ? (
                <button onClick={() => i.fire()}>fire</button>
              ) : (
                <>
                  <button onClick={() => { i.value = Number(i.value) - 1; tick((x) => x + 1); }}>−</button>
                  <span>{String(i.value)}</span>
                  <button onClick={() => { i.value = Number(i.value) + 1; tick((x) => x + 1); }}>+</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
