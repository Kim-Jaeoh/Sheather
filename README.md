# Sheather

<br>

![](https://velog.velcdn.com/images/rlawodh123/post/30229d45-edcf-4027-a26f-7e4403ebf7d7/image.png)
![](https://velog.velcdn.com/images/rlawodh123/post/6e4b0c4d-00ea-4212-aed9-d1aff66ebf14/image.gif)

<br>

> 😎 [배포 사이트 바로가기](https://sheather.netlify.app/)<br> > [🔍 자세한 내용 보러가기 (velog 포스팅)](https://velog.io/@rlawodh123/series/Sheather)<br>

<br>

## 📋 프로젝트

>

- 해당 프로젝트는 기온별 옷차림을 공유하고 날씨를 확인할 수 있는 웹앱입니다.
  날씨(기온)가 애매하여 어떤 옷을 입고 나가야 할지 고민이 되고, 사람들은 어떻게 입었을까 라는 생각이 들어 '기온별 옷차림'이라는 주제를 정해 제작하게 되었습니다.
  - 기존 피드에 업로드 되어 있는 이미지 출처 - 무신사 브랜드 스냅

<br>

## 🛠️ 사용 기술

- `React`, `TypeSccript`, `Emotion`
- `Redux`, `React-Query`
- `Express (게시글 관련)`, `Firebase (회원가입/로그인, 채팅 내역)`, `Kakao Api (주소)`, `OpenWeather api (날씨)`
- Deploy : `Netlify (Front)`, `CloudType (Back)`

<br>

## **✨ 전체 기능 및 특징**

- 현재 위치 정보(경도, 위도)는 `window.navigator.geolocation`을 사용하여 추출
- `Kakao Local API`를 사용하여 현재 주소 정보 확인
- `OpenWeather API`를 사용하여 현재 날씨와 4일 동안의 시간별 예보 확인
- `Redux`를 사용하여 게시글 공유 시 날씨 정보와 유저 관련 정보 추출
- `Firebase`를 사용하여 팔로잉, 팔로워, 알림, 채팅 관련 정보와 FCM Token 정보를 관리
- `useInfiniteQuery`로 피드 무한 스크롤, `Firebase`로 채팅 내역 무한 스크롤 구현
  - `useMutation`을 사용해 게시글, 댓글, 답글, 좋아요 구현
- `Firebase Cloud Messaging` 사용하여 `Web Push Notifications` 구현
  - 유저가 액션(좋아요, 알림, 채팅 등 ) 할 시 브라우저 알림창 노출
  - `service-worker`를 등록함으로써 브라우저가 닫혀 있거나 다른 탭에 있어도 알림 받을 수 있도록 함
  - (ios는 safari - ‘공유’ - ‘홈 화면에 추가’ 설정해야 알림 받을 수 있음)
- `react-calendar`, `rc-slider` 라이브러리 사용하여 게시물 날짜 및 시간별로 확인 가능
- 검색창을 통해 태그와 유저 검색 / 쿼리 스트링을 사용하여 필요한 데이터 추출 / 최근 검색어는 localStorage에 저장

<br>

## 💫 페이지별 기능 및 특징

<details>
<summary>홈</summary>
<div markdown="1">

[홈 링크](https://velog.io/@rlawodh123/React-Sheather-%EA%B8%B0%EC%98%A8%EB%B3%84-%EC%98%B7%EC%B0%A8%EB%A6%BC-%EA%B3%B5%EC%9C%A0-%EC%86%8C%EC%85%9C-%ED%99%88)
<br>
![](https://velog.velcdn.com/images/rlawodh123/post/08c0e66e-fe9c-4007-9d94-f33109dff162/image.gif)
![](https://velog.velcdn.com/images/rlawodh123/post/dc66219f-7eae-4737-911b-f7c157090d93/image.jpg)

- Left Bar
  - `Firebase` 계정 로그인/로그아웃/비밀번호찾기
  - 다른 유저가 좋아요, 알림, 채팅 등 액션 행할 시 `메세지`, `알림` 카테고리에 알림 뱃지 노출
- Main
  - (자주 쓰이는 useQuery는 따로 커스텀 훅(모듈화)으로 빼내어 사용했지만, 하기 설명에서는 함께 코드 기재함)
  - `[openWeather api](https://openweathermap.org/)`를 사용하여 단기 예보, 현재 날씨 정보 확인 가능
  - `window.navigator.geolocation` 사용하여 현재 위치 정보(경도, 위도)를 추출 후,
    `[Kakao Local api](https://developers.kakao.com/docs/latest/ko/local/dev-guide)`를 이용해 현재 주소 정보 확인 가능
  - 기온에 맞는 옷차림 추천
  - `Mui`의 `[Masonry](https://mui.com/material-ui/react-masonry/)` 레이아웃 적용
  - 피드를 구분할 수 있게 `메인 카테고리(팔로잉, 탐색)`와 `서브 카테고리(최신순, 인기순, 날짜별)`로 구성
  - `react-calendar`, `rc-slider` 라이브러리를 사용하여 날짜별, 시간별로 피드 확인 가능
- Right bar
  - 검색창
    - 태그 및 유저 검색 가능
    - api 주소에 검색한 태그 값을 쿼리 스트링으로 넣어 데이터를 받아옴
    - `localStorage` 사용하여 최근 검색어 저장
  - 피드에 추가된 태그들을 인기순으로 정렬하여 확인 가능
  - 팔로잉 되지 않은 다른 유저 추천

</div>
</details>

<details>
<summary>상세 피드</summary>
<div markdown="2">

[상세 피드 링크](https://velog.io/@rlawodh123/React-Sheather-%EA%B8%B0%EC%98%A8%EB%B3%84-%EC%98%B7%EC%B0%A8%EB%A6%BC-%EA%B3%B5%EC%9C%A0-%EC%86%8C%EC%85%9C-%EC%83%81%EC%84%B8-%ED%94%BC%EB%93%9C)
<br>
![](https://velog.velcdn.com/images/rlawodh123/post/291b31f7-f8b3-448c-bd4a-e8ed833def39/image.gif)

- 해당 업로드 된 피드의 날씨, 선택한 옷 정보 확인 가능
- 본인 피드 수정 및 다른 유저 팔로우 가능
- 좋아요, 북마크 구현
- 해당 피드 클립보드에 복사
- 댓글, 답글(대댓글) 구현

</div>
</details>

<details>
<summary>날씨</summary>
<div markdown="3">

[날씨 링크](https://velog.io/@rlawodh123/React-%EC%B9%B4%EC%B9%B4%EC%98%A4-%ED%94%84%EB%A0%8C%EC%A6%88%EC%83%B5-%ED%81%B4%EB%A1%A0-%EC%BD%94%EB%94%A9-%EC%83%81%ED%92%88)
<br>
![](https://velog.velcdn.com/images/rlawodh123/post/7bd2edda-0720-4f24-820e-99f40f6b51d3/image.gif)

- `window.navigator.geolocation`로 api 요청 시 필요한 값인 현재 위치 정보(경도, 위도) 추출
  - [`Kakao Local api`](https://developers.kakao.com/docs/latest/ko/local/dev-guide)로 현재 주소 정보 확인 가능
  - [`openWeather api`](https://openweathermap.org/)로 현재 날씨 및 시간별 예보 4일 정보 확인 가능
- [`egjs/flicking`](https://github.com/naver/egjs-flicking) 라이브러리를 사용하여 오브젝트를 가로 스크를로 배치
- 현재 날씨 공유 (게시물 작성)
  - 공유 버튼 클릭 시 `dispatch`로 해당 날씨 정보 값 `store`로 전달
    - `store`에서 값을 받아와 업로드 시 함께 전송
  - 현재 착장에 대한 체감, 정보 선택 및 태그 입력 가능
  - [`react-easy-crop`](https://www.npmjs.com/package/react-easy-crop) 라이브러리로 이미지 확대/축소 및 비율별로 자르기 가능
  - [`browser-image-compression`](https://www.npmjs.com/package/browser-image-compression) 라이브러리를 사용하여 이미지 압축
- 날씨별로 추천 의류 확인

</div>
</details>

<details>
<summary>채팅</summary>
<div markdown="4">

[채팅 링크](https://velog.io/@rlawodh123/React-Sheather-%EA%B8%B0%EC%98%A8%EB%B3%84-%EC%98%B7%EC%B0%A8%EB%A6%BC-%EA%B3%B5%EC%9C%A0-%EC%86%8C%EC%85%9C-%EC%B1%84%ED%8C%85)
<br>
![](https://velog.velcdn.com/images/rlawodh123/post/1a53c022-74e6-4632-b076-f7939b7118a8/image.gif)
![](https://velog.velcdn.com/images/rlawodh123/post/cee2b8ac-7e11-4353-a43f-1de98fedca57/image.gif)

- `Firebase`의 `onSnapshot`으로 실시간 채팅, 무한스크롤 구현
  - 채팅방 입장 시 스크롤 하단 이동 / 스크롤 하단 이동 버튼
  - 메세지 발신 시 상대방이 읽음 여부에 따라 본인 메세지 옆에 '1' 노출/삭제
  - 메세지 수신 시 알림 뱃지 생성
- 팔로우 되어 있는 사람에게 채팅 생성 가능
- 채팅방 삭제
  - 본인과 상대의 정보에 서로가 참여한 채팅방 정보가 둘 다 없을 시 채팅방 완전 삭제
  - 정보가 둘 중 하나라도 남아 있는 경우 같은 대상에게 대화방 생성/수신 시 기록 유지

</div>
</details>

<details>
<summary>프로필</summary>
<div markdown="5">

[프로필 링크](https://velog.io/@rlawodh123/React-Sheather-%EA%B8%B0%EC%98%A8%EB%B3%84-%EC%98%B7%EC%B0%A8%EB%A6%BC-%EA%B3%B5%EC%9C%A0-%EC%86%8C%EC%85%9C-%ED%94%84%EB%A1%9C%ED%95%84)
<br>
![](https://velog.velcdn.com/images/rlawodh123/post/857f6826-9796-481b-b7d4-09d756c14027/image.gif)

- 프로필 수정
  - 프로필 이미지 변경
  - `@사용자 이름 (중복 체크)` / `이름` 최대 20자까지 변경 가능
- 팔로잉, 팔로워 리스트 확인
- 설정
  - 웹 푸시 알림 설정(on/off)
  - 로그아웃
- 본인 프로필에서만 `좋아요`, `북마크`한 게시물 확인 가능
- 상대 프로필에서 `메세지` 보내기 가능

</div>
</details>
