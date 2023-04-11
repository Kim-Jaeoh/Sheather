/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactComponent as DecoTwinkle } from "../../assets/image/deco_twinkle.svg";
import { ReactComponent as DecoWeather } from "../../assets/image/deco_weather.svg";

const Deco = () => {
  return (
    <>
      {/* <DecoTwinkle
        css={css`
          position: absolute;
          top: 16px;
          left: 18px;
          transform: rotate(20deg);
          @media (max-width: 767px) {
            top: 5px;
            left: 152px;
          }
        `}
        width="20px"
        height="20px"
      />
      <DecoTwinkle
        css={css`
          position: absolute;
          top: 55px;
          right: 15px;
          transform: rotate(-20deg);
          @media (max-width: 767px) {
            top: 74px;
            right: 152px;
          }
        `}
        width="16px"
        height="16px"
      /> */}
      <DecoWeather
        css={css`
          position: absolute;
          bottom: 48px;
          left: -100px;
          width: 140px;
          transform: rotate(20deg);
          @media (max-width: 767px) {
            display: none;
          }
        `}
      />
    </>
  );
};

export default Deco;
