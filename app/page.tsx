import { WellbeingSite } from '@/components/wellbeing-site';
export default function Home() {
  return <WellbeingSite bookingEnabled={Boolean(process.env.ORIENTATION_WEBHOOK_URL)} />;
}
