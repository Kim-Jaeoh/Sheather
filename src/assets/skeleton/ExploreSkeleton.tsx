import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import { FrameGrid } from "@egjs/react-grid";
import useMediaScreen from "../../hooks/useMediaScreen";

const ExploreSkeleton = () => {
  const { isMobile } = useMediaScreen();

  return (
    <FrameGrid
      className="container"
      gap={isMobile ? 10 : 20}
      defaultDirection={"end"}
      frame={[
        [1, 1, 2, 2, 3, 3],
        [1, 1, 2, 2, 3, 3],
      ]}
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
    </FrameGrid>
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
