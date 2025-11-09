import { Suspense } from "react";
import CrisisIssueDetection from "@/components/portals/issue-detection";

export default function CrisisPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">
                  Loading...
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">Loading crises...</p>
            </div>
          </div>
        }
      >
        <CrisisIssueDetection />
      </Suspense>
    </main>
  );
}
