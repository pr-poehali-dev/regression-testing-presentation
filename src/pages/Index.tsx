import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = "RefreshCw" | "Bug" | "Sparkles" | "GitMerge" | "Settings" | "AlertTriangle";

const triggers: { id: number; icon: IconName; label: string; description: string; angle: number }[] = [
  {
    id: 1,
    icon: "RefreshCw",
    label: "Обновление\nзависимостей",
    description: "Изменение версий библиотек или фреймворков в проекте требует полной проверки совместимости.",
    angle: -90,
  },
  {
    id: 2,
    icon: "Bug",
    label: "Bug Fix",
    description: "Исправление дефекта может затронуть смежную функциональность — регрессия проверяет отсутствие новых поломок.",
    angle: -30,
  },
  {
    id: 3,
    icon: "Sparkles",
    label: "Новая\nфича",
    description: "Добавление нового функционала нередко влияет на существующие сценарии работы системы.",
    angle: 30,
  },
  {
    id: 4,
    icon: "GitMerge",
    label: "Слияние\nветок",
    description: "Merge в основную ветку объединяет изменения нескольких разработчиков — потенциальный источник конфликтов.",
    angle: 90,
  },
  {
    id: 5,
    icon: "Settings",
    label: "Изменение\nконфигурации",
    description: "Правки в настройках окружения, CI/CD пайплайна или инфраструктуры требуют обязательной проверки.",
    angle: 150,
  },
  {
    id: 6,
    icon: "AlertTriangle",
    label: "Критический\nдефект",
    description: "Обнаружение дефекта высокого приоритета в продакшне инициирует немедленный запуск регрессии.",
    angle: 210,
  },
];

const RADIUS = 195;
const CENTER = 300;
const SVG_SIZE = 600;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function Index() {
  const [active, setActive] = useState<number | null>(null);

  const activeTrigger = triggers.find((t) => t.id === active);

  return (
    <div
      className="min-h-screen bg-white flex flex-col select-none"
      style={{ fontFamily: '"Golos Text", sans-serif' }}
    >
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
              {/* Outer faint ring */}
              <circle cx={CENTER} cy={CENTER} r={RADIUS + 52} fill="none" stroke="#f0f0f0" strokeWidth="1" />

              {/* Dashed mid ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#e4e4e4"
                strokeWidth="1"
                strokeDasharray="3 8"
              />

              {/* Connector lines */}
              {triggers.map((t) => {
                const outer = polarToCartesian(CENTER, CENTER, RADIUS - 4, t.angle);
                const inner = polarToCartesian(CENTER, CENTER, 64, t.angle);
                const isActive = active === t.id;
                return (
                  <line
                    key={`line-${t.id}`}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={isActive ? "#1a1a1a" : "#e0e0e0"}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    style={{ transition: "all 0.35s ease" }}
                  />
                );
              })}

              {/* Node circles */}
              {triggers.map((t) => {
                const pos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
                const isActive = active === t.id;
                return (
                  <circle
                    key={`node-${t.id}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={40}
                    fill={isActive ? "#1a1a1a" : "white"}
                    stroke={isActive ? "#1a1a1a" : "#d8d8d8"}
                    strokeWidth={isActive ? 0 : 1}
                    style={{ transition: "all 0.35s ease", cursor: "pointer" }}
                    onClick={() => setActive(active === t.id ? null : t.id)}
                  />
                );
              })}

              {/* Center inner fill */}
              <circle cx={CENTER} cy={CENTER} r={64} fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
              <circle cx={CENTER} cy={CENTER} r={55} fill="#1a1a1a" />
              <text x={CENTER} y={CENTER - 7} textAnchor="middle" fill="white" fontSize="8.5" fontFamily='"Golos Text", sans-serif' fontWeight="600" letterSpacing="2">REGRESSION</text>
              <text x={CENTER} y={CENTER + 9} textAnchor="middle" fill="white" fontSize="8.5" fontFamily='"Golos Text", sans-serif' fontWeight="600" letterSpacing="2">TESTING</text>
            </svg>

            {/* Icon overlays */}
            {triggers.map((t, i) => {
              const pos = polarToCartesian(CENTER, CENTER, RADIUS, t.angle);
              const isActive = active === t.id;
              return (
                <button
                  key={`icon-${t.id}`}
                  onClick={() => setActive(active === t.id ? null : t.id)}
                  className="absolute flex flex-col items-center justify-center gap-1"
                  style={{
                    left: `${(pos.x / SVG_SIZE) * 100}%`,
                    top: `${(pos.y / SVG_SIZE) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 80,
                    height: 80,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    animation: `fade-in 0.5s ease-out ${i * 0.09 + 0.2}s both`,
                  }}
                >
                  <Icon
                    name={t.icon}
                    size={17}
                    style={{ color: isActive ? "white" : "#1a1a1a", transition: "color 0.3s" }}
                  />
                  <span
                    className="text-center leading-tight"
                    style={{
                      fontSize: "7.5px",
                      fontFamily: '"Golos Text", sans-serif',
                      fontWeight: 500,
                      color: isActive ? "rgba(255,255,255,0.8)" : "#888",
                      whiteSpace: "pre-line",
                      transition: "color 0.3s",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {t.label}
                  </span>
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
                      style={{
                        animation: `fade-in 0.4s ease-out ${i * 0.06}s both`,
                      }}
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