import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ]
};

export default function Editor({ value, onChange }) {
    return (
        <>
            <ReactQuill
                theme={'snow'}
                value={value}
                onChange={onChange}
                modules={modules} >
            </ReactQuill>
        </>
    );
}