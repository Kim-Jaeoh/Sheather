import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import TempClothes from "../../../assets/TempClothes";
import Flicking from "@egjs/react-flicking";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const { ClothesCategory } = TempClothes();

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
      bottom: bottomCheck,
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
                      id={index.toString()}
                      name="range"
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
                      htmlFor={index.toString()}
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
                    {ClothesCategory.outer.map((res, index) => (
                      <Tag key={index}>
                        <TagInput
                          id={index.toString()}
                          name="range"
                          type="radio"
                          style={{
                            marginTop: "2px",
                            marginRight: "4px",
                            display: "none",
                          }}
                        />
                        <TagLabel
                          bgColor={bgColor}
                          select={outerCheck}
                          value={res}
                          onClick={() => onClick(res, "outer")}
                          htmlFor={index.toString()}
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
                  {ClothesCategory.top.map((res, index) => (
                    <Tag key={index}>
                      <TagInput
                        id={index.toString()}
                        name="range"
                        type="radio"
                        style={{
                          marginTop: "2px",
                          marginRight: "4px",
                          display: "none",
                        }}
                      />
                      <TagLabel
                        bgColor={bgColor}
                        select={topCheck}
                        value={res}
                        onClick={() => onClick(res, "top")}
                        htmlFor={index.toString()}
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
                    {ClothesCategory.innerTop.map((res, index) => (
                      <Tag key={index}>
                        <TagInput
                          id={index.toString()}
                          name="range"
                          type="radio"
                          style={{
                            marginTop: "2px",
                            marginRight: "4px",
                            display: "none",
                          }}
                        />
                        <TagLabel
                          bgColor={bgColor}
                          select={innerTopCheck}
                          value={res}
                          onClick={() => onClick(res, "innerTop")}
                          htmlFor={index.toString()}
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
                    {ClothesCategory.bottom.map((res, index) => (
                      <Tag key={index}>
                        <TagInput
                          id={index.toString()}
                          name="range"
                          type="radio"
                          style={{
                            marginTop: "2px",
                            marginRight: "4px",
                            display: "none",
                          }}
                        />
                        <TagLabel
                          bgColor={bgColor}
                          select={bottomCheck}
                          value={res}
                          onClick={() => onClick(res, "bottom")}
                          htmlFor={index.toString()}
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
                    {ClothesCategory &&
                      ClothesCategory.etc.map((res, index) => (
                        <Tag key={index}>
                          <TagInput
                            id={index.toString()}
                            name="range"
                            type="radio"
                            style={{
                              marginTop: "2px",
                              marginRight: "4px",
                              display: "none",
                            }}
                          />
                          <TagLabel
                            bgColor={bgColor}
                            select={etcCheck}
                            value={res}
                            onClick={() => onClick(res, "etc")}
                            htmlFor={index.toString()}
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

const { mainColor, secondColor, thirdColor, fourthColor } = ColorList();

const Container = styled.div`
  background: #fff;
  position: relative;
  border-radius: 0 0 12px 12px;
`;

const WearInfoBox = styled.section`
  width: 100%;
  border-top: 1px solid ${thirdColor};
  border-bottom: 1px solid ${thirdColor};
`;

const WearCondition = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 12px;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${thirdColor};
  }
`;
const FlickingBox = styled.div`
  position: relative;
  cursor: pointer;
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
  gap: 8px;
`;

const Tag = styled.div`
  font-size: 12px;
  display: flex;
  flex: 0 0 auto;
`;

const TagInput = styled.input`
  margin-top: 2px;
  margin-right: 4px;
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
      props.select === props.value ? props.bgColor : `${thirdColor}`};
  border-radius: 4px;
  cursor: pointer;
  color: ${(props) => props.select === props.value && `#fff`};
  background: ${(props) =>
    props.select === props.value ? props.bgColor : "transparent"};
`;

const AddTagBox = styled.div`
  padding: 0 2px;
`;

const AddTag = styled.div`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid ${thirdColor};
  border-radius: 4px;
  cursor: pointer;
`;
const WearDetailBox = styled.div`
  overflow: hidden;
  padding: 12px;
  &:not(:last-of-type) {
    /* border-bottom: 2px solid ${thirdColor}; */
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
      : thirdColor};
  min-width: 55px;
  text-align: center;
  padding-right: 6px;
  border-right: 1px solid ${thirdColor};
  font-size: 12px;
  margin-right: 12px;
`;
