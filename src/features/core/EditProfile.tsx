import React, { useState } from 'react';
import ReactModal from 'react-modal';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';

import { File } from '../types';

import {
  resetOpenProfile,
  editNickname,
  selectProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProfile,
} from '../auth/authSlice';
import styles from './Core.module.css';

import { Button, IconButton, TextField } from '@material-ui/core';
import { MdAddAPhoto } from 'react-icons/md';
import { selectOpenProfile } from '../auth/authSlice';

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

const EditProfile: React.FC = () => {
  const dispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectProfile);
  const [image, setImage] = useState<File | null>(null);

  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    return fileInput?.click();
  };
  const handlerPictureName = async (data: File) => {
    const imageTitle = data.name;
    const imageTitleInsertTag = document.getElementById('uploadUserImageName');
    if (imageTitleInsertTag === null) {
      return;
    } else {
      imageTitleInsertTag.append(imageTitle);
    }
  };

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { id: profile.id, nickName: profile.nickName, img: image };
    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProfile(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };
  return (
    <>
      {}
      <ReactModal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS clone</h1>
          <br />
          <TextField
            placeholder='nickname'
            type='text'
            value={profile?.nickName}
            onChange={(e) => editNickname(e.target.value)}
          />
          <input
            type='file'
            id='imageInput'
            hidden={true}
            onChange={(e) => {
              e.preventDefault();
              const data = e.target.files![0];
              handlerPictureName(data);
              setImage(data);
            }}
          />
          <br />
          <IconButton onClick={handlerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <span id='uploadUserImageName' className={styles.uploadImageName}></span>
          <br />
          <Button
            disabled={!profile?.nickName}
            variant='contained'
            color='primary'
            type='submit'
            onClick={updateProfile}
          >
            Update
          </Button>
        </form>
      </ReactModal>
    </>
  );
};

export default EditProfile;
