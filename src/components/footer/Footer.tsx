import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as SheatherLogoWhite } from "../../assets/image/sheather_logo_w.svg";
import VelogLogo from "../../assets/image/velog_logo.png";
import { AiOutlineGithub } from "react-icons/ai";

type Props = {};

const Footer = (props: Props) => {
  const onClick = (type: string) => {
    if (type === "github") {
      return window.open("https://github.com/Kim-Jaeoh", "_blank");
    } else {
      return window.open("https://velog.io/@rlawodh123", "_blank");
    }
  };

  return (
    <Container>
      <Box>
        <LogoBox onContextMenu={(e) => e.preventDefault()}>
          <SheatherLogoWhite width="100%" height="100%" />
        </LogoBox>
        <InfoBox>
          <Text>Copyright 2023. jjjjjaeoh All rights reserved.</Text>
          <SnsBox>
            <Sns onClick={() => onClick("github")}>
              <AiOutlineGithub />
            </Sns>
            <SnsLogoImage onClick={() => onClick("velog")}>
              <img src={VelogLogo} alt="" />
            </SnsLogoImage>
          </SnsBox>
        </InfoBox>
      </Box>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  overflow: hidden;
  border-bottom: 2px solid #222222;
  border-left: 2px solid #222222;
  border-right: 2px solid #222222;
  background: #222;
  user-select: none;
`;

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: 80px;
  overflow: hidden;
  margin-top: 2px;
  -webkit-user-drag: none;

  svg {
    g {
      opacity: 0.4;
      fill: #fff;
    }
    path {
    }
  }
  @media (min-width: 768px) and (max-width: 1059px) {
  }
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  opacity: 0.4;
`;

const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin-right: 20px;
`;

const SnsBox = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Sns = styled.div`
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;

    g {
      fill: #fff;
    }
  }

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SnsLogoImage = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
    filter: saturate(0%);
  }
`;
