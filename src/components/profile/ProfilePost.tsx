import styled from "@emotion/styled";
import { Link, useLocation, useParams } from "react-router-dom";
import { FeedType } from "../../types/type";

type props = {
  myPost: FeedType[];
};

const ProfilePost = ({ myPost }: props) => {
  // const param = useParams();
  const { pathname } = useLocation();

  return (
    <>
      {myPost?.map((res, index) => {
        return (
          <Card key={res.id}>
            <Link to={"/profile/detail"} state={res.id}>
              {/* <WeatherEmojiBox>
              <WeatherEmoji>{res.feel}</WeatherEmoji>
            </WeatherEmojiBox> */}
              {res.url.length > 1 && (
                <CardLengthBox>
                  <CardLength>+{res.url.length}</CardLength>
                </CardLengthBox>
              )}
              <CardImage src={res.url[0]} alt="upload Image" />
            </Link>
          </Card>
        );
      })}
    </>
  );
};

export default ProfilePost;

const Card = styled.li`
  cursor: pointer;
  border-radius: 8px;
  display: block;
  /* flex: auto; */
  width: 180px;
  height: 180px;
  max-height: 100%;
  position: relative;
  border: 1px solid #eee;
  /* width: 33%; */
  /* height: 33%; */
  /* width: 180px; */
  overflow: hidden;
`;

const WeatherEmojiBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
  background-color: rgba(34, 34, 34, 0.4);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const WeatherEmoji = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardLengthBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  background-color: rgba(34, 34, 34, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const CardLength = styled.span`
  display: inline-block;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
