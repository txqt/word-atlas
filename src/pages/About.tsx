import { ArrowUpRight, Database, Github, Heart } from "lucide-react";
import { useAtlas } from "../atlas/context";
import { REPO_URL } from "../config";

const BASE = import.meta.env.BASE_URL;

export function About() {
  const atlas = useAtlas();
  return (
    <div className="page about">
      <header className="about-hero">
        <img src={`${BASE}brand/og.webp`} alt="" />
        <div>
          <p className="eyebrow">About Word Atlas</p>
          <h1 className="display">One word, one picture.</h1>
          <p className="lede">
            Word Atlas turns the 8,000 words of IELTS reading into {atlas.count.toLocaleString()} entries. Each one gets an original illustration, an everyday example, an IELTS example, UK and US audio, common collocations
            and a note on words people mix up. Learn one, and a star lights up in your galaxy.
          </p>
          <p className="lede">It is free, open source, and needs no sign-up. The code is MIT, the word list is CC BY 4.0; anyone can take it.</p>
          <div className="about-actions">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              <Github size={18} /> View on GitHub
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/tree/main/data`} target="_blank" rel="noreferrer">
              <Database size={18} /> Download the JSON / CSV
            </a>
          </div>
        </div>
      </header>

      <div className="about-grid">
        <section className="panel">
          <h3 className="eyebrow">Why it sticks</h3>
          <ul className="feature-list">
            <li>
              <b>See it first.</b> Every word comes with a picture of what happens in its first example sentence.
            </li>
            <li>
              <b>Then recall it.</b> Pick the meaning, fill the gap, identify what you hear, spell it: from recognition to production.
            </li>
            <li>
              <b>Meet it just before you forget.</b> FSRS is the open-source memory algorithm behind modern Anki. It schedules a review only when a word is about to fade.
            </li>
            <li>
              <b>An honest score.</b> Only first attempts count. A missed word comes back in another format, but it never inflates your accuracy.
            </li>
            <li>
              <b>Your progress is yours.</b> No account, no server. The data sits in your browser and you can export it any time.
            </li>
          </ul>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Keyboard shortcuts</h3>
          <dl className="keys">
            <div>
              <dt>
                <kbd>⌘</kbd>
                <kbd>K</kbd> or <kbd>/</kbd>
              </dt>
              <dd>Search any word</dd>
            </div>
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>4</kbd>
              </dt>
              <dd>Choose an answer</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>Confirm / continue</dd>
            </div>
            <div>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>Previous and next entry</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Close a dialog</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Where the content comes from</h3>
          <p className="muted">
            Definitions, examples, collocations and notes were rewritten by a large language model against a single dictionary style guide; illustrations were drawn word by word by an image model in one style; audio was
            synthesised with ElevenLabs (Alice for UK, Sarah for US). Everything passed automated structural and consistency checks, but no entry was reviewed by hand. Found a mistake? Open an issue on GitHub, or edit the data and
            send a PR.
          </p>
          <p className="muted">Word Atlas is not an official IELTS word list and promises no score. It only wants to make learning words a little better looking, and a little more solid.</p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">For developers</h3>
          <p className="muted">
            <code>data/word-atlas.json</code> and the <code>.csv</code> hold the full word list; <code>public/atlas</code> holds the chunked data, illustrations and audio the web app uses. Take it for an Anki deck, a flashcard app,
            a browser extension or an eval set for AI products; attribution is all we ask.
          </p>
          <a className="link" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
            Read the docs <ArrowUpRight size={14} />
          </a>
        </section>
      </div>
      <p className="colophon">
        <Heart size={14} /> Made for everyone learning words.
      </p>
    </div>
  );
}
