import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import styled from "@emotion/styled";
import moment from "moment";
import ColorList from "../../assets/ColorList";
import { Link } from "react-router-dom";

const MessageList = () => {
  const { loginToken: userLogin, currentUser: userObj } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  return (
    <Conatiner>
      <User>
        <ProfileImageBox>
          <ProfileImage src={``} alt="profile image" />
        </ProfileImageBox>
        <SendMessageBox>
          <SendMessage>안뇽</SendMessage>
        </SendMessageBox>
      </User>
      <User style={{ flexDirection: `row-reverse` }}>
        <ProfileImageBox>
          <ProfileImage src={``} alt="profile image" />
        </ProfileImageBox>
        <SendMessageBox>
          <SendMessage>안뇽뇨오오오오ㅗ옹</SendMessage>
        </SendMessageBox>
        <SeneMessageAt>{moment(Date.now()).format(`HH:mm`)}</SeneMessageAt>
      </User>
    </Conatiner>
  );
};

export default MessageList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Conatiner = styled.div`
  flex: 1;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

const User = styled.div`
  display: block;
  margin: 0;
  transition: all 0.15s linear;
  /* gap: 12px; */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const ProfileImageBox = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid ${fourthColor};
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`;

const SendMessageBox = styled.div`
  margin: 0 10px;
`;

const SendMessage = styled.p`
  padding: 8px 12px;
  border: 1px solid ${thirdColor};
  border-radius: 20px;
  max-width: 230px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.2;
`;

const SeneMessageAt = styled.span`
  font-size: 12px;
  color: ${thirdColor};
  /* margin-left: 0 8px; */
`;
