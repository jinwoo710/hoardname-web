export default function NoticePage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-4">공지사항</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
          <strong className="text-lg font-semibold mb-2">회칙</strong>
          <p className="text-gray-700 mb-4">
            <strong>1. 호드네임의 의미</strong>
            <br />
            <strong>호드네임(Hoard Name)</strong>은 Ha-Nam 과 Board game 의 합성어 입니다.
            <br />
            <br />
            <strong>2. 닉네임 변경</strong>
            <br />
           회원은 활동 전에 닉네임을 양식에 맞춘다.
            <br />
            <strong>2.1.</strong> 양식은 닉네임.성별.지역이다. ex)김밥.남.망월
            <br />
            <strong>2.2.</strong> 월회원으로 등록한 회원은 (월)을 붙여 표시한다. ex)김밥.남.망월(월)
            <br />
            <br />
            <strong>3. 위반되는 행위에 대한 방침</strong>
            <br />
            온라인/오프라인을 불문하고 아래와 같은 내용 또는 그 내용에 준하는 행위를 했다고 판단되는 회원은 매니저(방장) 또는 부매니저가 경고 부여 또는 즉시 제명한다.
            <br/>
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
           활동을 않거나 활동 의사가 없어 잔류가 무의미한 자
            <br />
            <strong>3.4. 노쇼나 지각을 일삼는 자</strong>
            <br />
            모임 참여자들과 협의나 소통을 하지 않고 잦은 노쇼나 지각으로 인해 모임 진행에 차질을 주는 자
             <br />
            <strong>3.5. 기타</strong>
            <br />
           그 밖에 관리자 또는 회원 간 동의하에 경고 부여 또는 제명이 필요하다고 판단되는 자 
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
             <strong className="text-lg font-semibold mb-2">모임참여 가능 날짜 투표</strong>
          <p className="text-gray-700 mb-4">
            <strong>1.</strong> 채팅방 상단 고정된 &apos;N월 N주차 투표&apos; 클릭
            <br />
            → 해당 날짜에 투표
            <br />
            → 원하는 날짜의 참여 인원 확인
            <br/>
           * 해당 모임 날짜에 월회원 1명 이상 필요
            <br />
            <br />
            <strong>2.</strong> 투표글 댓글에 참여 가능 시간 등 기재
            <br />
            → 양식: 요일 00시~00시 기타사항(모집인원, 지인 여부, 게임명 등)
            <br />
            ex)일 12시~16시 스플랜더(김밥+지인1, 2/4)
            <br />
            <br />
            <strong>3.</strong> 기존 참석자가 있다면 @닉네임으로 태그 걸어 알려주기
            <br />
           * 변동사항(불참, 지각 등) 발생 시 기존 참석자에게 태그로 알려주기
            <br />
            <br />
            </p>
         
        </div>
        <div className="flex flex-col space-y-4">
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
        <strong className="text-lg font-semibold mb-2">아지트 이용요금</strong>
          <p className="text-gray-700 mb-4">
            일회원: 6,000원
            <br />
            월회원(월정액): 22,000원/얼리버드 20,000원
            <br />
            * 아지트를 이용하기 위해서는 참여 시간대에 월회원이 최소 1명 있어야 한다.
            <br/>
            * 월회원 등록은 1일부터 해당 달의 말일까지이다.
            <br/>
            * 전달의 n일부터 해당 달의 n일까지 얼리버드로 월회원 등록이 가능하다.
            <br/>
            * 수차례 일회원으로 이용 후 월회원으로 등록하더라도 차액을 환불하지는 않는다.
            <br />
            </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg h-full transition duration-300">
                <p className="text-gray-700 mb-4">
            <strong className="text-lg font-semibold mb-2">주의 사항</strong>
            <br/>
            <strong>1.</strong> 참여하기로 한 시간은 반드시 엄수하여 주십시오.
            <br />
            <strong>2.</strong> 모임 주도자는 모임 2일 전이나 당일 반드시 일정을 취합하시기 바랍니다.
            <br />
            <strong>3.</strong> 투표한 인원은 모임 참여자의 @멘션에 반드시 회신하시기 바랍니다.
            <br />
            <strong>4.</strong> 회칙 제3조 제4항에 따라 협의 및 소통 없는 지각과 노쇼 1회 시 경고 조치를 가하며, 이후 n회 누적 시 아지트 사용을 제재합니다.
          </p>
        </div>
        </div>
        </div>
    </div>
  );
}