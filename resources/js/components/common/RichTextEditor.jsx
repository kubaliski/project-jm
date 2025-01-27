import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EditorSkeleton from '../ui/Skeletons/EditorSkeleton';
import { Editor } from '@tinymce/tinymce-react';
import { fetchEditorConfig } from '@store/admin/thunks/configThunks';
import {
    selectEditorConfig,
    selectConfigLoading,
    selectConfigError
} from '@store/admin/selectors/configSelectors';

const RichTextEditor = ({
    value,
    onChange,
    error = '',
    readOnly = false
}) => {
    const dispatch = useDispatch();
    const { apiKey } = useSelector(selectEditorConfig);
    const loading = useSelector(selectConfigLoading);
    const configError = useSelector(selectConfigError);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!apiKey) {
            dispatch(fetchEditorConfig());
        }
    }, [dispatch, apiKey]);

    const editorValue = typeof value === 'string' ? value : '';


    if (loading) {
        return <EditorSkeleton />;
    }

    if (configError) {
        return (
            <div className="border border-red-300 rounded-md p-4 bg-red-50">
                <p className="text-red-600">Error al cargar el editor</p>
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div className="border border-yellow-300 rounded-md p-4 bg-yellow-50">
                <p className="text-yellow-600">No se encontró la configuración del editor</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-md shadow-sm">
            <Editor
                apiKey={apiKey}
                // Actualizamos a la última versión estable
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                onInit={(evt, editor) => editorRef.current = editor}
                value={editorValue}
                onEditorChange={onChange}
                init={{
                    height: 500,
                    menubar: readOnly ? false : 'file edit view insert format tools table help',
                    readonly: readOnly,
                    // Reducimos los plugins a los que están disponibles de manera confiable
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'code', 'fullscreen', 'insertdatetime', 'media', 'table',
                        'help', 'wordcount', 'emoticons'
                    ],
                    toolbar: readOnly ? false : [
                        'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
                        'bullist numlist outdent indent | link image media | forecolor backcolor emoticons',
                        'table | visualblocks code fullscreen help'
                    ],
                    toolbar_mode: 'sliding',
                    contextmenu: 'link image table',
                    content_style: `
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                            color: #1f2937;
                        }
                    `,
                    branding: false,
                    promotion: false,
                    images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                        reject('Funcionalidad de subida de imágenes no implementada');
                    }),
                    style_formats: [
                        { title: 'Encabezados', items: [
                            { title: 'Encabezado 1', format: 'h1' },
                            { title: 'Encabezado 2', format: 'h2' },
                            { title: 'Encabezado 3', format: 'h3' },
                            { title: 'Encabezado 4', format: 'h4' }
                        ]},
                        { title: 'Bloques', items: [
                            { title: 'Párrafo', format: 'p' },
                            { title: 'Blockquote', format: 'blockquote' },
                            { title: 'Div', format: 'div' },
                            { title: 'Pre', format: 'pre' }
                        ]},
                        { title: 'Contenedores', items: [
                            { title: 'Alerta Info', block: 'div', classes: 'alert alert-info', wrapper: true },
                            { title: 'Alerta Éxito', block: 'div', classes: 'alert alert-success', wrapper: true },
                            { title: 'Alerta Advertencia', block: 'div', classes: 'alert alert-warning', wrapper: true },
                            { title: 'Alerta Error', block: 'div', classes: 'alert alert-error', wrapper: true }
                        ]}
                    ],
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                    quickbars_insert_toolbar: 'image media table',
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    visualblocks_default_state: false,
                    end_container_on_empty_block: true,
                    extended_valid_elements: 'span[*],i[*],em[*],strong[*],a[*]',
                    visual: true,
                    image_caption: true,
                    image_advtab: true,
                    content_css: false,
                    convert_urls: false,
                    relative_urls: false,
                    remove_script_host: true
                }}
            />
             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

RichTextEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    readOnly: PropTypes.bool
};

export default RichTextEditor;