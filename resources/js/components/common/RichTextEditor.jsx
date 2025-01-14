import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, error }) => {
    const editorRef = useRef(null);

    const handleEditorChange = (content, editor) => {
        onChange({
            target: {
                name: 'content',
                value: content
            }
        });
    };

    if (!window.config?.tinymceApiKey) {
        console.warn('TinyMCE API key no encontrada. Verifica la configuración.');
    }

    return (
        <div className="rich-text-editor">
            <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                apiKey={window.config?.tinymceApiKey}
                value={value}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: true,
                    // Quitamos 'image' de los plugins
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                        'help', 'wordcount', 'paste'
                    ],
                    // Quitamos 'image' de la barra de herramientas
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
                    translations: {
                        'es': {
                            'Bold': 'Negrita',
                            'Italic': 'Cursiva',
                            'Underline': 'Subrayado',
                            'Strikethrough': 'Tachado',
                            'Alignment': 'Alineación',
                            'Left': 'Izquierda',
                            'Center': 'Centro',
                            'Right': 'Derecha',
                            'Justify': 'Justificado',
                            'Bullet list': 'Lista de viñetas',
                            'Numbered list': 'Lista numerada',
                            'Decrease indent': 'Disminuir sangría',
                            'Increase indent': 'Aumentar sangría',
                            'Insert/edit link': 'Insertar/editar enlace',
                            'Remove link': 'Eliminar enlace',
                            'Paste': 'Pegar',
                            'Select all': 'Seleccionar todo',
                            'Undo': 'Deshacer',
                            'Redo': 'Rehacer',
                            'Blocks': 'Bloques',
                            'Paragraph': 'Párrafo',
                            'Heading 1': 'Encabezado 1',
                            'Heading 2': 'Encabezado 2',
                            'Heading 3': 'Encabezado 3',
                            'Heading 4': 'Encabezado 4',
                            'Heading 5': 'Encabezado 5',
                            'Heading 6': 'Encabezado 6',
                        }
                    },
                    // Quitamos las opciones relacionadas con imágenes del menú
                    menu: {
                        file: { title: 'Archivo', items: 'newdocument restoredraft | preview | print' },
                        edit: { title: 'Editar', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                        view: { title: 'Ver', items: 'code | visualaid visualchars visualblocks | preview fullscreen' },
                        insert: { title: 'Insertar', items: 'link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
                        format: { title: 'Formato', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
                        tools: { title: 'Herramientas', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                        table: { title: 'Tabla', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    },
                    // Quitamos las opciones de imagen
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

export default RichTextEditor;