/** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react";
import { ReactComponent as DecoWeather } from "../../assets/image/deco_weather.svg";

const Deco = () => {
  return (
    <>
      <DecoWeather
        style={{
          position: `absolute`,
          bottom: `48px`,
          left: `-100px`,
          width: `140px`,
          transform: `rotate(20deg)`,
        }}
      />
    </>
  );
};

export default Deco;
