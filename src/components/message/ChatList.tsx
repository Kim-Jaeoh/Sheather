import styled from "@emotion/styled";
import ColorList from "../../assets/data/ColorList";
import { CurrentUserType, MessageReadType } from "../../types/type";
import { onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { dbService } from "../../fbase";
import { useNavigate } from "react-router-dom";
import useCreateChat from "../../hooks/useCreateChat";

type Props = {
  data: MessageReadType;
  onListClick: (userName: string) => void;
};

const ChatList = ({ data, onListClick }: Props) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!data) return;
    const unsubscribe = onSnapshot(
      doc(dbService, "users", data?.user),
      (doc) => {
        setUsers(doc.data());
      }
    );
    return () => unsubscribe();
  }, [data]);

  return (
    <User onClick={() => onListClick(users.displayName)}>
      <ProfileImageBox>
        <ProfileImage
          onContextMenu={(e) => e.preventDefault()}
          src={users?.profileURL}
          alt="profile image"
        />
      </ProfileImageBox>
      <ProfileInfoBox>
        <ProfileDsName>{users?.displayName}</ProfileDsName>
        <ProfileName>{users?.name}</ProfileName>
      </ProfileInfoBox>
      {!data.isRead && data.user === users?.displayName && <NoticeBox />}
    </User>
  );
};

export default ChatList;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 14px 16px;
  height: 100%;
  transition: all 0.15s linear;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #f5f5f5;
  }
`;

const ProfileImageBox = styled.div`
  width: 42px;
  height: 42px;
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

const ProfileInfoBox = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
`;

const ProfileDsName = styled.p`
  font-size: 14px;
  font-weight: 500;
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileName = styled.p`
  font-size: 12px;
  color: ${thirdColor};
  width: 120px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoticeBox = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5c1b;
`;
