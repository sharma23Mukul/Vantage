import s from './Tag.module.css';

export function Tag({ children, variant = 'default' }) {
  const cls = [s.tag, s[variant]].join(' ');

  return <span className={cls}>{children}</span>;
}
