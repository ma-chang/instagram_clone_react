import React, { useEffect } from 'react';
import Auth from '../auth/Auth';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';

import styles from './Core.module.css';
import { withStyles } from '@material-ui/styles';
import { Avatar, Badge, Button, CircularProgress, Grid } from '@material-ui/core';
import { MdAddAPhoto } from 'react-icons/md';

import {
  editNickname,
  resetOpenProfile,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  selectIsLoadingAuth,
  selectProfile,
  setOpenProfile,
  fetchAsyncGetMyProfile,
  fetchAsyncGetProfiles,
} from '../auth/authSlice';

import {
  resetOpenNewPost,
  selectIsLoadingPost,
  selectPosts,
  setOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from '../post/postSlice';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

// const SmallAvatar = withStyles((theme) => ({
//   root: {
//     width: 22,
//     height: 22,
//     border: `2px solid ${theme.palette.background.paper}`,
//   },
// }))(Avatar);

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     '& > *': {
//       margin: theme.spacing(1),
//     },
//   },
// }));

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const isLoadingPost = useSelector(selectIsLoadingPost);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProfile());
        if (fetchAsyncGetMyProfile.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfiles());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);
  return (
    <div>
      <Auth />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>SNS Clone</h1>
        {profile?.nickName ? (
          <>
            <Button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(setOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </Button>
            <div className='core_logout'>
              <Button
                onClick={() => {
                  localStorage.removeItem('localJWT');
                  dispatch(editNickname(''));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Core;
