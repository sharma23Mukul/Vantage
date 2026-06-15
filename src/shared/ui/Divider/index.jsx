import s from './Divider.module.css';

const spacingMap = { sm: s.sm, md: s.md, lg: s.lg };

export function Divider({ spacing = 'md', opacity = 1 }) {
  const cls = [s.divider, spacingMap[spacing]].join(' ');

  return <hr className={cls} style={{ opacity }} />;
}
