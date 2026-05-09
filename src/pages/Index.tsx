import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = "GitMerge" | "Bug" | "Sparkles" | "RefreshCw" | "FileText" | "Layers";

const triggers: { id: number; icon: IconName; label: string; description: string; angle: number }[] = [
  {
    id: 1,
    icon: "GitMerge",
    label: "Слияние\nветок",
    description: "Merge в основную ветку объединяет изменения нескольких разработчиков — потенциальный источник конфликтов.",
    angle: -90,
  },
  {
    id: 2,
    icon: "Bug",
    label: "Исправление\nдефектов",
    description: "Исправление дефекта может затронуть смежную функциональность — регрессия проверяет отсутствие новых поломок.",
    angle: -30,
  },
  {
    id: 3,
    icon: "Sparkles",
    label: "Новый\nфункционал",
    description: "Добавление нового функционала нередко влияет на существующие сценарии работы системы.",
    angle: 30,
  },
  {
    id: 4,
    icon: "RefreshCw",
    label: "Рефакторинг",
    description: "Изменение внутренней структуры кода без изменения поведения требует проверки — рефакторинг может сломать логику.",
    angle: 90,
  },
  {
    id: 5,
    icon: "FileText",
    label: "Новые\nтребования",
    description: "Появление новых требований меняет ожидаемое поведение системы и требует пересмотра существующих тест-кейсов.",
    angle: 150,
  },
  {
    id: 6,
    icon: "Layers",
    label: "Изменение\nбизнес-логики",
    description: "Правки в бизнес-правилах и процессах затрагивают ключевые сценарии — регрессия обязательна.",
    angle: 210,
  },
];

const RADIUS = 195;
const CENTER = 300;
const SVG_SIZE = 600;
const NODE_R = 44;
const INNER_R = 64;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      markerWidth="7"
      markerHeight="7"
      refX="5"
      refY="3.5"
      orient="auto"
    >
      <polygon points="0 0, 7 3.5, 0 7" fill={color} />
    </marker>
  );
}

