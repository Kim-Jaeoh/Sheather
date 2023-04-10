import styled from "@emotion/styled";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import { authService } from "../../../fbase";

type Props = {};

const FindPassword = (props: Props) => {
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(authService, email);
      toast.success("비밀번호 재설정 이메일이 전송되었습니다.");
    } catch (error) {
      // 비밀번호 찾기 실패 시, 오류 처리
      console.error(error);
    }
  };

  return <Container>FindPassword</Container>;
};

export default FindPassword;

const Container = styled.div`
  width: 100px;
  height: 100px;
`;
