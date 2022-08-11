import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';

import styles from './Core.module.css';
import { File } from '../types';

import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from '../post/postSlice';

import { Button, TextField, IconButton } from '@material-ui/core';
import { MdAddAPhoto } from 'react-icons/md';

const customStyles = {
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 220,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
};

const NewPost: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openNewPost = useSelector(selectOpenNewPost);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handlerEditPicture = async () => {
    const fileInput = document.getElementById('imageInput');
    return fileInput?.click();
  };

  const handlerImageSrc = async (data: File) => {
    // const imageSrc = data.name;
    return console.log(data);
  };
  const handlerImageName = async (data: File) => {
    const imageTitle = data.name;
    const imageTitleInsertTag = document.getElementById('uploadPostImageName');
    if (imageTitleInsertTag === null) {
      return;
    } else {
      imageTitleInsertTag.append(imageTitle);
    }
  };

  const newPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { title: title, img: image };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    await dispatch(resetOpenNewPost());
  };

  return (
    <>
      <ReactModal
        isOpen={openNewPost}
        onRequestClose={async () => {
          await dispatch(resetOpenNewPost());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS clone</h1>
          <br />
          <TextField placeholder='Please enter caption' type='text' onChange={(e) => setTitle(e.target.value)} />
          <input
            type='file'
            id='imageInput'
            hidden={true}
            onChange={(e) => {
              const data = e.target.files![0];
              handlerImageName(data);
              setImage(data);
            }}
          />
          <br />
          {/* <img id='uploadImage' className={styles.uploadImageName} /> */}
          <IconButton onClick={handlerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <span id='uploadPostImageName' className={styles.uploadImageName}></span>
          <br />
          <Button disabled={!title || !image} variant='contained' color='primary' onClick={newPost}>
            New Post
          </Button>
        </form>
      </ReactModal>
    </>
  );
};

export default NewPost;
