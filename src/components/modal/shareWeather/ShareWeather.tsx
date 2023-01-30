import { Modal } from "@mui/material";
import styled from "@emotion/styled";
import { ResDataType } from "../../slider/SlickSlider";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useHandleResizeTextArea } from "../../../hooks/useHandleResizeTextArea";
import ShareWeatherForm from "./ShareWeatherForm";
import toast, { Toaster } from "react-hot-toast";
import useTagCurrentWear from "../../../hooks/useTagCurrentWear";
import useTagRecommendWear from "../../../hooks/useTagRecommendWear";
import ColorList from "../../../assets/ColorList";

type Props = {
  shareBtn: boolean;
  shareBtnClick: () => void;
};

const ShareWeather = ({ shareBtn, shareBtnClick }: Props) => {
  const shareWeatherData = useSelector((state: RootState) => {
    return state.weather;
  });

  console.log(shareWeatherData);

  const {
    currentNewTag,
    currentTags,
    onChangeCurrent,
    onKeyPressCurrent,
    onDeleteCurrentTag,
    onDeleteCurrentText,
  } = useTagCurrentWear();

  const {
    RecommendNewTag,
    RecommendTags,
    onChangeRecommend,
    onkeyPressRecommend,
    onDeleteRecommendTag,
    onDeleteRecommendText,
  } = useTagRecommendWear();

  const onBlur = () => {
    if (currentNewTag !== "" || RecommendNewTag !== "") {
      toast.error("입력 후 엔터나 스페이스바를 눌러주세요.");
    }
  };

  const DateBox = styled.div`
    border: 1px solid ${mainColor};
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    font-size: 14px;
    font-weight: bold;
    color: ${mainColor};
    letter-spacing: -0.8px;
  `;

  return (
    <Modal open={shareBtn} onClose={shareBtnClick} disableScrollLock={false}>
      <>
        <Toaster position="bottom-left" reverseOrder={false} />
        <Container>
          <Header>
            <HeaderCategory>
              <DateBox>
                {!shareWeatherData?.dt_txt ? (
                  "오늘 지금"
                ) : (
                  <>
                    {shareWeatherData?.dt_txt?.split("-")[2].split(" ")[0]}일
                    &nbsp;
                    {shareWeatherData?.dt_txt?.split(":")[0].split(" ")[1]}시
                  </>
                )}
              </DateBox>
              <WeatherIcon>
                <img
                  src={`http://openweathermap.org/img/wn/${shareWeatherData?.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
              </WeatherIcon>
              <p>{shareWeatherData?.weather[0].description}</p>
            </HeaderCategory>
            <CloseBox onClick={shareBtnClick}>
              <IoMdClose />
            </CloseBox>
          </Header>
          <WeatherCategoryBox>
            <WeatherCategoryText>
              <WeatherCategoryMain>온도</WeatherCategoryMain>
              <WeatherCategorySub>
                {Math.round(shareWeatherData?.main.temp)}º
              </WeatherCategorySub>
            </WeatherCategoryText>
            <WeatherCategoryText>
              <WeatherCategoryMain>체감</WeatherCategoryMain>
              <WeatherCategorySub>
                {Math.round(shareWeatherData?.main?.feels_like)}º
              </WeatherCategorySub>
            </WeatherCategoryText>
            <WeatherCategoryText>
              <WeatherCategoryMain>최고</WeatherCategoryMain>
              <WeatherCategorySub>
                {Math.round(shareWeatherData?.main.temp_max)}º
              </WeatherCategorySub>
            </WeatherCategoryText>
            <WeatherCategoryText>
              <WeatherCategoryMain>최저</WeatherCategoryMain>
              <WeatherCategorySub>
                {Math.round(shareWeatherData?.main.temp_min)}º
              </WeatherCategorySub>
            </WeatherCategoryText>
            <WeatherCategoryText>
              <WeatherCategoryMain>바람</WeatherCategoryMain>
              <WeatherCategorySub>
                {Math.round(shareWeatherData?.wind.speed)}
                <span>m/s</span>
              </WeatherCategorySub>
            </WeatherCategoryText>
          </WeatherCategoryBox>

          <WearInfoBox>
            <WearInfo>
              <WearInfoMain htmlFor="currentTag">현재 착장</WearInfoMain>
              <TagComponent>
                {currentTags.map((myTag, index) => (
                  <Tag
                    onClick={(e) => onDeleteCurrentTag(myTag)}
                    key={myTag.concat(`${index}`)}
                  >
                    <TagName key={myTag}>{myTag}</TagName>
                    <TagButton type="button">
                      <IoMdClose style={{ color: "${mainColor}" }} />
                    </TagButton>
                  </Tag>
                ))}
                {currentTags.length < 8 && (
                  <TextBox>
                    <Input
                      id="currentTag"
                      name="currentNewTag"
                      type="text"
                      value={currentNewTag}
                      onChange={onChangeCurrent}
                      onKeyDown={onKeyPressCurrent}
                      onBlur={onBlur}
                      placeholder="입력"
                      autoComplete="off"
                    />
                    <TextRemoveButton
                      type="button"
                      onClick={onDeleteCurrentText}
                    >
                      <IoMdClose />
                    </TextRemoveButton>
                  </TextBox>
                )}
              </TagComponent>
            </WearInfo>
            <WearInfo>
              <WearInfoMain htmlFor="recommendTag">추천 착장</WearInfoMain>
              <TagComponent>
                {RecommendTags.map((myTag, index) => (
                  <TagSecond
                    onClick={(e) => onDeleteRecommendTag(myTag)}
                    key={myTag.concat(`${index}`)}
                  >
                    <TagNameSecond key={myTag}>{myTag}</TagNameSecond>
                    <TagButton type="button">
                      <IoMdClose style={{ color: "#20af60" }} />
                    </TagButton>
                  </TagSecond>
                ))}
                {RecommendTags.length < 8 && (
                  <TextBox>
                    <Input
                      id="recommendTag"
                      name="RecommendNewTag"
                      type="text"
                      value={RecommendNewTag}
                      onChange={onChangeRecommend}
                      onKeyDown={onkeyPressRecommend}
                      onBlur={onBlur}
                      placeholder="입력"
                      autoComplete="off"
                    />
                    <TextRemoveButton
                      type="button"
                      onClick={onDeleteRecommendText}
                    >
                      <IoMdClose />
                    </TextRemoveButton>
                  </TextBox>
                )}
              </TagComponent>
            </WearInfo>
          </WearInfoBox>
          <ShareWeatherForm />
        </Container>
      </>
    </Modal>
  );
};

export default ShareWeather;

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  width: 480px;
  height: 700px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  /* overflow: auto; */
  border: 2px solid ${secondColor};
  box-shadow: 12px 12px 0 -2px ${mainColor}, 12px 12px ${secondColor};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.header`
  height: 52px;
  display: flex;
  align-items: center;
  border-radius: 12px 12px 0 0;
  border-bottom: 2px solid ${thirdColor};
  padding: 0 12px;
  position: sticky;
  background: rgba(255, 255, 255, 0.808);
  top: 0px;
  z-index: 10;
`;

const HeaderCategory = styled.div`
  p {
    font-family: "GmarketSans", Apple SD Gothic Neo, Malgun Gothic, sans-serif !important;
    margin-bottom: -4px; // 폰트 여백으로 인한 조정
  }

  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CloseBox = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover,
  &:focus {
    color: ${mainColor};
  }

  svg {
    font-size: 24px;
  }
`;

const WeatherCategoryBox = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* gap: 28px; */
  padding: 12px;
  border-bottom: 2px solid ${thirdColor};
`;

const WeatherCategoryText = styled.div`
  display: flex;
  align-items: center;
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  img {
    display: block;
    width: 100%;
  }
`;

const WeatherCategoryMain = styled.span`
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  border-radius: 9999px;
  padding: 4px 8px;
  margin-right: 10px;
  font-size: 12px;
`;

const WeatherCategorySub = styled.span`
  user-select: text;
  font-size: 14px;
  span {
    font-size: 12px;
  }
`;

const WearInfoBox = styled.section`
  width: 100%;
  border-bottom: 2px solid ${thirdColor};
`;

const WearInfo = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 2px solid ${thirdColor};
  }
  padding: 12px;
`;

const WearInfoMain = styled.label`
  flex: 0 0 auto;
  user-select: text;
  border: 1px solid ${thirdColor};
  color: ${thirdColor};
  border-radius: 9999px;
  width: 64px;
  text-align: center;
  padding: 4px 8px;
  font-size: 12px;
  margin-right: 12px;
`;

const TagComponent = styled.ul`
  display: flex;
  align-items: center;
  border-radius: 0.6rem;
  flex-wrap: wrap;
  gap: 8px;
`;

const Input = styled.input`
  width: 50px;
  outline: none;
  padding: 6px;
  border-radius: 4px;
  border: none;

  &::placeholder {
    font-size: 12px;
  }
  &:focus::placeholder {
    opacity: 0.4;
    color: #9e9e9e;
    transition: all 0.2s;
  }
`;

const Tag = styled.li`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 4px 0px 4px 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: rgba(72, 163, 255, 0.1);
  &:hover {
    background-color: rgba(72, 163, 255, 0.2);
  }
  color: ${mainColor};
`;

const TagSecond = styled(Tag)`
  background-color: rgba(32, 175, 96, 0.1);
  &:hover {
    background-color: rgba(32, 175, 96, 0.2);
  }
`;

const TagButton = styled.button`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    color: ${thirdColor};
    font-size: 16px;
  }
`;

const TagName = styled.span`
  color: ${mainColor};
`;

const TagNameSecond = styled.span`
  color: #20af60;
`;

const TextBox = styled.div`
  /* width: 110px; */
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 1px solid ${thirdColor};
`;

const TextRemoveButton = styled(TagButton)`
  padding: 6px;
  margin-left: -6px;
`;
