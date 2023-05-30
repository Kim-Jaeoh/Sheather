import { useQuery } from "@tanstack/react-query";
import { feedApi } from "../../apis/api";
import { FeedType } from "../../types/type";

type Props = {
  refetch?: boolean;
};

const useFeedQuery = ({ refetch }: Props) => {
  // 피드 리스트 가져오기
  const { data: feedData, isLoading: isFeedLoading } = useQuery<FeedType[]>(
    ["feed"],
    feedApi,
    {
      refetchOnWindowFocus: false,
      refetchInterval: refetch ? 1000 * 60 * 5 : false, // 태그 순위 5분 간격 업데이트
      refetchIntervalInBackground: refetch ? true : false, // 백그라운드에서도 업데이트 되도록
      onError: (e) => console.log(e),
    }
  );

  return { feedData, isFeedLoading };
};

export default useFeedQuery;
