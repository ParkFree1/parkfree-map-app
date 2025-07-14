import dynamic from 'next/dynamic';

const ParkFreeMap = dynamic(() => import('../components/ParkFreeMap'), { ssr: false });

export default function Home() {
  return <ParkFreeMap />;
}

