import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="min-h-dvh bg-app-background px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full items-start justify-center pt-[max(1rem,7vh)] sm:min-h-[calc(100dvh-6rem)] sm:items-center sm:pt-0">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
