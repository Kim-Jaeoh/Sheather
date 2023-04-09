/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactComponent as DecoTwinkle } from "../../assets/image/deco_twinkle.svg";
import { ReactComponent as DecoWeather } from "../../assets/image/deco_weather.svg";

type Props = {};

const Deco = (props: Props) => {
  return (
    <>
      <DecoTwinkle
        css={css`
          position: absolute;
          top: 16px;
          left: 18px;
          transform: rotate(20deg);
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
        `}
        width="16px"
        height="16px"
      />
      <DecoWeather
        css={css`
          position: absolute;
          bottom: 48px;
          left: -100px;
          width: 140px;
          transform: rotate(20deg);
        `}
      />
    </>
  );
};

export default Deco;
