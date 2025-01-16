import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({
    value,
    onChange,
    error = ''
}) => {
    const editorRef = useRef(null);

    // Asegurarnos de que value sea un string
    const editorValue = typeof value === 'string' ? value : '';

    const handleEditorChange = (content) => {
        // Llamamos directamente a onChange con el contenido
        if (onChange) {
            onChange(content);
        }
    };

    return (
        <div className="rich-text-editor">
            <Editor
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.2/tinymce.min.js"
                onInit={(evt, editor) => editorRef.current = editor}
                value={editorValue}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                        'preview', 'searchreplace', 'fullscreen',
                        'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | ' +
                        'bold italic | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist | ' +
                        'removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    branding: false
                }}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

RichTextEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default RichTextEditor;