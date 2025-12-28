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
    enableImages?: boolean;
    uploadUrl?: string;
};

export function RichEditor({ label, value, onChange, error, enableImages = false, uploadUrl }: RichEditorProps) {
    const config = useMemo(() => {
        const toolbar: string[] = [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
        ];

        if (enableImages) {
            toolbar.push('imageUpload', '|');
        } else {
            toolbar.push('|');
        }

        toolbar.push(
            'bulletedList',
            'numberedList',
            '|',
            'insertTable',
            '|',
            'undo',
            'redo'
        );

        return {
            toolbar,
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
            },
            ...(enableImages && uploadUrl
                ? {
                    simpleUpload: {
                        uploadUrl,
                        withCredentials: true,
                    },
                }
                : {}),
        };
    }, [enableImages, uploadUrl]);

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
                        if (enableImages) {
                            // Simple Base64 upload adapter so images embed directly into content.
                            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                                return {
                                    upload: () =>
                                        loader.file.then(
                                            (file: File) =>
                                                new Promise((resolve, reject) => {
                                                    const reader = new FileReader();
                                                    reader.onload = () => resolve({ default: reader.result as string });
                                                    reader.onerror = (err) => reject(err);
                                                    reader.readAsDataURL(file);
                                                })
                                        ),
                                    abort: () => {},
                                };
                            };
                        }

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
