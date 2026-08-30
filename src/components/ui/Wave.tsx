import { PRIMARY } from '@/lib/constants';

export default function Wave() {
  return (
    <div style={{ background: PRIMARY, lineHeight: 0, marginBottom: '-1px' }}>
      <svg viewBox="0 0 430 80" preserveAspectRatio="none"
        style={{ width: '100%', height: '72px', display: 'block' }}>
        <path d="M0,52 C75,12 155,74 252,38 C328,10 392,54 430,42 L430,82 L0,82 Z" fill="white" />
      </svg>
    </div>
  );
}
