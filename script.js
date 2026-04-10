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

const wheel = document.getElementById("wheel");
const wheelLabels = document.getElementById("wheelLabels");
const resultModal = document.getElementById("resultModal");
const resultNameText = document.getElementById("resultNameText");
const closeBtn = document.getElementById("closeBtn");

let options = [...initialOptions];
let forcedCursor = 0;
let currentRotation = 0;
let spinning = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

function getSegmentAngle() {
  return options.length ? 360 / options.length : 360;
}

function getWheelGradient() {
  if (!options.length) {
    return "radial-gradient(circle at center, rgba(255, 255, 255, 0.6), rgba(190, 196, 184, 0.92))";
  }

  const palette = ["#a5b4c2", "#a2b08e", "#cbc5a5"];
  const segmentAngle = getSegmentAngle();
  const stops = options
    .map((_, index) => {
      const start = (index * segmentAngle).toFixed(2);
      const end = ((index + 1) * segmentAngle).toFixed(2);
      const color = palette[index % palette.length];
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return `conic-gradient(from -90deg, ${stops})`;
}

function renderWheel() {
  wheelLabels.innerHTML = "";
  wheel.style.background = getWheelGradient();

  if (!options.length) {
    const emptyLabel = document.createElement("span");
    emptyLabel.className = "wheel-empty";
    emptyLabel.textContent = "All picked";
    wheelLabels.appendChild(emptyLabel);
    wheel.setAttribute("aria-disabled", "true");
    return;
  }

  wheel.removeAttribute("aria-disabled");
  const segmentAngle = getSegmentAngle();

  options.forEach((name, index) => {
    const label = document.createElement("span");
    label.className = "wheel-label";
    label.style.setProperty("--angle", `${index * segmentAngle}deg`);
    label.textContent = name;
    wheelLabels.appendChild(label);
  });
}

function getForcedTarget() {
  if (!options.length) {
    return null;
  }

  const availableForced = forcedOrder.find((name, index) => index >= forcedCursor && options.includes(name));
  if (availableForced) {
    forcedCursor = forcedOrder.indexOf(availableForced) + 1;
    return availableForced;
  }

  const randomIndex = randomInt(0, options.length - 1);
  return options[randomIndex];
}

function removeOption(name) {
  options = options.filter((option) => option !== name);
  renderWheel();
}

function spinWheel() {
  if (spinning || !options.length) {
    return;
  }

  spinning = true;

  const target = getForcedTarget();
  const targetIndex = options.indexOf(target);
  const segmentAngle = getSegmentAngle();
  const jitter = (Math.random() - 0.5) * (segmentAngle * 0.34);
  const destinationMod = normalizeDeg(360 - (targetIndex * segmentAngle + segmentAngle / 2) + jitter);

  const loops = randomInt(5, 8);
  const duration = (Math.random() * 1.2 + 4.4).toFixed(2);
  wheel.style.transitionDuration = `${duration}s`;

  const currentMod = normalizeDeg(currentRotation);
  const delta = loops * 360 + normalizeDeg(destinationMod - currentMod);
  const finalRotation = currentRotation + delta;

  wheel.addEventListener(
    "transitionend",
    () => {
      currentRotation = finalRotation;
      resultNameText.textContent = target;
      resultModal.classList.remove("hidden");
      removeOption(target);
      spinning = false;
    },
    { once: true }
  );

  wheel.style.transform = `rotate(${finalRotation}deg)`;
}

wheel.addEventListener("click", spinWheel);
wheel.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    spinWheel();
  }
});

closeBtn.addEventListener("click", () => {
  resultModal.classList.add("hidden");
});

resultModal.addEventListener("click", (event) => {
  if (event.target === resultModal) {
    resultModal.classList.add("hidden");
  }
});

renderWheel();
