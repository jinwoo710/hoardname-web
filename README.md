# Hoardname Web

## 프로젝트 소개
보드게임 모임 "호드네임"의 보유 보드게임 검색 및 정보 확인, 중고 거래를 위한 반응형 웹 애플리케이션입니다.

## 개발 동기 및 과정

모임의 규모가 커지면서 보유한 보드게임도 100개 이상으로 증가했고, 기존 엑셀 방식의 관리 시스템으로는 한계가 있었습니다. 보드게임의 상세 정보 확인을 위해서는 외부 사이트에서 검색해야 했으며, 회원들간의 중고 거래 시에도 카카오톡 오픈채팅방에서 반복적인 판매 홍보가 필요했습니다.

이러한 문제점들을 해결하고자 다음 세 가지 목표를 가지고 웹 애플리케이션을 개발하게 되었습니다
1.  즉각적인 게임 정보 조회
2. 효율적인 보드게임 컬렉션 관리
3. 간편한 중고 거래 시스템 구축
<p align="center">
  <img src="public/readme/gameList.png" width="200" alt="게임 목록 엑셀">
  <img src="public/readme/kakaotalkTrade.jpeg" width="200" alt="카카오톡을 통한 중고 거래">
   <img src="public/readme/personalTrade.png" width="200" alt="카카오톡을 통한 중고 거래2">
</p>

## 핵심 기능 소개

### 1. 보드게임 검색 및 상세 정보
- BoardGameGeek API를 통한 보드게임 검색
- 최적 인원, 추천 인원, 플레이 가능 인원, 웨이트, 아지트 내 입고 여부 등의 상세 정보 제공
- 한글, 영어 검색 지원

### 2. 개인 컬렉션 관리
- 보유 중인 게임 목록 관리
- 개임 대여 상태 추적

### 3. 중고 거래 시스템
- 회원간의 판매 목록 관리
- 오픈카카오톡 링크 연결

## 서비스
https://hoardname-web.pages.dev

## 기술 스택

### frontend
- Next.js 
- React
- TypeScript
- Tailwind CSS
- Tanstack
- Zustand

### Backend
- Drizzle ORM
- Coludflare D1

### 인증/배포
- NextAuth.js
- Cloudflare Pages

### 테스트
- Jest

### 코드 품질
- ESLint
- Prettier
- Husky

## env
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- NEXT_PUBLIC_BGG_LINK
- NEXT_PUBLIC_BGG_API