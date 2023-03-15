import styled from "@emotion/styled";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FeedType } from "../../types/type";
import { FrameGrid } from "@egjs/react-grid";
import { Spinner } from "../../assets/Spinner";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import { UserType } from "../../app/user";
import ExploreSkeleton from "../../assets/skeleton/ExploreSkeleton";
import ProfileSkeleton from "../../assets/skeleton/ProfileSkeleton";

type props = {
  myPost: FeedType[];
  email: string;
  loading: boolean;
  notInfoText: string;
  ref: (node?: Element) => void;
};

const ProfilePost = React.forwardRef<HTMLInputElement, props>(
  ({ myPost, email, loading, notInfoText }, ref) => {
    return (
      <>
        {!loading ? (
          <>
            {myPost?.length !== 0 ? (
              <CardBox>
                <>
                  {myPost?.map((res, index) => {
                    return (
                      <Card key={res?.id}>
                        <Link
                          to={"/profile/detail"}
                          state={{ id: res.id, email: res.email }}
                        >
                          <WeatherEmojiBox>
                            <WeatherEmoji>
                              {res.feel.split(" ")[0]}
                            </WeatherEmoji>
                          </WeatherEmojiBox>
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

                  <div
                    ref={ref}
                    // style={{
                    //   position: "absolute",
                    //   bottom: "-100px",
                    // }}
                  />
                </>
              </CardBox>
            ) : (
              <NotInfoBox>
                <NotInfo>{notInfoText}</NotInfo>
              </NotInfoBox>
            )}
          </>
        ) : (
          <CardBox>
            <ProfileSkeleton />
          </CardBox>
        )}
      </>
    );
  }
);

export default ProfilePost;

const CardBox = styled.ul`
  width: 100%;
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: auto;
`;

const Card = styled.li`
  cursor: pointer;
  border-radius: 8px;
  display: block;
  width: 184px;
  height: 184px;
  position: relative;
  overflow: hidden;
  border: 2px solid #222;

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
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
  justify-content: center;
  padding: 4px;
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

const NotInfoBox = styled.div`
  width: 100%;
  height: 200px;
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: center;

  animation-name: slideUp;
  animation-duration: 0.3s;
  animation-timing-function: linear;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const NotInfo = styled.p``;
