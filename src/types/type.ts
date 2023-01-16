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

export interface WeatherDataType {
  cod: number;
  id: number;
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
  coord: {
    lat: number;
    lon: number;
  };
}

export interface WeatherFiveDataType {
  city: {
    id: number;
    name: string;
  };
  cod: number;
  list: {
    clouds: {
      all: number;
    };
    dt: number;
    dt_txt: string;
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
  }[];
}
