interface PatchCardProps {
  version: string;
  list: string[];
}

const PatchCard = ({ version, list }: PatchCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
      <h2 className="text-lg font-bold mb-2">{version}</h2>
      <ul className="list-disc px-4 pt-2">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default function PatchNotes() {
  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      <PatchCard
        version="v 1.2.2"
        list={['게임 목록 최적화', '중고 판매 목록 최적화']}
      />
      <PatchCard
        version="v 1.2.1"
        list={['게임 검색 기능 향상', '보드게임 이름 특수 문자 처리 추가']}
      />
      <PatchCard version="v 1.2.0" list={['DB 내 검색 기능 향상']} />
      <PatchCard version="v 1.1.3" list={['게임 목록 필터 추가']} />
      <PatchCard
        version="v 1.1.2"
        list={['My 장터 예약 및 삭제 추가', '헤더 사이드바 스티키 변경']}
      />
      <PatchCard
        version="v 1.1.1"
        list={[
          '중고 장터 필터 추가',
          '중고장터 나눔 처리 추가',
          '공지사항 내용 업데이트',
        ]}
      />
      <PatchCard
        version="v 1.1.0"
        list={['패치노트 추가', '버그/문의 기능 추가']}
      />
      <PatchCard version="v 1.0.0" list={['호드네임 웹 알파버전 오픈']} />
    </div>
  );
}
