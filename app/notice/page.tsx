function NoticeCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border bg-card p-5 shadow-sm transition duration-300 hover:shadow-md ${className ?? ''}`}
    >
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function NoticePage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-foreground">공지사항</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NoticeCard title="회칙">
          <ol className="list-decimal space-y-4 pl-4 text-sm leading-relaxed text-muted-foreground marker:font-semibold marker:text-foreground">
            <li>
              <span className="font-medium text-foreground">
                호드네임의 의미
              </span>
              <p className="mt-1">
                <strong className="text-foreground">
                  호드네임(Hoard Name)
                </strong>
                은 Ha-Nam 과 Board game 의 합성어 입니다.
              </p>
            </li>
            <li>
              <span className="font-medium text-foreground">닉네임 변경</span>
              <p className="mt-1">회원은 활동 전에 닉네임을 양식에 맞춘다.</p>
              <ol className="mt-2 list-[decimal] space-y-1 pl-4 marker:text-muted-foreground">
                <li>
                  양식은 닉네임.성별.지역이다.{' '}
                  <span className="text-foreground/80">ex) 김밥.남.망월</span>
                </li>
                <li>
                  월회원으로 등록한 회원은 (월)을 붙여 표시한다.{' '}
                  <span className="text-foreground/80">
                    ex) 김밥.남.망월(월)
                  </span>
                </li>
              </ol>
            </li>
            <li>
              <span className="font-medium text-foreground">
                위반되는 행위에 대한 방침
              </span>
              <p className="mt-1">
                온라인/오프라인을 불문하고 아래와 같은 내용 또는 그 내용에
                준하는 행위를 했다고 판단되는 회원은 매니저(방장) 또는
                부매니저가 경고 부여 또는 즉시 제명한다.
              </p>
              <ul className="mt-2 space-y-2">
                <li>
                  <span className="text-foreground/80">
                    무례한 행동이나 언행
                  </span>{' '}
                  — 무례한 행동이나 언행으로 불쾌감을 주는 자
                </li>
                <li>
                  <span className="text-foreground/80">회원간 분란</span> —
                  회원간 분란을 일으키는 자
                </li>
                <li>
                  <span className="text-foreground/80">활동의사가 없는 자</span>{' '}
                  — 활동을 않거나 활동 의사가 없어 잔류가 무의미한 자
                </li>
                <li>
                  <span className="text-foreground/80">
                    노쇼나 지각을 일삼는 자
                  </span>{' '}
                  — 모임 참여자들과 협의나 소통을 하지 않고 잦은 노쇼나 지각으로
                  인해 모임 진행에 차질을 주는 자
                </li>
                <li>
                  <span className="text-foreground/80">기타</span> — 그 밖에
                  관리자 또는 회원 간 동의하에 경고 부여 또는 제명이 필요하다고
                  판단되는 자
                </li>
              </ul>
            </li>
          </ol>
        </NoticeCard>

        <NoticeCard title="모임참여 가능 날짜 투표">
          <ol className="list-decimal space-y-4 pl-4 text-sm leading-relaxed text-muted-foreground marker:font-semibold marker:text-foreground">
            <li>
              채팅방 상단 고정된 &apos;N월 N주차 투표&apos; 클릭
              <ul className="mt-1 space-y-1 text-foreground/80">
                <li>→ 해당 날짜에 투표</li>
                <li>→ 원하는 날짜의 참여 인원 확인</li>
              </ul>
              <p className="mt-1 text-xs text-muted-foreground/80">
                * 해당 모임 날짜에 월회원 1명 이상 필요
              </p>
            </li>
            <li>
              투표글 댓글에 참여 가능 시간 등 기재
              <p className="mt-1 text-foreground/80">
                양식: 요일 00시~00시 기타사항(모집인원, 지인 여부, 게임명 등)
              </p>
              <p className="text-xs text-muted-foreground/80">
                ex) 일 12시~16시 스플랜더(김밥+지인1, 2/4)
              </p>
            </li>
            <li>
              기존 참석자가 있다면 @닉네임으로 태그 걸어 알려주기
              <p className="mt-1 text-xs text-muted-foreground/80">
                * 변동사항(불참, 지각 등) 발생 시 기존 참석자에게 태그로
                알려주기
              </p>
            </li>
          </ol>
        </NoticeCard>

        <div className="flex flex-col gap-4">
          <NoticeCard title="아지트 이용요금">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                <span className="text-muted-foreground">일회원</span>
                <span className="font-semibold text-foreground">6,000원</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                <span className="text-primary">월회원 (월정액)</span>
                <span className="font-semibold text-primary">10,000원</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              <li>
                * 아지트를 이용하기 위해서는 참여 시간대에 월회원이 최소 1명
                있어야 한다.
              </li>
              <li>* 월회원 등록은 1일부터 해당 달의 말일까지이다.</li>
              <li>
                * 전달의 n일부터 해당 달의 n일까지 얼리버드로 월회원 등록이
                가능하다.
              </li>
              <li>
                * 수차례 일회원으로 이용 후 월회원으로 등록하더라도 차액을
                환불하지는 않는다.
              </li>
            </ul>
          </NoticeCard>

          <NoticeCard title="주의 사항" className="h-full">
            <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:font-semibold marker:text-foreground">
              <li>참여하기로 한 시간은 반드시 엄수하여 주십시오.</li>
              <li>
                모임 주도자는 모임 2일 전이나 당일 반드시 일정을 취합하시기
                바랍니다.
              </li>
              <li>
                투표한 인원은 모임 참여자의 @멘션에 반드시 회신하시기 바랍니다.
              </li>
              <li>
                회칙 제3조 제4항에 따라 협의 및 소통 없는 지각과 노쇼 1회 시
                경고 조치를 가하며, 이후 n회 누적 시 아지트 사용을 제재합니다.
              </li>
            </ol>
          </NoticeCard>
        </div>
      </div>
    </div>
  );
}
