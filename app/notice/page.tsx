export default function NoticePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">공지사항</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
          <strong className="text-lg font-semibold mb-2">회칙</strong>
          <p className="text-gray-700 mb-4">
            <strong>1. 호드네임의 의미</strong>
            <br />
            <strong>Hoard Name(호드네임)</strong> 은 Ha-Nam 과 Board game 의 합성어 입니다.
            <br />
            <br />
            <strong>2. 닉네임 변경</strong>
            <br />
            활동 전에 양식에 맞게 닉네임을 변경한다
            <br />
            &nbsp; 닉네임.성별.지역
            <br />
            ex) 김밥.남.망월
            <br />
            <br />
            <strong>3. 위반되는 행위에 대한 방침</strong>
            <br />
            <strong>3.1. 무례한 행동이나 언행</strong>
            <br />
            무례한 행동이나 언행으로 불쾌감을 주는 자
            <br />
            <strong>3.2. 회원간 분란</strong>
            <br />
            회원간 분란을 일으키는 자 
            <br />
            <strong>3.3. 활동의사가 없는 자</strong>
            <br />
            활동이나 활동의사가 없어 팀 잔류가 무의미한 자 
            <br />
            <strong>3.4. 기타</strong>
            <br />
            그 밖에 관리자 또는 회원간 동의하에 제명이 필요하다고 판단 되는 자
            <br />
            위 내용 또는 내용에 준하는 회원에 한하여 매니저(방장) 또는 부매니저가
            <br />
            경고 또는 즉시 제명을 할 수 있다.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
             <strong className="text-lg font-semibold mb-2">모임참여 가능 날짜 투표</strong>
          <p className="text-gray-700 mb-4">
            1. 채팅방 상단 고정된 &apos;N월 N주차 투표&apos; 클릭
            <br />
            → 원하는 날짜의 참여 인원 확인
            <br />
            → 해당 날짜에 투표
            <br />
            * 단 해당 모임 날짜에 월회원 1명 이상 필요
            <br />
            <br />
            2. 투표 게시물 댓글에 참여 가능 시간 등 기재 
            <br />
            [댓글 양식]
            <br />
            요일 00시~00시 . 기타 . 모집인원, 지인 여부, 게임명 등
            <br />
            ㄴ ex. 일 12시~16시 . 스플렌더
            <br />
            <br />
            3. 기존 참석자가 있다면 @닉네임 으로 태그 걸어 알려주기 
            <br />
            * 추후 변동사항 발생시 기존 참석자에게 태그로 알려주기
            <br />
            <br />
            </p>
         
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
        <strong className="text-lg font-semibold mb-2">아지트 이용요금</strong>
          <p className="text-gray-700 mb-4">
            1일 무제한: 6,000원 
            <br />
            1달 무제한(월정액) : 22,000원 
            <br />
            <strong>* 아지트를 이용하기 위해서는 참여시간대에 월정액 회원이 최소 1명 포함되어있어야합니다</strong>
            <br />
            <br />
            <br />
             <br />
            <strong className="text-lg font-semibold mb-2">주의 사항</strong>
            <br/>
            1. 자신이 참여하기로 한 시간은 반드시 지켜주세요.
            <br />
            2. 당일~2일 전쯤 벙 참여자는 반드시 일정을 취합해주세요.
            <br />
            3. 투표한 인원은 벙 참여자의 @멘션에 반드시 회신해주세요.
            <br />
            4. 당일협의/소통되지 않은 지각/노쇼 시 경고 조치 예정, 이 후 누적 시 아지트 사용 제재 예정
          </p>
        </div>
      </div>
    </div>
  );
}