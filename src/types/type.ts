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

export interface replyType {
  postId: string;
  replyId: string;
  email: string;
  displayName: string;
  text: string;
  time: number;
  isRead: boolean;
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
    isRead?: boolean;
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
  reply: replyType[];
  editAt?: number;
  tag?: string[];
}

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

export interface MessageType {
  text: string;
  createdAt: number;
  uid: string;
  displayName: string;
  profileURL: string;
  isRead: boolean;
}

export interface listType {
  id: string;
  member?: string;
  message?: MessageType[];
}

export interface NoticeArrType {
  type: string;
  displayName: string;
  time: number;
  isRead: boolean;
  postId?: string;
  text?: string;
  imgUrl?: string;
  profileURL?: string;
}
