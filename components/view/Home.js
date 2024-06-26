import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import MenubarCustom from "@/components/ui/Menubar"
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { AvatarGenerator } from 'random-avatar-generator';
import PostagemService from "@/service/PostagemService";
import homePageStyle from "@/styles/homePageStyle.module.css";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";

export default function Homepage() {
  const avatarGenerator = useRef(new AvatarGenerator());
  const postagemService = useRef(new PostagemService());
  const [userSessionId, setUserSessionId] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isAvatarDefined, setIsAvatarDefined] = useState(false);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editableContent, setEditableContent] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showEditar, setShowEditar] = useState(false);
  const [edited, setEdited] = useState(false);
  const toast = useRef();
  const effectRan = useRef(false);
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await postagemService.current.listAll();
      setPosts(res);
    } catch (error) {
      toast.current.show({ severity: 'error', detail: 'Erro', life: 2600 });
    }
  }, []);

  const editPost = (id) => {
    postagemService.current.getById(id)
      .then(res => {
        setEditableContent(res.content);
        setSelectedPostId(id);
        setShowEditar(true);
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro ao obter postagem', life: 2600 });
      });
  }

  const savePost = () => {
    if(content) {
      postagemService.current.createPostagem({ content: content, userId: userSessionId })
        .then(res => {
          toast.current.show({ severity: 'success', detail: 'Postagem criada com sucesso', life: 2600 });
          setContent('');
          fetchPosts();
        })
        .catch(error => {
          toast.current.show({ severity: 'error', detail: 'Erro ao criar postagem', life: 2600 });
        });
    }
  };

  const saveEditedPost = () => {
    if(editableContent && selectedPostId) {
      postagemService.current.updatePostagem({ content: editableContent }, selectedPostId)
        .then(res => {
          toast.current.show({ severity: 'success', detail: 'Postagem editada com sucesso', life: 2600 });
          setEditableContent('');
          setSelectedPostId(null);
          setShowEditar(false);
          setEdited(true);
          fetchPosts();
        })
        .catch(error => {
          toast.current.show({ severity: 'error', detail: 'Erro ao editar postagem', life: 2600 });
          setEditableContent('');
          setSelectedPostId(null);
          setShowEditar(false);
        });
    }
  };

  const deletePost = (id) => {
    postagemService.current.deletePostagem(id)
      .then(res => {
        toast.current.show({ severity: 'success', detail: 'Postagem excluída com sucesso', life: 2600 });
        fetchPosts();
      })
      .catch(error => {
        toast.current.show({ severity: 'error', detail: 'Erro ao excluir postagem', life: 2600 });
      });
  }

  const curtirPostagem = (postId) => {
    postagemService.current.curtirPostagem(postId, userSessionId)
      .then(res => {
        fetchPosts();
      })
      .catch(error => {
        console.info(error);
      });
  }

  const renderHeaderEditor = () => {
    return(
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const headerEditor = renderHeaderEditor();

  const headerPost = (post) => {    
    return(
      <div className="flex justify-content-between align-items-center">
        <div className="flex align-items-center gap-2">
          <Avatar image={avatar} size="large" shape="circle" />
          {post.username ? <span className="font-bold">@{post.username}</span> : <span className="font-bold">@username</span>}
        </div>
      </div>
    );
  };

  const footerPost = (post) => {
    const isLiked = post.curtidas && post.curtidas.includes(Number(userSessionId));
    return(
      <div className="grid w-full">
        <div className="col-11">
          {post.edited && <span className="font-semibold" style={{ fontSize: '0.8em' }}>editado</span>}
        </div>
        <div className="col-1 items-right">
          <Button
            size="large" 
            icon={isLiked ? "pi pi-heart-fill" : "pi pi-heart"}
            className={isLiked ? "p-button-rounded p-button-text p-button-danger" : "p-button-rounded p-button-text p-button-plain"}
            tooltip="Curtir"
            onClick={() => curtirPostagem(post.id)} />
        </div>
      </div>
    )
  }

  const iconsPost = (post) => {
    return(
      <>
        {(post.userId).toString() === userSessionId && <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-plain"
          onClick={() => editPost(post.id)} tooltip="Editar" />}
        {(post.userId).toString() === userSessionId && <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-plain"
          onClick={() => deletePost(post.id)} tooltip="Deletar" />}      
      </>
    )
  }

  const hideEditar = () => {
    setEditableContent('');
    setSelectedPostId(null);
    setShowEditar(false);
  }

  useEffect(() => {
    const currentSessionId = sessionStorage.getItem('currentSessionId');
    const thisUsername = sessionStorage.getItem('username');

    if(!currentSessionId && !username) {
      router.push('/signin');
    } else {
      setUserSessionId(currentSessionId);
      setUsername(thisUsername);
    }

    if(!effectRan.current) {
      fetchPosts();
      effectRan.current = true;
    }
  }, [fetchPosts, router]);

  useEffect(() => {
    !isAvatarDefined && setAvatar(avatarGenerator.current.generateRandomAvatar());
  }, [])

  return(
    <div>
      <MenubarCustom avatar={avatar} username={username} />
      <div className={homePageStyle.timelineContainer}>
        <Card title="Criar postagem" className={homePageStyle.postCard}>
          <Editor maxLength={200} value={content} placeholder="No que você está pensando?" headerTemplate={headerEditor} onTextChange={(e) => setContent(e.htmlValue)} style={{ height: '200px' }} />
          <div className={homePageStyle.buttonContainer}>
            <Button label="Postar" iconPos="right" icon="pi pi-check" onClick={savePost} />
          </div>          
        </Card>
        <Card title="Sua linha do tempo" className={homePageStyle.timeline}>
          {posts.map((post, index) => (
            <Panel key={index} icons={iconsPost(post)} header={headerPost(post)} footer={footerPost(post)} style={{ marginBottom: '2em' }}>
              <div className={homePageStyle.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
            </Panel>
          ))}
        </Card>
        <Dialog header="Editar postagem" visible={showEditar} onHide={hideEditar}
          blockScroll={true} draggable={false} resizable={false} style={{ width: '550px', height: '430px' }}>
          <Editor maxLength={200} value={editableContent} headerTemplate={headerEditor} onTextChange={(e) => setEditableContent(e.htmlValue)} style={{ height: '200px' }} />
          <div className={homePageStyle.buttonContainer}>
            <Button label="Editar" iconPos="right" icon="pi pi-check" onClick={saveEditedPost} />
          </div>
        </Dialog>
        <Toast ref={toast} />
      </div>
    </div>
  );
}