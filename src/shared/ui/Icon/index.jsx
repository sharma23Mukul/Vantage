import * as icons from 'lucide-react';
import s from './Icon.module.css';

// "arrow-down-left" → "ArrowDownLeft"
function toPascal(str) {
  return str
    .split(/[-_\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

export function Icon({ name, size = 20, color = 'currentColor', className, ...rest }) {
  const Comp = icons[toPascal(name)] || icons[name];
  if (!Comp) return null;

  const cls = [s.icon, className].filter(Boolean).join(' ');

  return (
    <span className={cls} {...rest}>
      <Comp size={size} color={color} />
    </span>
  );
}
