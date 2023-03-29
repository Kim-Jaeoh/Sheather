import { useState } from "react";
import styled from "@emotion/styled";
import FeedCategory from "../components/feed/FeedCategory";
import SortFeedCategory from "../components/feed/SortFeedCategory";

const Home = () => {
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_SERVER_PORT}/api/feed/recent?`
  );

  return (
    <Container>
      <SortFeedCategory url={url} setUrl={setUrl} />
      <FeedCategory url={url} />
    </Container>
  );
};
export default Home;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ff5673;

  @media (max-width: 767px) {
    background: transparent;
  }
`;
