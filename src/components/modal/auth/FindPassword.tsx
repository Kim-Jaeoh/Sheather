import styled from "@emotion/styled";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import { authService } from "../../../fbase";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import ColorList from "../../../assets/data/ColorList";
import Deco from "../../leftBar/Deco";
import { ReactComponent as SheatherLogo } from "../../../assets/image/sheather_logo.svg";

type Props = { isMobile: boolean };

const FindPassword = ({ isMobile }: Props) => {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(false);
  const [select, setSelect] = useState({
    email: false,
    password: false,
    dpName: false,
  });

  useEffect(() => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!emailRegex.test(email)) {
      setEmailMessage(false);
    } else {
      setEmailMessage(true);
    }
  }, [email]);

  const sendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(authService, email);
      toast.success("비밀번호 재설정 이메일이 전송되었습니다.");
    } catch (error) {
      // 비밀번호 찾기 실패 시, 오류 처리
      console.error(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    }
  };

  const error = () => {
    if (email.length > 0 && select.email && !emailMessage) {
      return "사용할 수 없는 이메일 주소입니다.";
    }
  };

  return (
    <Container>
      <>
        {isMobile && (
          <LogoBox>
            <Deco />
            <SheatherLogo width="230px" height="100px" />
          </LogoBox>
        )}
      </>
      <Form onSubmit={sendPasswordReset} method="post">
        <EmailBox>
          <Input
            spellCheck="false"
            name="email"
            type="email"
            placeholder="이메일 주소"
            // required
            value={email}
            onChange={onChange}
            autoComplete="off"
            onFocus={() => setSelect((prev) => ({ ...prev, email: false }))}
            onBlur={() => setSelect((prev) => ({ ...prev, email: true }))}
          />
          {email.length > 0 && (
            <InputCheckBox check={emailMessage}>
              {emailMessage ? (
                <IoCheckmarkCircleOutline />
              ) : (
                <IoCloseCircleOutline />
              )}
            </InputCheckBox>
          )}
        </EmailBox>
        {!emailMessage && email !== "" && error() !== "" && (
          <ErrorText>{error()}</ErrorText>
        )}
        <SignBtnBox>
          <SignBtn type="submit" disabled={email === "" || !emailMessage}>
            로그인 링크 보내기
          </SignBtn>
        </SignBtnBox>
      </Form>
    </Container>
  );
};

export default FindPassword;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div``;

const LogoBox = styled.div``;

const Form = styled.form``;

const EmailBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  width: 100%;
  border-radius: 10px;
  /* padding: 0 12px; */
  border: 1px solid ${thirdColor};
`;

const PasswordBox = styled(EmailBox)``;

const Input = styled.input`
  width: 100%;
  padding: 20px;
  font-size: 16px;
  color: ${secondColor};
  text-overflow: ellipsis;
  white-space: pre-wrap;
  background-color: transparent;
  box-sizing: border-box;
  border: none;
  outline: none;
  transition: all 0.1s linear;
  opacity: 1;
  margin: 0;

  &::placeholder {
    font-size: 12px;
  }

  &:focus::placeholder {
    opacity: 0.4;
    color: ${thirdColor};
    transition: all 0.2s;
  }
`;

const InputCheckBox = styled.div<{ check?: boolean }>`
  width: 48px;
  height: 48px;
  /* margin-right: -12px; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.check ? `rgb(111, 76, 207,0.8)` : `rgba(255, 0, 0, 0.8)`};
  svg {
    font-size: 24px;
  }
`;

const SignBtnBox = styled.div`
  padding-top: 40px;
  text-align: center;
`;

const SignBtn = styled.button`
  cursor: pointer;
  background-color: #6f4ccf;
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  padding: 0;
  font-size: 16px;
  color: #fff;
  transition: all 0.12s linear;

  &:disabled {
    background: #9489b3;
    cursor: default;
  }
`;

const ErrorText = styled.p`
  display: block;
  text-align: center;
  font-size: 12px;
  color: rgb(235, 0, 0);
  letter-spacing: -0.5px;
  margin-top: 24px;
  /* margin: 24px 0 24px; */
`;
