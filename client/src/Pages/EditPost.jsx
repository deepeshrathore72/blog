import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/post/' + id).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setTitle(data.title);
                    setSummary(data.summary);
                    setContent(data.content);
                });
            }
        });
    }, []);

    async function updatePost(ev) {

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        ev.preventDefault();

        const response = await fetch('http://localhost:8080/post', {
            method: 'put',
            body : data,
            credentials : 'include'
        });
        if(response.ok){
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/'+id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} />
            <input type="summary" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} />
            <input type="file" onChange={ev => setFiles(ev.target.files)} />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    )
}