import { Point } from "react-easy-crop";

export interface LocationCoordsType {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface LocationErrorType {
  code: number;
  message: string;
}

export interface LocationStateType {
  coordinates?: {
    lat: number;
    lon: number;
    acc: number;
  };
  error?: { code: number; message: string };
}

// 현재 날씨
export interface WeatherDataType {
  id?: number;
  cod?: number;
  dt?: number;
  main: {
    feels_like: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
  coord?: {
    lat: number;
    lon: number;
  };
}

// 단기 예보
export interface WeathersFiveDataType extends WeatherDataType {
  city?: {
    id: number;
    name: string;
  };
  clouds?: {
    all: number;
  };
  dt_txt?: string;
  realDateTime?: number;
}

// 단기 예보 map 돌릴 때
export interface WeatherMapDataType {
  list: WeathersFiveDataType[];
}

export interface ResDataType {
  dt?: number;
  dt_txt?: string;
  weather?: { description: string; icon: string }[];
  main?: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
  };
  wind?: { speed: number };
}

// 유저 타입
export interface CurrentUserType {
  uid: string;
  createdAt: number;
  email: string;
  profileURL: string;
  displayName: string;
  name: string;
  description: string;
  bookmark: string[];
  like: string[];
  follower: FollowerType[];
  following: FollowingType[];
  notice: NoticeArrType[];
  message?: MessageReadType[];
}

export interface UserType {
  loginToken?: boolean;
  currentUser: CurrentUserType;
  newMessage?: boolean;
  newNotice?: boolean;
}

// 팔로우
export interface FollowerType {
  displayName: string;
  email: string;
  time: number;
  isRead?: boolean;
}

export interface FollowingType {
  displayName: string;
  email: string;
  time: number;
}

// 피드
export interface replyType {
  postId: string;
  postImgUrl: string;
  commentId: string;
  noticeId: string;
  replyId?: string;
  replyTagEmail?: string;
  email: string;
  displayName: string;
  text: string;
  time: number;
}

export interface CommentType {
  postId: string;
  postImgUrl: string;
  commentId: string;
  noticeId: string;
  email: string;
  displayName: string;
  text: string;
  time: number;
  reply?: replyType[];
}

export interface FeedType {
  id: string;
  url: string[];
  name?: string;
  displayName: string;
  imgAspect: string;
  email: string;
  createdAt: number;
  like: {
    displayName: string;
    time: number;
    postId: string;
    email?: string;
  }[];
  text: string;
  feel: string;
  wearInfo: {
    outer: string;
    top: string;
    innerTop: string;
    bottom: string;
    etc: string;
  };
  weatherInfo: {
    temp: number;
    wind: number;
    weatherIcon: string;
    weather: string;
  };
  region: string;
  comment: CommentType[];
  editAt?: number;
  tag?: string[];
}

// 이미지
export interface AspectRatio {
  value: number;
  text: string;
  paddingTop?: number;
}

export interface ImageType {
  name?: string;
  imageUrl: string;
  crop?: Point;
  zoom?: number;
  aspect?: AspectRatio;
  croppedImageUrl?: string;
}

// 채팅
export interface MessageType {
  text: string;
  createdAt: number;
  uid: string;
  displayName: string;
  email: string;
  profileURL: string;
  isRead: boolean;
}

export interface MessageListType {
  id: string;
  member?: string;
  message?: MessageType[];
}

export interface MessageReadType {
  id: string;
  user: string;
  email: string;
  isRead: boolean;
}

// 알림
export interface NoticeArrType {
  type: string;
  displayName: string;
  email: string;
  time: number;
  isRead: boolean;
  postId?: string;
  noticeId: string;
  commentId?: string;
  replyId?: string;
  text?: string;
  imgUrl?: string;
  profileURL?: string;
}
