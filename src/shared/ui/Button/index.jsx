import s from './Button.module.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  as: Tag = 'button',
  className,
  ...rest
}) {
  const cls = [s.btn, s[variant], s[size], className].filter(Boolean).join(' ');

  return (
    <Tag
      className={cls}
      onClick={onClick}
      disabled={Tag === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
