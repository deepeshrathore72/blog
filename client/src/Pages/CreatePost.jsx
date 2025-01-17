import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        // console.log(files);
        const response = await fetch('http://localhost:8080/post', {
            method : 'post',
            body : data,
            credentials : 'include'
        });
        // console.log(await response.json());
        if(response.ok){
            setRedirect(true);
        }
        else{
            setRedirect(false);
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }

    return(
        <form onSubmit={createNewPost}>
            <input type="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} required/>
            <input type="summary" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} required/>
            <input type="file" onChange={ev => setFiles(ev.target.files)} required/>
            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Create post</button>
        </form>
    )
}