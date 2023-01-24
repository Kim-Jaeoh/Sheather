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
