"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { WheelDataType } from "react-custom-roulette-r19";

const Wheel = dynamic(
  () => import("react-custom-roulette-r19").then((module) => module.Wheel),
  {
    loading: () => <div className="wheel-loading" aria-hidden="true" />,
    ssr: false,
  },
);

const initialOptions = [
  "Modern Gothic",
  "Retro Glamour",
  "Teenage Dream",
  "Cyber Futurism",
  "Steampunk",
  "Only in the 2000s",
  "Shoujo",
];

const forcedOrder = ["Modern Gothic", "Retro Glamour", "Teenage Dream"];
const wheelColors = ["#a5b4c2", "#a2b08e", "#cbc5a5"];

const pointerSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 90'%3E%3Cpath d='M50 90 0 0h100z' fill='%23111'/%3E%3C/svg%3E";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Home() {
  const [options, setOptions] = useState(initialOptions);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedOption, setSelectedOption] = useState(initialOptions[1]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const forcedCursor = useRef(0);
  const pendingResult = useRef<string | null>(null);

  const wheelData = useMemo<WheelDataType[]>(
    () => options.map((option) => ({ option })),
    [options],
  );

  function getForcedTarget() {
    const availableForced = forcedOrder.find(
      (name, index) => index >= forcedCursor.current && options.includes(name),
    );

    if (availableForced) {
      forcedCursor.current = forcedOrder.indexOf(availableForced) + 1;
      return availableForced;
    }

    return options[randomInt(0, options.length - 1)];
  }

  function spinWheel() {
    if (mustSpin || !options.length) {
      return;
    }

    const target = getForcedTarget();
    pendingResult.current = target;
    setPrizeNumber(options.indexOf(target));
    setMustSpin(true);
  }

  function handleStopSpinning() {
    const target = pendingResult.current;
    setMustSpin(false);

    if (!target) {
      return;
    }

    setSelectedOption(target);
    setIsModalOpen(true);
    setOptions((currentOptions) =>
      currentOptions.filter((option) => option !== target),
    );
    pendingResult.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      spinWheel();
    }
  }

  return (
    <>
      <main className="stage">
        <div className="wheel-frame">
          <div className="pointer" aria-hidden="true" />
          <div
            aria-disabled={!options.length || mustSpin}
            aria-label="Aesthetic wheel"
            className="wheel-action"
            onClick={spinWheel}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            {options.length ? (
              <Wheel
                backgroundColors={wheelColors}
                data={wheelData}
                disableInitialAnimation
                fontFamily="Arial"
                fontSize={18}
                fontWeight={700}
                innerBorderWidth={0}
                mustStartSpinning={mustSpin}
                onStopSpinning={handleStopSpinning}
                outerBorderColor="#222"
                outerBorderWidth={4}
                perpendicularText={false}
                pointerProps={{
                  src: pointerSvg,
                  style: {
                    right: "50%",
                    top: "-22px",
                    transform: "translateX(50%)",
                    width: "28px",
                  },
                }}
                prizeNumber={prizeNumber}
                radiusLineColor="#222"
                radiusLineWidth={1}
                spinDuration={0.5}
                textColors={["#111"]}
                textDistance={62}
              />
            ) : (
              <div className="wheel-empty">All picked</div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen ? (
        <section
          aria-labelledby="resultTitle"
          aria-modal="true"
          className="result-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
          role="dialog"
        >
          <div className="result-card">
            <h2 id="resultTitle">Selected Option</h2>
            <p className="result-name">
              <span>{selectedOption}</span>
            </p>
            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              yayy!!
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
