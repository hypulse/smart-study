import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useRef } from "../../libs/preact.js";

export default function Radio() {
  const { radioStations } = useAppContext();
  const audioRefs = radioStations.map(() => useRef());

  const stopAllAudio = () => {
    audioRefs.forEach((ref) => {
      ref.current.pause();
      ref.current.currentTime = 0;
    });
  };

  return html`
    <div className="grid grid-cols-1 gap-2">
      ${radioStations.map((station, index) => {
        return html`
          <div>
            <h2 className="text-lg font-bold">${station.name}</h2>
            <audio controls preload="none" ref=${audioRefs[index]}>
              <source src=${station.url} />
            </audio>
          </div>
        `;
      })}
      <button onClick=${stopAllAudio} type="button" className="btn btn-primary">
        Stop All
      </button>
    </div>
  `;
}
