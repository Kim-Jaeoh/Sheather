import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
// import { setCurrentUser, setLoginToken } from "../../reducer/user";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { authService, dbService } from "../../../fbase";
import { currentUser, loginToken } from "../../../app/user";
// import { useModalScrollFixed } from "../../hooks/useModalScrollFixed";

type Props = {
  modalOpen: boolean;
  modalClose: () => void;
};

const AuthFormModal = ({ modalOpen, modalClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [select, setSelect] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleAccount = () => setNewAccount(!newAccount);

  // const modalFixed = useModalScrollFixed(signModal); // 모달 스크롤 픽스

  // const reloadState = useCallback(() => {
  //   toggleSignModal();
  //   toggleModal();
  //   navigate(0);
  // }, [navigate, toggleModal, toggleSignModal]);

  const SignUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let user;

      if (newAccount) {
        await signInWithEmailAndPassword(authService, email, password).then(
          async (result) => {
            let SignUser = result.user;
            const docRef = doc(dbService, "users", SignUser.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              dispatch(loginToken(true));
              dispatch(
                currentUser({
                  ...docSnap.data(),
                })
              );
            }
          }
        );
        alert("로그인 되었습니다.");
        modalClose();
        // reloadState();
      } else {
        await createUserWithEmailAndPassword(authService, email, password).then(
          async (result) => {
            user = result.user;
            const usersRef = collection(dbService, "users");
            await setDoc(doc(usersRef, user.email), {
              uid: user.uid,
              createdAt: Date.now(),
              profileURL: "",
              email: user.email,
              displayName: user.email.split("@")[0],
              description: "",
              follower: [],
              following: [],
            });

            // dispatch(loginToken("login"));
            dispatch(
              currentUser({
                uid: user.uid,
                createdAt: Date.now(),
                profileURL: "",
                email: user.email,
                displayName: user.email.split("@")[0],
                description: "",
                follower: [],
                following: [],
              })
            );

            alert("회원가입 되었습니다.");
            setNewAccount(true);
            setEmail("");
            setPassword("");
            setError("");
            // reloadState();
          }
        );
      }
    } catch (error: any) {
      if (error.message.includes("(auth/email-already-in-use).")) {
        setError(
          error.message.replace(
            "Firebase: Error (auth/email-already-in-use).",
            "이미 가입이 되어있는 이메일입니다."
          )
        );
      } else if (error.message.includes("(auth/weak-password)")) {
        setError(
          error.message.replace(
            "Firebase: Password should be at least 6 characters (auth/weak-password).",
            "비밀번호를 최소 6글자 이상 입력해주세요."
          )
        );
      } else if (error.message.includes("(auth/wrong-password).")) {
        setError(
          error.message.replace(
            "Firebase: Error (auth/wrong-password).",
            "이메일이나 비밀번호가 틀립니다."
          )
        );
      } else if (error.message.includes("(auth/too-many-requests)")) {
        setError(
          error.message.replace(
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).",
            "로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 비밀번호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다."
          )
        );
      } else if (error.message.includes("(auth/user-not-found)")) {
        setError(
          error.message.replace(
            "Firebase: Error (auth/user-not-found).",
            "가입된 아이디를 찾을 수 없습니다."
          )
        );
      } else {
        setError(error.message);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <Modal open={modalOpen} onClose={modalClose} disableScrollLock={true}>
      <Wrapper>
        <Container>
          <LogoBox>
            {/* <Logo src={KakaoLogo} alt="kakao" loading="lazy" /> */}
          </LogoBox>
          <ListDelete onClick={modalClose}>
            <IoCloseOutline />
          </ListDelete>
          <FormBox>
            <form onSubmit={SignUser}>
              <EmailBox>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={onChange}
                  // select={select}
                  autoComplete="off"
                  onFocus={() => setSelect("email")}
                  onBlur={() => setSelect("")}
                />
              </EmailBox>
              <PasswordBox>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={onChange}
                  // select={select}
                  autoComplete="off"
                  onFocus={() => setSelect("password")}
                  onBlur={() => setSelect("")}
                />
              </PasswordBox>
              <SignBtnBox>
                <SignBtn>{newAccount ? "로그인" : "회원가입"}</SignBtn>
              </SignBtnBox>
              {error && <ErrorText>{error}</ErrorText>}
              <SignInfo>
                <SignUp onClick={toggleAccount}>
                  {newAccount ? "회원가입" : "로그인"}
                </SignUp>
                <AccountBox>
                  <AccountFind>계정 찾기</AccountFind>
                  <AccountFind>비밀번호 찾기</AccountFind>
                </AccountBox>
              </SignInfo>
            </form>
          </FormBox>
        </Container>
      </Wrapper>
    </Modal>
  );
};

export default AuthFormModal;

const Wrapper = styled.div`
  overflow-y: scroll;
  -ms-overflow-style: none; // 인터넷 익스플로러
  scrollbar-width: none; // 파이어폭스

  ::-webkit-scrollbar {
    display: none;
  }

  outline: none;
  font-size: 14px;
  line-height: 1.5;
  font-family: Inter, Spoqa Han Sans Neo, Apple SD Gothic Neo, Malgun Gothic,
    \b9d1\c740\ace0\b515, sans-serif;
  color: #000;
  letter-spacing: -0.015em;

  a {
    color: #000;
    text-decoration: none;
  }
`;

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  /* height: 500px; */
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  text-align: center;
  /* padding-bottom: 24px; */

  @media screen and (min-width: 640px) {
    width: 500px;
  }
`;

const LogoBox = styled.div`
  width: 70px;
  height: 30px;
  margin: 0 auto;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 24px;
`;

const Logo = styled.img`
  display: block;
  width: 100%;
`;

const FormBox = styled.article`
  position: relative;
  width: 90%;
  margin: 24px auto;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 12px;

  form {
    padding: 50px 50px;
  }
`;

const EmailBox = styled.div`
  position: relative;
  margin-bottom: 3px;
  border: solid #ccc;
  border-width: 0 0 2px;

  input {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 45px;
    padding: 10px 0 8px;
    border: 0;
    font-size: 18px;
    line-height: 25px;
    color: #191919;
    background-color: transparent;
    box-sizing: border-box;
    outline: 0 none;
    caret-color: #191919;
    opacity: 0.4;
  }
`;

const PasswordBox = styled(EmailBox)``;

const SignBtnBox = styled.div`
  padding-top: 40px;
  text-align: center;
`;

const SignBtn = styled.button`
  cursor: pointer;
  background-color: #fee500;
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 4px;
  font-weight: 400;
  font-size: 16px;
  line-height: 51px;
  color: #191919;
`;

const SignInfo = styled.div`
  margin-top: 26px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
`;
const SignUp = styled.p`
  cursor: pointer;
`;

const AccountBox = styled.ul`
  display: flex;
`;

const AccountFind = styled.li`
  cursor: pointer;
  &:first-of-type {
    ::after {
      content: "";
      float: right;
      width: 1px;
      height: 10px;
      margin: 4px 10px;
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const ErrorText = styled.p`
  display: block;
  /* max-width: 400px; */
  text-align: center;
  font-size: 12px;
  color: rgb(235, 0, 0);
  letter-spacing: -0.5px;
  padding: 24px 0 0;
  /* margin: 24px 0 24px; */
`;

const ListDelete = styled.button`
  position: absolute;
  z-index: 10;
  padding: 9px;
  top: 0px;
  right: 0px;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #bdbdbd;
  }
`;
