import { star4 } from '@/lib/helpers';

export default function TopoBg() {
  const radii = [52, 82, 116, 153, 196, 244, 298];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 430 340"
      preserveAspectRatio="xMidYMid slice" fill="none">
      {radii.map((r, i) => (
        <ellipse key={i} cx="195" cy="192" rx={r} ry={Math.round(r * 0.61)}
          stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" transform="rotate(-12 195 192)" />
      ))}
      <polygon points={star4(338, 74, 10, 4)} fill="rgba(255,255,255,0.68)" />
      <polygon points={star4(80, 120, 6, 2.4)} fill="rgba(255,255,255,0.52)" />
      <circle cx="112" cy="50" r="3" fill="rgba(255,255,255,0.42)" />
      <circle cx="372" cy="150" r="2.5" fill="rgba(255,255,255,0.36)" />
      <circle cx="310" cy="34" r="2" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}
