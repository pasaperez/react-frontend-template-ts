import { useDocumentMetadata } from '@app/seo/useDocumentMetadata';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function MetadataFixture({ description, title }: { description: string; title: string; }) {
    useDocumentMetadata({ description, title });

    return null;
}

describe('useDocumentMetadata', () => {
    it('updates the existing document metadata when a description meta tag is already present', () => {
        document.head.innerHTML = '<meta content="Original description" name="description" />';
        document.title = 'Original title';

        render(<MetadataFixture description='Updated description' title='Updated title' />);

        expect(document.title).toBe('Updated title');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Updated description');
    });

    it('creates a description meta tag when the document does not have one', () => {
        document.head.innerHTML = '';
        document.title = 'Original title';

        render(<MetadataFixture description='Created description' title='Created title' />);

        expect(document.title).toBe('Created title');
        expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Created description');
    });
});
