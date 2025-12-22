import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';

type EditorBundle = {
    CKEditor: typeof import('@ckeditor/ckeditor5-react').CKEditor;
    ClassicEditor: typeof import('@ckeditor/ckeditor5-build-classic').default;
};

const loadEditor = () =>
    Promise.all([import('@ckeditor/ckeditor5-react'), import('@ckeditor/ckeditor5-build-classic')]).then(
        ([react, classic]) => ({
            CKEditor: react.CKEditor,
            ClassicEditor: classic.default,
        })
    );

type RichEditorProps = {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    error?: string;
};

export function RichEditor({ label, value, onChange, error }: RichEditorProps) {
    const config = useMemo(
        () => ({
            toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'link',
                '|',
                'bulletedList',
                'numberedList',
                '|',
                'insertTable',
                '|',
                'undo',
                'redo',
            ],
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
            },
        }),
        []
    );

    const [editorBundle, setEditorBundle] = useState<EditorBundle | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (typeof window === 'undefined') return;
        loadEditor()
            .then((bundle) => {
                if (!cancelled) setEditorBundle(bundle);
            })
            .catch((err) => {
                console.error('Failed to load CKEditor', err);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex flex-col gap-2">
            {label && <Label>{label}</Label>}
            {editorBundle ? (
                <editorBundle.CKEditor
                    editor={editorBundle.ClassicEditor}
                    data={value}
                    config={config}
                    onChange={(_, editor) => onChange(editor.getData())}
                    onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                            const root = editor.editing.view.document.getRoot();
                            if (root) {
                                writer.setStyle('min-height', '260px', root);
                            }
                        });
                    }}
                />
            ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-md border bg-muted/40 text-sm text-muted-foreground">
                    Učitavanje editora...
                </div>
            )}
            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    );
}
