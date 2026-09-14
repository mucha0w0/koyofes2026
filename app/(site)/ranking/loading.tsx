import { Spinner } from '@/components/common/spinner';

export default function RankingLoading() {
  return (
    <div className="flex justify-center py-16">
      <Spinner className="size-6" />
    </div>
  );
}
