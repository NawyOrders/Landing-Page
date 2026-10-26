'use client';

import { useUi } from './UiProvider';

const DOTS = [
  [5, 0], [8, 0], [9, 0],
  [6, 1],
  [5, 2], [7, 2], [8, 2], [9, 2],
  [5, 3], [6, 3], [9, 3],
  [5, 4], [8, 4], [9, 4],
  [0, 5], [2, 5], [4, 5], [6, 5], [7, 5], [9, 5], [10, 5], [14, 5],
  [0, 6], [2, 6], [6, 6], [9, 6], [11, 6], [13, 6],
  [0, 7], [2, 7], [4, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [14, 7],
  [3, 8], [5, 8], [7, 8], [9, 8], [10, 8], [13, 8],
  [0, 9], [2, 9], [3, 9], [4, 9], [6, 9], [7, 9], [9, 9], [12, 9], [13, 9], [14, 9],
  [5, 10], [10, 10], [11, 10], [14, 10],
  [7, 11], [8, 11], [9, 11], [10, 11], [12, 11], [14, 11],
  [5, 12], [7, 12], [9, 12], [11, 12], [12, 12], [13, 12],
  [5, 13], [7, 13], [9, 13], [10, 13], [12, 13],
  [5, 14], [6, 14], [11, 14], [13, 14],
];

const FINDERS = [
  [0, 0],
  [10.4583, 0],
  [0.0556, 10.75],
];

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="4.5833" height="4.75" rx="0.694" fill="#000" />
      <rect x="0.9445" y="0.9445" width="2.694" height="2.861" rx="0.611" fill="#feead5" />
      <circle cx="2.2917" cy="2.375" r="0.5764" fill="#000" />
    </g>
  );
}

export default function QrPanel() {
  const { openLead } = useUi();

  return (
    <div className="qr-card" data-reveal>
      <p className="qr-card-title">Scan the QR code to go to the form</p>
      <div className="qr-box">
        <svg
          className="qr-svg"
          viewBox="-0.03 0 15.11 15.5"
          role="img"
          aria-label="QR code that opens the Nawy Orders registration form"
        >
          <g fill="#000">
            {DOTS.map(([col, row]) => (
              <circle key={`${col}-${row}`} cx={0.5528 + col} cy={0.4972 + row * 1.0347} r="0.492" />
            ))}
            {FINDERS.map(([x, y]) => (
              <Finder key={`${x}-${y}`} x={x} y={y} />
            ))}
          </g>
        </svg>
      </div>
      <button type="button" className="qr-direct" onClick={openLead}>
        <span className="qr-direct-fill">Go to the form directly</span>
      </button>
    </div>
  );
}
