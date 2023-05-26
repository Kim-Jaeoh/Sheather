import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import useMediaScreen from "../../hooks/useMediaScreen";
import { ImageList } from "@mui/material";

const ExploreSkeleton = () => {
  const { isMobile } = useMediaScreen();

  return (
    <ImageList
      sx={{ padding: `${isMobile && "10px"}`, overflow: "hidden" }}
      cols={3}
      gap={!isMobile ? 20 : 10}
    >
      {Array.from({ length: 10 }).map((res, index) => {
        return (
          <CardList key={index}>
            <Card>
              <Skeleton width={"100%"} height={"100%"} variant="rounded" />
            </Card>
          </CardList>
        );
      })}
    </ImageList>
  );
};

export default ExploreSkeleton;

const CardList = styled.div`
  border-radius: 8px;
  border: 2px solid #22222222;
  width: 100%;
  height: 404px;

  @media (max-width: 767px) {
    border-width: 1px;
  }
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
`;
