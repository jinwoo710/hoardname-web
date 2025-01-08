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
        <PatchCard version="v 1.1.0" list={['패치노트 추가', '버그/문의 기능 추가']}/>
        <PatchCard version="v 1.0.0" list={['호드네임 웹 알파버전 오픈']}/>
        </div>
  );
}