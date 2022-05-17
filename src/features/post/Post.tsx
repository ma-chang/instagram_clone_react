import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Divider, Checkbox } from '@material-ui/core';
import { CommentTwoTone, Favorite, FavoriteBorder } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';

import { selectProfiles } from '../auth/authSlice';
import {
  fetchPostEnd,
  fetchPostStart,
  selectComments,
  fetchAsyncPostComments,
  fetchAsyncPatchLiked,
} from './postSlice';

import styles from './Post.module.css';

import { PROPS_POST } from '../types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Post: React.FC<PROPS_POST> = ({ postId, loginId, userPost, title, imageUrl, liked }) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [text, setText] = useState('');

  const commentsOnPost = comments.filter((comment) => {
    return comment.post === postId;
  });

  const profile = profiles.filter((profile) => {
    return profile.userProfile === userPost;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComments(packet));
    await dispatch(fetchPostEnd());
    setText('');
  };

  const handlerLiked = async () => {
    const packet = {
      id: postId,
      title: title,
      current: liked,
      new: loginId,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    await dispatch(fetchPostEnd());
  };

  if (title) {
    return (
      <div className={styles.post}>
        <div className={styles.post_header}>
          <Avatar className={styles.post_avatar} src={profile[0]?.img} />
          <h3>{profile[0]?.nickName}</h3>
        </div>
        <img src={imageUrl} className={styles.post_image} />
        <h4 className={styles.post_text}>
          <Checkbox
            className={styles.post_checkBox}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={liked.some((like) => like === loginId)}
            onChange={handlerLiked}
          />
          <strong>{profile[0]?.nickName}</strong> {title}
          <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                className={styles.post_avatarGroup}
                key={like}
                src={profiles.find((profile) => profile.userProfile === like)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>
        <Divider />
        <div className={styles.post_comments}>
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className={styles.post_comment}>
              <Avatar
                src={profiles.find((profile) => profile.userProfile === comment.userComment)?.img}
                className={classes.small}
              />
              <p>
                <strong className={styles.post_strong}>
                  {profiles.find((profile) => profile.userProfile === comment.userComment)?.nickName}
                </strong>{' '}
                {comment.text}
              </p>
            </div>
          ))}
        </div>
        <form className={styles.post_commentBox}>
          <input
            type='text'
            className={styles.post_input}
            placeholder='add a comment'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type='submit' disabled={!text.length} className={styles.post_button} onClick={postComment}>
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};

export default Post;
