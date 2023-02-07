import React from "react";
import styled from "@emotion/styled";
import ColorList from "../../assets/ColorList";
import { BiBookmark, BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import defaultAccount from "../../assets/account_img_default.png";
import a from "../..//assets/test1.jpeg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./slick-theme.css";
import Flicking from "@egjs/react-flicking";
import "../../styles/flicking.css";
import { BsBookmark } from "react-icons/bs";
import { FiShare } from "react-icons/fi";

const DetailFeed = () => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    nextArrow: (
      <NextArrow>
        <span>
          <IoIosArrowForward />
        </span>
      </NextArrow>
    ),
    prevArrow: (
      <PrevArrow>
        <span>
          <IoIosArrowBack />
        </span>
      </PrevArrow>
    ),
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          <UserInfoBox>
            <UserImageBox>
              <UserImage src={a} alt="" />
            </UserImageBox>
            <UserWriteInfo>
              <UserName>test_test</UserName>
              <WriteDate>2일전</WriteDate>
            </UserWriteInfo>
            <FollowBtnBox>팔로우</FollowBtnBox>
          </UserInfoBox>
        </Header>
        <WearDetailBox>
          <WearDetail>
            <WearInfoBox>
              <WearInfoMain>해당 날씨</WearInfoMain>
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <WearInfo>
                    <TagBox>
                      <Tag>
                        <WeatherIcon>
                          <img
                            src={`http://openweathermap.org/img/wn/02d@2x.png`}
                            alt="weather icon"
                          />
                        </WeatherIcon>
                        약간의 구름이 낀 하늘
                      </Tag>
                    </TagBox>
                    <TagBox>
                      <Tag>4º</Tag>
                    </TagBox>
                    <TagBox>
                      <Tag>
                        4<span>m/s</span>
                      </Tag>
                    </TagBox>
                  </WearInfo>
                </Flicking>
              </FlickingBox>
            </WearInfoBox>
          </WearDetail>
          <WearDetail>
            <WearInfoBox>
              <WearInfoMain>현재 착장</WearInfoMain>
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <WearInfo>
                    <TagBox>
                      <Tag>😥 조금 더워요</Tag>
                    </TagBox>
                    <TagBox>
                      <Tag>긴팔</Tag>
                    </TagBox>
                    <TagBox>
                      <Tag>면바지</Tag>
                    </TagBox>
                  </WearInfo>
                </Flicking>
              </FlickingBox>
            </WearInfoBox>
          </WearDetail>
        </WearDetailBox>
        <Slider {...settings}>
          <Card>
            <CardImage src={a} alt="" />
          </Card>
          <Card>
            <CardImage src={a} alt="" />
          </Card>
        </Slider>
        <InfoBox>
          <TextBox>
            <UserReactBox>
              <IconBox>
                <Icon>
                  <FaRegHeart />
                </Icon>
                <Icon>
                  <FaRegBookmark />
                </Icon>
              </IconBox>
              <Icon>
                <FiShare />
              </Icon>
            </UserReactBox>
            <UserReactNum>공감 20개</UserReactNum>
            <UserTextBox>
              <UserId>test_test</UserId>
              <UserText>진짜 너무 더워여........</UserText>
            </UserTextBox>
          </TextBox>
        </InfoBox>
      </Container>
    </Wrapper>
  );
};

export default DetailFeed;
const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Wrapper = styled.main`
  position: relative;
  overflow: hidden;
  /* height: 100%; */
  /* width: 500px;
  margin: 0 auto; */
  padding: 20px;
  background: #ff5673;
`;

const Container = styled.main`
  border: 2px solid ${secondColor};
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 8px 8px 0px rgba(134, 25, 44, 0.4);
`;

const Header = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${thirdColor};
`;

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const UserImageBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${fourthColor};
  object-fit: cover;
  cursor: pointer;
`;

const UserWriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  color: ${thirdColor};
`;

const WriteDate = styled.span`
  font-size: 14px;
`;

const UserName = styled.div`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  letter-spacing: -0.15px;
  color: rgba(34, 34, 34, 0.8);
`;

const FollowBtnBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 10px 20px;
  /* width: 82px; */
  /* height: 30px; */
  color: #fff;
  border-radius: 9999px;
  background: #000;
  cursor: pointer;
`;

const UserImage = styled.img`
  image-rendering: auto;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Card = styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  border-bottom: 1px solid ${thirdColor};
`;

const CardImage = styled.img`
  object-fit: cover;
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: auto;
`;

const WearDetailBox = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  border-bottom: 2px solid ${secondColor};
`;

const WearDetail = styled.div`
  padding: 12px;
  display: flex;
  flex: 1;
  align-items: center;
  &:not(:last-of-type) {
    border-right: 1px solid ${thirdColor};
  }
`;

const WearInfoBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const WearInfoMain = styled.div`
  flex: 0 0 auto;
  user-select: text;
  color: ${thirdColor};
  /* min-width: 55px; */
  text-align: center;
  padding-right: 8px;
  margin-right: 8px;
  border-right: 1px solid ${thirdColor};
  font-size: 12px;
`;

const FlickingBox = styled.div`
  position: relative;

  /* &::before {
    left: 0px;
    background: linear-gradient(to right, #fafafa, rgba(255, 255, 255, 0));
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 120%;
    width: 14px;
    content: "";
  } */

  /* &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fafafa);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  } */
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  img {
    display: block;
    width: 100%;
  }
`;

const TagBox = styled.div`
  display: flex;
  /* user-select: none; */
  flex: nowrap;
  gap: 8px;
`;

const Tag = styled.div`
  font-size: 14px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  border: 1px solid ${thirdColor};
  border-radius: 4px;
  /* cursor: pointer; */
  /* background: ${mainColor}; */
`;

const InfoBox = styled.div`
  /* height: 300px; */
  padding: 12px;
  margin-top: -4px;
  /* border-bottom: 1px solid ${thirdColor}; */
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserReactBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -2px;
  margin-bottom: 14px;
`;

const UserReactNum = styled.p`
  font-size: 14px;
  /* color: ${thirdColor}; */
  margin-bottom: 12px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: ${thirdColor};
  svg {
    font-size: 24px;
  }
`;

const UserTextBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 30px;
  font-size: 16px;
  letter-spacing: -0.21px;
`;

const UserId = styled.p`
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
`;

const UserText = styled.span``;

const Arrow = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 50%;
  background-color: #fff;
  z-index: 10;
  transition: all 0.1s;
  color: #e74b7a;

  span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NextArrow = styled(Arrow)`
  right: 20px;

  span {
    svg {
      padding-left: 2px;
    }
  }
`;

const PrevArrow = styled(Arrow)`
  left: 20px;

  span {
    svg {
      padding-right: 2px;
    }
  }
`;
