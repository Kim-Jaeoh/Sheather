import styled from "@emotion/styled";
import TempClothes from "../../../assets/data/TempClothes";
import Flicking from "@egjs/react-flicking";
import { useEffect, useState } from "react";
// import "../../../styles/DetailFlicking.css";

type props = {
  bgColor?: string;
  checkTag?: {
    feel: string;
    outer: string;
    top: string;
    innerTop: string;
    bottom: string;
    etc: string;
  };
  setCheckTag: React.Dispatch<
    React.SetStateAction<{
      feel: string;
      outer: string;
      top: string;
      innerTop: string;
      bottom: string;
      etc: string;
    }>
  >;
};

const ShareWeatherCategory = ({ bgColor, checkTag, setCheckTag }: props) => {
  const [select, setIsCurrentCheck] = useState(checkTag?.feel);
  const [outerCheck, setOuterCheck] = useState(checkTag?.outer);
  const [topCheck, setTopCheck] = useState(checkTag?.top);
  const [innerTopCheck, setInnerTopCheck] = useState(checkTag?.innerTop);
  const [bottomCheck, setBottomCheck] = useState(checkTag?.bottom);
  const [etcCheck, setEtcCheck] = useState(checkTag?.etc);
  const { clothesCategory } = TempClothes();

  const currentEmoji = [
    "🥵 더워요",
    "😥 조금 더워요",
    "😄 적당해요",
    "😬 조금 추워요",
    "🥶 추워요",
  ];

  const onClick = (value: string, name: string) => {
    if (name === "current") {
      setIsCurrentCheck(value);
    }
    if (name === "outer") {
      setOuterCheck(value);
    }
    if (name === "top") {
      setTopCheck(value);
    }
    if (name === "innerTop") {
      setInnerTopCheck(value);
    }
    if (name === "bottom") {
      setBottomCheck(value);
    }
    if (name === "etc") {
      setEtcCheck(value);
    }
  };

  useEffect(() => {
    setCheckTag({
      feel: select,
      outer: outerCheck,
      top: topCheck,
      innerTop: innerTopCheck,
      bottom: topCheck === "원피스" ? "없음" : bottomCheck,
      etc: etcCheck,
    });
  }, [bottomCheck, etcCheck, innerTopCheck, outerCheck, select, topCheck]);

  return (
    <Container>
      <WearInfoBox>
        <WearCondition>
          <WearInfoMain bgColor={bgColor} select={select}>
            현재 착장
          </WearInfoMain>
          <FlickingBox>
            <Flicking
              onChanged={(e) => console.log(e)}
              moveType="freeScroll"
              bound={true}
              align="prev"
            >
              <TagBox>
                {currentEmoji.map((res, index) => (
                  <Tag key={index}>
                    <TagInput
                      id={index.toString() + "a"}
                      type="radio"
                      style={{
                        marginTop: "2px",
                        marginRight: "4px",
                        display: "none",
                      }}
                    />
                    <TagLabel
                      bgColor={bgColor}
                      select={select}
                      value={res}
                      onClick={() => onClick(res, "current")}
                      htmlFor={index.toString() + "a"}
                    >
                      {res}
                    </TagLabel>
                  </Tag>
                ))}
              </TagBox>
            </Flicking>
          </FlickingBox>
        </WearCondition>

        <WearDetailBox>
          <WearInfo>
            <WearInfoMain bgColor={bgColor} select={outerCheck}>
              아우터
            </WearInfoMain>
            {outerCheck !== "없음" ? (
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <TagBox>
                    {clothesCategory.outer.map((res, index) => (
                      <Tag key={index}>
                        <TagInput id={index.toString() + "b"} type="radio" />
                        <TagLabel
                          bgColor={bgColor}
                          select={outerCheck}
                          value={res}
                          onClick={() => onClick(res, "outer")}
                          htmlFor={index.toString() + "b"}
                        >
                          {res}
                        </TagLabel>
                      </Tag>
                    ))}
                  </TagBox>
                </Flicking>
              </FlickingBox>
            ) : (
              <AddTagBox>
                <Tag>
                  <AddTag onClick={() => setOuterCheck(null)}>+</AddTag>
                </Tag>
              </AddTagBox>
            )}
          </WearInfo>
          <WearInfo>
            <WearInfoMain bgColor={bgColor} select={topCheck}>
              상의
            </WearInfoMain>
            <FlickingBox>
              <Flicking
                onChanged={(e) => console.log(e)}
                moveType="freeScroll"
                bound={true}
                align="prev"
              >
                <TagBox>
                  {clothesCategory.top
                    .filter((el) => el !== "없음")
                    .map((res, index) => (
                      <Tag key={index}>
                        <TagInput id={index.toString() + "c"} type="radio" />
                        <TagLabel
                          bgColor={bgColor}
                          select={topCheck}
                          value={res}
                          onClick={() => onClick(res, "top")}
                          htmlFor={index.toString() + "c"}
                        >
                          {res}
                        </TagLabel>
                      </Tag>
                    ))}
                </TagBox>
              </Flicking>
            </FlickingBox>
          </WearInfo>
          <WearInfo>
            <WearInfoMain bgColor={bgColor} select={innerTopCheck}>
              내의
            </WearInfoMain>
            {innerTopCheck !== "없음" ? (
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <TagBox>
                    {clothesCategory.innerTop.map((res, index) => (
                      <Tag key={index}>
                        <TagInput id={index.toString() + "d"} type="radio" />
                        <TagLabel
                          bgColor={bgColor}
                          select={innerTopCheck}
                          value={res}
                          onClick={() => onClick(res, "innerTop")}
                          htmlFor={index.toString() + "d"}
                        >
                          {res}
                        </TagLabel>
                      </Tag>
                    ))}
                  </TagBox>
                </Flicking>
              </FlickingBox>
            ) : (
              <AddTagBox>
                <Tag>
                  <AddTag onClick={() => setInnerTopCheck(null)}>+</AddTag>
                </Tag>
              </AddTagBox>
            )}
          </WearInfo>

          <WearInfo>
            <WearInfoMain
              bgColor={bgColor}
              select={bottomCheck}
              select2={topCheck}
            >
              하의
            </WearInfoMain>
            {topCheck !== "원피스" && bottomCheck !== "없음" ? (
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <TagBox>
                    {clothesCategory.bottom.map((res, index) => (
                      <Tag key={index}>
                        <TagInput id={index.toString() + "e"} type="radio" />
                        <TagLabel
                          bgColor={bgColor}
                          select={bottomCheck}
                          value={res}
                          onClick={() => onClick(res, "bottom")}
                          htmlFor={index.toString() + "e"}
                        >
                          {res}
                        </TagLabel>
                      </Tag>
                    ))}
                  </TagBox>
                </Flicking>
              </FlickingBox>
            ) : (
              <AddTagBox>
                <Tag>
                  <AddTag onClick={() => setBottomCheck(null)}>+</AddTag>
                </Tag>
              </AddTagBox>
            )}
          </WearInfo>

          <WearInfo>
            <WearInfoMain bgColor={bgColor} select={etcCheck}>
              기타
            </WearInfoMain>
            {etcCheck !== "없음" ? (
              <FlickingBox>
                <Flicking
                  onChanged={(e) => console.log(e)}
                  moveType="freeScroll"
                  bound={true}
                  align="prev"
                >
                  <TagBox>
                    {clothesCategory &&
                      clothesCategory.etc.map((res, index) => (
                        <Tag key={index}>
                          <TagInput id={index.toString() + "f"} type="radio" />
                          <TagLabel
                            bgColor={bgColor}
                            select={etcCheck}
                            value={res}
                            onClick={() => onClick(res, "etc")}
                            htmlFor={index.toString() + "f"}
                          >
                            {res}
                          </TagLabel>
                        </Tag>
                      ))}
                  </TagBox>
                </Flicking>
              </FlickingBox>
            ) : (
              <AddTagBox>
                <Tag>
                  <AddTag onClick={() => setEtcCheck(null)}>+</AddTag>
                </Tag>
              </AddTagBox>
            )}
          </WearInfo>
        </WearDetailBox>
      </WearInfoBox>
    </Container>
  );
};

