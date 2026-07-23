import React, { useId, useMemo } from 'react';
import DottedMapLib from 'dotted-map';

// Pre-compute map data for performance
const cachedMap = new DottedMapLib({ height: 60, grid: 'diagonal' });
const cachedSvgMap = cachedMap.getSVG({
  radius: 0.22,
  color: '#c8c8c8',
  shape: 'circle',
  backgroundColor: 'transparent',
});

// Parse SVG to extract dot data
function parseSvgDots(svgString) {
  const dots = [];
  const regex = /cx="([^"]+)"\s+cy="([^"]+)"\s+r="([^"]+)"\s+fill="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svgString)) !== null) {
    dots.push({
      cx: parseFloat(match[1]),
      cy: parseFloat(match[2]),
      r: parseFloat(match[3]),
      fill: match[4],
    });
  }
  return dots;
}

// Convert lat/lng to SVG coordinates (Mercator-like projection)
function latLngToSvg(lat, lng, svgWidth, svgHeight) {
  const x = ((lng + 180) / 360) * svgWidth;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = svgHeight / 2 - (svgWidth * mercN) / (2 * Math.PI);
  return { x, y };
}

export default function DottedMap({ markers = [] }) {
  const id = useId();

  const { dots, viewBox } = useMemo(() => {
    const parsedDots = parseSvgDots(cachedSvgMap);
    const vbMatch = cachedSvgMap.match(/viewBox="([^"]+)"/);
    const vb = vbMatch ? vbMatch[1] : '0 0 120 60';
    return { dots: parsedDots, viewBox: vb };
  }, []);

  const [, , svgW, svgH] = viewBox.split(' ').map(Number);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
      {/* Radial gradient overlay for fade edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 30%, var(--bg-primary, #f5f0eb) 80%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* All background dots */}
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
        ))}

        {/* Markers with flags, labels, and pulse */}
        {markers.map((marker, index) => {
          const { x, y } = latLngToSvg(marker.lat, marker.lng, svgW, svgH);
          const r = marker.size || 3.5;
          const { countryCode, label } = marker.overlay;
          const flagUrl = `https://flagcdn.com/w80/${countryCode}.webp`;
          const clipId = `${id}-flag-${index}`.replace(/:/g, '-');

          const imgR = r * 0.7;
          const fontSize = r * 0.85;
          const pillH = r * 1.6;
          const pillW = label.length * (fontSize * 0.58) + r * 1.6;
          const pillX = x + r + r * 0.5;
          const pillY = y - pillH / 2;

          return (
            <g key={index} style={{ pointerEvents: 'none' }}>
              {/* Outer pulse ring */}
              <circle cx={x} cy={y} r={r} fill="none" stroke="#f97316" strokeWidth={0.25} opacity={0.6}>
                <animate attributeName="r" from={r} to={r * 3} dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Inner pulse ring (delayed) */}
              <circle cx={x} cy={y} r={r} fill="none" stroke="#f97316" strokeWidth={0.2} opacity={0.4}>
                <animate attributeName="r" from={r} to={r * 2.5} dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
              </circle>

              {/* Marker circle with border */}
              <circle cx={x} cy={y} r={r} fill="#f97316" />
              <circle cx={x} cy={y} r={r + 0.3} fill="none" stroke="white" strokeWidth={0.4} />

              {/* Flag clipped to circle */}
              <defs>
                <clipPath id={clipId}>
                  <circle cx={x} cy={y} r={imgR} />
                </clipPath>
              </defs>
              <image
                href={flagUrl}
                x={x - imgR}
                y={y - imgR}
                width={imgR * 2}
                height={imgR * 2}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />

              {/* Label pill background */}
              <rect
                x={pillX}
                y={pillY}
                width={pillW}
                height={pillH}
                rx={pillH / 2}
                fill="rgba(0,0,0,0.6)"
              />
              {/* Label text */}
              <text
                x={pillX + r * 0.8}
                y={y + fontSize * 0.35}
                fontSize={fontSize}
                fill="white"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="500"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
