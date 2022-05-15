import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import styles from './Auth.module.css';
import Modal from 'react-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import {
  fetchAsyncCreateProfile,
  fetchAsyncGetMyProfile,
  fetchAsyncGetProfiles,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchCredEnd,
  fetchCredStart,
  resetOpenSignIn,
  resetOpenSignUp,
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  setOpenSignUp,
} from './authSlice';

const customStyles = {
  overlay: {
    backgroundColor: '#777777',
  },
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 350,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
};
const Auth: React.FC = () => {
  Modal.setAppElement('#root');
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      {/* # Register Modal */}
      <Modal
        isOpen={openSignUp}
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: 'required' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart);
            const resultReg = await dispatch(fetchAsyncRegister(values));

            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(values));
              await dispatch(fetchAsyncCreateProfile({ nickName: 'anonymous' }));

              await dispatch(fetchAsyncGetProfiles());
              // await dispatch(fetchAsyncGetPosts());
              // await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProfile());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignUp());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('email format is wrong').required('email is required'),
            password: Yup.string().required('password is required').min(4),
          })}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isValid }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>SNS Clone</h1>
                  <br />
                  <div className={styles.auth_progress}>{isLoadingAuth && <CircularProgress />}</div>
                  <br />
                  <TextField
                    placeholder='email'
                    type='input'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <br />
                  {touched.email && errors.email ? <div className={styles.auth_error}>{errors.email}</div> : null}

                  <TextField
                    placeholder='password'
                    type='password'
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <br />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />
                  <Button variant='contained' color='primary' disabled={!isValid} type='submit'>
                    Register
                  </Button>
                  <br />
                  <br />
                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(setOpenSignIn());
                      await dispatch(resetOpenSignUp());
                    }}
                  >
                    You already have an account?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>
      {/* # Login Modal */}
      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: 'required' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart);
            const result = await dispatch(fetchAsyncLogin(values));

            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetProfiles());
              // await dispatch(fetchAsyncGetPosts());
              // await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProfile());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignIn());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('email format is wrong').required('email is required'),
            password: Yup.string().required('password is required').min(4),
          })}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isValid }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>SNS Clone</h1>
                  <br />
                  <div className={styles.auth_progress}>{isLoadingAuth && <CircularProgress />}</div>
                  <br />
                  <TextField
                    placeholder='email'
                    type='input'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <br />
                  {touched.email && errors.email ? <div className={styles.auth_error}>{errors.email}</div> : null}

                  <TextField
                    placeholder='password'
                    type='password'
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <br />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />
                  <Button variant='contained' color='primary' disabled={!isValid} type='submit'>
                    Login
                  </Button>
                  <br />
                  <br />
                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(resetOpenSignIn());
                      await dispatch(setOpenSignUp());
                    }}
                  >
                    You don't have an account?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Auth;
