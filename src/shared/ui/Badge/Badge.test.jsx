import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './index';

describe('Badge component', () => {
  it('renders children text', () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge>Tag</Badge>);
    const el = screen.getByText('Tag');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies the default variant class', () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('badge');
  });
});
