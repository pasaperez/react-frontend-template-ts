import { useEffect } from 'react';

interface DocumentMetadata {
    description: string;
    title: string;
}

function getDescriptionMetaTag(): HTMLMetaElement {
    const existingMetaTag: HTMLMetaElement | null = document.querySelector('meta[name="description"]');

    if (existingMetaTag !== null) {
        return existingMetaTag;
    }

    const metaTag: HTMLMetaElement = document.createElement('meta');

    metaTag.name = 'description';
    document.head.append(metaTag);

    return metaTag;
}

export function useDocumentMetadata({ description, title }: DocumentMetadata): void {
    useEffect((): void => {
        document.title = title;
        getDescriptionMetaTag().content = description;
    }, [description, title]);
}
