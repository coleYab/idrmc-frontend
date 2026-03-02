import { UnauthorizedLayout } from "@/components/layouts/UnauthorizedLayout";

export default function Home() {
  return (
    <UnauthorizedLayout>
      <div>This is an authorized layout</div>
    </UnauthorizedLayout>
  );
}
