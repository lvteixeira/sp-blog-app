import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router.js";
import MenubarCustom from "@/components/ui/Menubar.js"
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import PostagemService from "@/service/PostagemService.js";
import homePageStyle from "@/styles/homePageStyle.module.css";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";

export default function Homepage() {
  const postagemService = new PostagemService();
  const [userSessionId, setUserSessionId] = useState(null);
  const [content, setContent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editableContent, setEditableContent] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showEditar, setShowEditar] = useState(false);
  const toast = useRef();
  const effectRan = useRef(false);
  const router = useRouter();

  const fetchPosts = async () => {
    await postagemService.listAll()
      .then(res => {
        console.log(res);
        setPosts(res);
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro', life: 2600 });
      })
  };

  const editPost = (id) => {
    console.log("id do post a editar: " + id);
    postagemService.getById(id)
      .then(res => {
        setEditableContent(res.content);
        setSelectedPostId(id);
        setShowEditar(true);
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro ao obter postagem', life: 2600 });
      });
  }

  const savePost = async () => {
    let payload = {
      content: content,
    }

    content !== null && await postagemService.createPostagem(payload)
      .then(res => {
        toast.current.show({ severity: 'success', detail: 'Postagem criada com sucesso', life: 2600 });
        setContent('');
        fetchPosts();
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro ao criar postagem', life: 2600 });
      });
  };

  const saveEditedPost = async () => {
    console.log();
  }

  useEffect(() => {
    const currentSessionId = sessionStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      router.push('/signin');
    } else {
      setUserSessionId(currentSessionId);
    }

    if (effectRan.current == false) {
      fetchPosts();
    }

    return () => {
      effectRan.current = true;
    }
  }, []);

  const renderHeaderEditor = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const headerEditor = renderHeaderEditor();

  const headerPost = (post) => {
    return (
      <div className="flex justify-content-between align-items-center">
        <div className="flex align-items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" />
          <span className="font-bold">Amy Elsner</span>
        </div>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-plain"
          onClick={() => editPost(post.id)} tooltip="Editar" />
      </div>
    );
  };

  const hideEditar = () => {
    setEditableContent('');
    setSelectedPostId(null);
    setShowEditar(false);
  }

  return (
    <div>
      <MenubarCustom username={"Teste"} />
      <div className={homePageStyle.timelineContainer}>
        <Card title="Criar postagem" className={homePageStyle.postCard}>
          <Editor maxLength={200} value={content} headerTemplate={headerEditor} onTextChange={(e) => setContent(e.htmlValue)} style={{ height: '200px' }} />
          <Button label="Postar" icon="pi pi-check" className="p-mt-2" onClick={savePost} />
        </Card>
        <Card title="Sua linha do tempo" className={homePageStyle.timeline}>
          {posts.map((post, index) => (
            <Panel key={index} header={headerPost(post)} style={{ marginBottom: '2em' }}>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </Panel>
          ))}
        </Card>
        <Dialog header="Editar postagem" visible={showEditar} onHide={hideEditar}
          draggable={false} resizable={false} style={{ width: '500px', height: '400px' }}>
            <Editor value={editableContent} headerTemplate={headerEditor} onTextChange={(e) => setEditableContent(e.htmlValue)} style={{ height: '200px' }} />
            <Button label="Salvar" icon="pi pi-check" className="p-mt-2" onClick={saveEditedPost} />
        </Dialog>
        <Toast ref={toast} />
      </div>
    </div>
  );
}
