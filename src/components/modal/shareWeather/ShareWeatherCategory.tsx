import styled from "@emotion/styled";
import ColorList from "../../../assets/ColorList";
import TempClothes from "../../../assets/TempClothes";
import Flicking from "@egjs/react-flicking";
// import "../../../styles/DetailFlicking.css";

type props = {
  select: number;
  outerCheck: number;
  topCheck: number;
  innerTopCheck: number;
  bottomCheck: number;
  etcCheck: number;
  setOuterCheck: React.Dispatch<number>;
  setInnerTopCheck: React.Dispatch<number>;
  setBottomCheck: React.Dispatch<number>;
  setEtcCheck: React.Dispatch<number>;
  onClick: (index: number, name: string) => void;
};

const ShareWeatherCategory = (props: props) => {
  const {
    select,
    outerCheck,
    topCheck,
    innerTopCheck,
    bottomCheck,
    etcCheck,
    setOuterCheck,
    setInnerTopCheck,
    setBottomCheck,
    setEtcCheck,
    onClick,
  } = props;
  const { ClothesCategory } = TempClothes();

  const CurrentEmoji = [
    ["🥵 더워요"],
    ["😥 조금 더워요"],
    ["😄 적당해요"],
    ["😬 조금 추워요"],
    ["🥶 추워요"],
  ];

  return (
    <Container>
      <WearInfoBox>
        <WearCondition>
          <WearInfoMain select={select}>현재 착장</WearInfoMain>
          <FlickingBox>
            <Flicking
              onChanged={(e) => console.log(e)}
              moveType="freeScroll"
              bound={true}
              align="prev"
            >
              <TagBox>
                {CurrentEmoji.map((res, index) => (
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
                      select={select}
                      index={index}
                      onClick={() => onClick(index, "current")}
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
            <WearInfoMain select={outerCheck}>아우터</WearInfoMain>
            {outerCheck !== 0 ? (
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
                          select={outerCheck}
                          index={index}
                          onClick={() => onClick(index, "outer")}
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
            <WearInfoMain select={topCheck}>상의</WearInfoMain>
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
                        select={topCheck}
                        index={index}
                        onClick={() => onClick(index, "top")}
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
            <WearInfoMain select={innerTopCheck}>내의</WearInfoMain>
            {innerTopCheck !== 0 ? (
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
                          select={innerTopCheck}
                          index={index}
                          onClick={() => onClick(index, "innerTop")}
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
            <WearInfoMain select={bottomCheck} select2={topCheck}>
              하의
            </WearInfoMain>
            {topCheck !== 1 && bottomCheck !== 0 ? (
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
                          select={bottomCheck}
                          index={index}
                          onClick={() => onClick(index, "bottom")}
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
            <WearInfoMain select={etcCheck}>기타</WearInfoMain>
            {etcCheck !== 0 ? (
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
                            select={etcCheck}
                            index={index}
                            onClick={() => onClick(index, "etc")}
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
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #fafafa);
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

const TagLabel = styled.label<{ select: number; index: number }>`
  gap: 12px;
  padding: 6px 8px;
  border: 1px solid
    ${(props) =>
      props.select === props.index ? `${mainColor}` : `${thirdColor}`};
  border-radius: 4px;
  cursor: pointer;
  color: ${(props) => props.select === props.index && `#fff`};
  background: ${(props) =>
    props.select === props.index ? `${mainColor}` : "transparent"};
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

const WearInfoMain = styled.div<{ select: number; select2?: number }>`
  flex: 0 0 auto;
  user-select: text;
  /* border: 1px solid ${thirdColor}; */
  /* color: ${thirdColor}; */
  font-weight: ${(props) =>
    props.select !== null || props?.select2 === 1 ? "bold" : "normal"};
  color: ${(props) =>
    props.select !== null || props?.select2 === 1 ? mainColor : thirdColor};
  /* border-radius: 9999px; */
  min-width: 55px;
  text-align: center;
  /* padding: 4px 6px; */
  padding-right: 6px;
  border-right: 1px solid ${thirdColor};
  font-size: 12px;
  margin-right: 12px;
`;
