import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAtlas } from "../atlas/context";
import { store } from "../store/store";

const LEVELS = [
  ["A2", "Basic", "Everyday words still need work"],
  ["B1", "Intermediate", "Target band 5.5 – 6"],
  ["B2", "Upper-intermediate", "Target band 6.5 – 7"],
  ["C1", "Advanced", "Aiming above 7.5"],
];

export function Onboarding() {
  const atlas = useAtlas();
  const [level, setLevel] = useState(1);
  const [goal, setGoal] = useState(10);
  const finish = () => store.settings({ onboarded: true, startLevel: atlas.cefr.indexOf(LEVELS[level][0]), dailyNew: goal });
  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="onboard-card">
        <img className="onboard-art" src={`${import.meta.env.BASE_URL}brand/hero.webp`} alt="" />
        <div className="onboard-body">
          <p className="eyebrow">Welcome to Word Atlas</p>
          <h1 className="display">
            {atlas.count.toLocaleString()} stars,
            <br />
            waiting to be lit.
          </h1>
          <fieldset>
            <legend>Where do you start?</legend>
            <div className="choice-grid">
              {LEVELS.map(([code, name, desc], i) => (
                <button key={code} className={`choice ${level === i ? "is-on" : ""}`} onClick={() => setLevel(i)} aria-pressed={level === i}>
                  <span className={`chip chip-level lv-${code}`}>{code}</span>
                  <b>{name}</b>
                  <small>{desc}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>How many new stars a day?</legend>
            <div className="segmented segmented-wide">
              {[5, 10, 15, 20].map((n) => (
                <button key={n} className={goal === n ? "is-on" : ""} onClick={() => setGoal(n)} aria-pressed={goal === n}>
                  {n} stars{n === 10 ? " · recommended" : ""}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn btn-primary btn-xl" onClick={finish}>
            Start <ArrowRight size={20} />
          </button>
          <p className="muted">No sign-up. Progress stays on this device; change it any time under "Me".</p>
        </div>
      </div>
    </div>
  );
}
