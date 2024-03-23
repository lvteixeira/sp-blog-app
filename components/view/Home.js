import React, { useState, useEffect, useRef }from "react";
import { useRouter } from "next/router.js";
import MenubarCustom from "@/components/ui/Menubar.js"
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import PostagemService from "@/service/PostagemService.js";
import homePageStyle from "@/styles/homePageStyle.module.css";

export default function Homepage() {
  const postagemService = new PostagemService();
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  const toast = useRef();
  const effectRan = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const currentSessionId = sessionStorage.getItem('currentSessionId');

    if(!currentSessionId) {
      router.push('/signin');
    }

    if(effectRan.current == false) {
      fetchPosts();
    }

    return () => {
      effectRan.current = true;
    }
  }, []);

  const fetchPosts = async () => {
    await postagemService.listAll()
      .then(res => {
        setPosts(res);
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro', life: 2600 });
      })
  };

  const handlePost = async () => {
    let payload = {
      content: text,
    }

    await postagemService.createPostagem(payload)
      .then(res => {
        toast.current.show({ severity: 'success', detail: 'Postagem criada com sucesso', life: 2600 });
        setText('');
        fetchPosts();
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro ao criar postagem', life: 2600 });
      });
  };

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };
  const header = renderHeader();

  return (
    <div>
      <MenubarCustom username={"Teste"} />
      <div className={homePageStyle.timelineContainer}>
        <Card title="Criar Postagem" className={homePageStyle.postCard}>
          <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} />
          <Button label="Postar" icon="pi pi-check" className="p-mt-2" onClick={handlePost} />
        </Card>
        <Card title="Sua linha do tempo" className={homePageStyle.timeline}>
          {posts.map((post, index) => (
            <Card key={index} title={post.title} subTitle={post.date} className={`${homePageStyle.postCard} p-mb-3`}>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </Card>
          ))}
        </Card>
        <Toast ref={toast} />
      </div>
    </div>
  );
}