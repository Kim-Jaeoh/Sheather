import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import { FrameGrid } from "@egjs/react-grid";

const ExploreSkeleton = () => {
  return (
    <FrameGrid
      className="container"
      gap={10}
      defaultDirection={"end"}
      isConstantSize={true}
      preserveUIOnDestroy={true}
      observeChildren={true}
      frame={[
        [1, 1, 2, 2, 3, 3],
        [1, 1, 2, 2, 3, 3],
        [4, 4, 5, 5, 3, 3],
        [4, 4, 5, 5, 3, 3],
        [6, 6, 7, 7, 8, 8],
        [6, 6, 7, 7, 8, 8],
        [6, 6, 9, 9, 10, 10],
        [6, 6, 9, 9, 10, 10],
      ]}
      rectSize={0}
      useFrameFill={true}
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
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
`;
