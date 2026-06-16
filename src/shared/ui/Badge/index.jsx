import s from './Badge.module.css';

export function Badge({ children, variant = 'default' }) {
  const cls = [s.badge, s[variant]].join(' ');

  return <span className={cls}>{children}</span>;
}
