import MainPage from "@/app/dashboard/main-page";
import Timeline from "@/components/timeline";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/timeline/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainPage>
      <Timeline />
    </MainPage>
  );
}
