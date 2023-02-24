import { auth } from '../../api/firebase';
import 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LOGINCHECK } from '../Store/module/user';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { msg, user } from '../../constants/mapConstants';
import { useRouter } from 'next/dist/client/router';
import getAccessToken from '../../api/main';
import newStore from '../Store/module';
import loginBtntheme from '../../styles/LoginButton';
import { ThemeProvider, Button } from '@mui/material';
import { deactive } from '../Store/module/globalmodal';

export const SigninGoogle = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  //로그인 시 dispatch,페이로드로 이메일 전달
  const login = (email: string) => dispatch(LOGINCHECK(email));

  const handleLogin = async () => {
    if (newStore.getState().persist.user.email !== '') {
      const email = newStore.getState().persist.user.email;
      const password = 'google';
      getAccessToken({ username: '', email, password });
      login(email);
      router.reload();
    }

    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider)
      .then((res) => {
        if (res.user.email && res.user.displayName) {
          login(res.user.email);
          const username = res.user.displayName;
          const email = res.user.email;
          const password = 'google';
          getAccessToken({ username, email, password });
          sessionStorage.setItem(user.userimgURL, res.user.photoURL as string);
        }
        swal(msg.loginsuccess, msg.loginsuccessBody, 'success');
        dispatch(deactive());
        router.reload();
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <>
      <ThemeProvider theme={loginBtntheme}>
        <Button
          variant="text"
          color="inherit"
          onClick={() => {
            handleLogin();
            router.replace('/');
          }}
        ></Button>
      </ThemeProvider>
    </>
  );
};
