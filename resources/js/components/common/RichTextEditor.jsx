import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({
    value = '',
    onChange,
    error = ''
}) => {
    const editorRef = useRef(null);

    // Asegurarnos de que value nunca sea null
    const safeValue = value ?? '';

    const handleEditorChange = (content) => {
        onChange({
            target: {
                name: 'content',
                value: content || ''
            }
        });
    };

    // Verificar la API key de TinyMCE
    if (!window.config?.tinymceApiKey) {
    console.warn('TinyMCE API key no encontrada. Verifica la configuración.');
    }

    return (
        <div className="rich-text-editor">
            <Editor
                onInit={(_, editor) => editorRef.current = editor}
                apiKey={window.config?.tinymceApiKey}
                value={safeValue}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                        'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: `
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                            font-size: 16px;
                            line-height: 1.6;
                            margin: 1rem;
                        }
                        p { margin: 0 0 1rem 0; }
                        h1, h2, h3, h4, h5, h6 {
                            margin: 1.5rem 0 1rem;
                            line-height: 1.2;
                        }
                    `,
                    formats: {
                        bold: { inline: 'strong' },
                        italic: { inline: 'em' }
                    },
                    menu: {
                        file: { title: 'Archivo', items: 'newdocument restoredraft | preview | print' },
                        edit: { title: 'Editar', items: 'undo redo | cut copy | selectall | searchreplace' },
                        view: { title: 'Ver', items: 'code | visualaid visualchars visualblocks | preview fullscreen' },
                        insert: { title: 'Insertar', items: 'link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
                        format: { title: 'Formato', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
                        tools: { title: 'Herramientas', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                        table: { title: 'Tabla', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    },
                    paste_data_images: false,
                    automatic_uploads: false,
                    file_picker_types: '',
                    promotion: false,
                    branding: false,
                    elementpath: false,
                    statusbar: true,
                    resize: false,
                    placeholder: 'Escribe el contenido de tu artículo aquí...',
                    language: 'es',
                    language_url: '/tinymce/langs/es.js'
                }}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

RichTextEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default RichTextEditor;