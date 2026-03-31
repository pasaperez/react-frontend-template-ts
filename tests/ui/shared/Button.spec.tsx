import { Button } from '@shared/ui/Button';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Button', () => {
    it('defaults to button type when one is not provided', () => {
        render(<Button>Open</Button>);

        expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('type', 'button');
    });
});