export default function Index() {
  const [active, setActive] = useState<number | null>(null);
  const activeTrigger = triggers.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-white flex flex-col select-none" style={{ fontFamily: '"Golos Text", sans-serif' }}>
      {/* Header */}
      <header className="px-12 pt-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-2" style={{ letterSpacing: "0.22em" }}>
            Регрессионное тестирование
          </p>
          <h1 className="text-3xl font-semibold text-gray-900" style={{ letterSpacing: "-0.02em" }}>
            Триггеры запуска
          </h1>
        </div>
        <div className="text-right pt-1">
          <p className="text-xs text-gray-300 font-medium tracking-widest uppercase">QA Strategy</p>
          <p className="text-xs text-gray-300 mt-1">2026</p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="flex items-center gap-12 w-full max-w-5xl">

          {/* SVG diagram */}
          <div className="relative flex-shrink-0" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
            <svg
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              className="overflow-visible"
            >
              <defs>
                <ArrowMarker id="arrow-default" color="#c8c8c8" />
                <ArrowMarker id="arrow-active" color="#1a1a1a" />
              </defs>

              {/* Outer faint ring */}
              <circle cx={CENTER} cy={CENTER} r={RADIUS + 52} fill="none" stroke="#f0f0f0" strokeWidth="1" />

              {/* Dashed orbit ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#ebebeb"
                strokeWidth="1"
                strokeDasharray="3 8"
              />

              {/* Arrows from outer nodes → center */}
              {triggers.map((t) => {
                const nodePos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
                const isActive = active === t.id;

                // Start: edge of outer node (toward center)
                const dx = CENTER - nodePos.x;
                const dy = CENTER - nodePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const nx = dx / dist;
                const ny = dy / dist;

                const x1 = nodePos.x + nx * (NODE_R + 2);
                const y1 = nodePos.y + ny * (NODE_R + 2);
                // End: just outside inner circle (arrowhead lands at edge)
                const x2 = CENTER - nx * (INNER_R + 8);
                const y2 = CENTER - ny * (INNER_R + 8);

                return (
                  <line
                    key={`arrow-${t.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isActive ? "#1a1a1a" : "#c8c8c8"}
                    strokeWidth={isActive ? 1.5 : 0.9}
                    markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow-default)"}
                    style={{ transition: "all 0.35s ease" }}
                  />
                );
              })}

              {/* Outer node circles */}
              {triggers.map((t) => {
                const pos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
                const isActive = active === t.id;
                return (
                  <circle
                    key={`node-${t.id}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R}
                    fill={isActive ? "#1a1a1a" : "white"}
                    stroke={isActive ? "#1a1a1a" : "#d4d4d4"}
                    strokeWidth="1"
                    style={{ transition: "all 0.35s ease", cursor: "pointer" }}
                    onClick={() => setActive(active === t.id ? null : t.id)}
                  />
                );
              })}

              {/* Node labels inside circles */}
              {triggers.map((t) => {
                const pos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
                const isActive = active === t.id;
                const lines = t.label.split("\n");
                const lineHeight = 11;
                const totalH = lines.length * lineHeight;
                const startY = pos.y - totalH / 2 + lineHeight / 2 - 8;

                return (
                  <g key={`label-${t.id}`} style={{ cursor: "pointer" }} onClick={() => setActive(active === t.id ? null : t.id)}>
                    {/* Icon placeholder area */}
                    <foreignObject
                      x={pos.x - 10}
                      y={startY - 2}
                      width={20}
                      height={20}
                      style={{ overflow: "visible", pointerEvents: "none" }}
                    />
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={pos.x}
                        y={pos.y + (li - (lines.length - 1) / 2) * lineHeight + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isActive ? "white" : "#1a1a1a"}
                        fontSize="8"
                        fontFamily='"Golos Text", sans-serif'
                        fontWeight="500"
                        style={{ transition: "fill 0.3s", pointerEvents: "none" }}
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Center circle */}
              <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
              <circle cx={CENTER} cy={CENTER} r={55} fill="#1a1a1a" />
              <text x={CENTER} y={CENTER - 7} textAnchor="middle" fill="white" fontSize="8" fontFamily='"Golos Text", sans-serif' fontWeight="600" letterSpacing="1.5">REGRESSION</text>
              <text x={CENTER} y={CENTER + 8} textAnchor="middle" fill="white" fontSize="8" fontFamily='"Golos Text", sans-serif' fontWeight="600" letterSpacing="1.5">TESTING</text>
            </svg>

            {/* Icon overlays above each node */}
            {triggers.map((t, i) => {
              const pos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
              const isActive = active === t.id;
              return (
                <button
                  key={`icon-${t.id}`}
                  onClick={() => setActive(active === t.id ? null : t.id)}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${(pos.x / SVG_SIZE) * 100}%`,
                    top: `${(pos.y / SVG_SIZE) * 100}%`,
                    transform: "translate(-50%, -68px)",
                    width: 24,
                    height: 24,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    animation: `fade-in 0.5s ease-out ${i * 0.09 + 0.1}s both`,
                  }}
                >
                  <Icon
                    name={t.icon}
                    size={14}
                    style={{ color: isActive ? "#1a1a1a" : "#aaaaaa", transition: "color 0.3s" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Info panel */}
          <div className="flex-1 min-w-0">
            {activeTrigger ? (
              <div key={activeTrigger.id} style={{ animation: "fade-in 0.35s ease-out both" }}>
                <div
                  className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                  style={{ background: "#f5f5f5" }}
                >
                  <Icon name={activeTrigger.icon} size={13} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-500">
                    Триггер {activeTrigger.id} / {triggers.length}
                  </span>
                </div>

                <h2
                  className="text-2xl font-semibold text-gray-900 mb-3 leading-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {activeTrigger.label.replace("\n", " ")}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {activeTrigger.description}
                </p>

                <div className="w-8 h-px bg-gray-100 mb-6" />

                <button
                  onClick={() => setActive(null)}
                  className="text-xs text-gray-300 hover:text-gray-600 transition-colors duration-200"
                  style={{ letterSpacing: "0.05em" }}
                >
                  ← все триггеры
                </button>
              </div>
            ) : (
              <div style={{ animation: "fade-in 0.4s ease-out both" }}>
                <p className="text-xs font-medium text-gray-300 uppercase mb-6" style={{ letterSpacing: "0.2em" }}>
                  Обзор
                </p>
                <h2
                  className="text-2xl font-semibold text-gray-900 mb-3 leading-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  6 условий для<br />запуска регрессии
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Нажмите на узел схемы, чтобы узнать подробнее о каждом триггере.
                </p>

                <div className="flex flex-col gap-3">
                  {triggers.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setActive(t.id)}
                      className="flex items-center gap-3 text-left group"
                      style={{ animation: `fade-in 0.4s ease-out ${i * 0.06}s both` }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-gray-900"
                        style={{ background: "#f2f2f2" }}
                      >
                        <Icon
                          name={t.icon}
                          size={12}
                          className="text-gray-500 group-hover:text-white transition-colors duration-200"
                        />
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors duration-200">
                        {t.label.replace("\n", " ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-12 pb-8">
        <div className="w-full h-px bg-gray-100 mb-4" />
        <div className="flex justify-between">
          <span className="text-xs text-gray-300">Регрессионное тестирование</span>
          <span className="text-xs text-gray-300">6 триггеров</span>
        </div>
      </footer>
    </div>
  );
}