export default ShareWeatherCategory;

const Container = styled.div`
  background: #fff;
  position: relative;
  border-radius: 0 0 12px 12px;
`;

const WearInfoBox = styled.section`
  width: 100%;
  border-bottom: 1px solid var(--third-color);
`;

const WearCondition = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 14px;
  &:not(:last-of-type) {
    border-bottom: 1px solid var(--third-color);
  }
`;
const FlickingBox = styled.div`
  width: 100%;
  position: relative;
  cursor: pointer;

  &::after {
    right: 0px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    position: absolute;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 14px;
    content: "";
  }
`;
const TagBox = styled.div`
  display: flex;
  user-select: none;
  flex: nowrap;
  gap: 4px;
  padding: 2px;
`;

const Tag = styled.div`
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
  padding: 2px;
`;

const TagInput = styled.input`
  display: none;
`;

const TagLabel = styled.label<{
  bgColor: string;
  select: string;
  value: string;
}>`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid
    ${(props) =>
      props.select === props.value ? props.bgColor : `var(--fourth-color)`};
  border-radius: 9999px;
  cursor: pointer;
  color: ${(props) => props.select === props.value && `#fff`};
  background: ${(props) =>
    props.select === props.value ? props.bgColor : "transparent"};
`;

const AddTagBox = styled.div`
  padding: 2px;
`;

const AddTag = styled.div`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid var(--third-color);
  border-radius: 9999px;
  cursor: pointer;
`;

const WearDetailBox = styled.div`
  overflow: hidden;
  padding: 14px;
  &:not(:last-of-type) {
  }
`;

const WearInfo = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`;

const WearInfoMain = styled.div<{
  bgColor: string;
  select: string;
  select2?: string;
}>`
  flex: 0 0 auto;
  user-select: text;
  font-weight: ${(props) =>
    props.select !== null || props?.select2 === "원피스" ? "bold" : "normal"};
  color: ${(props) =>
    props.select !== null || props?.select2 === "원피스"
      ? props.bgColor
      : `var(--third-color)`};
  text-align: center;
  min-width: 54px;
  font-size: 12px;
  margin-right: 12px;
`;
