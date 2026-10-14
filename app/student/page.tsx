import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Page = () => {
  return (
    <main className="w-full min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Welcome, Michael Jordan!
          </h1>
          <span className="text-sm text-muted-foreground sm:text-base">
            Student
          </span>
        </div>

        <Button className="w-full p-5 shrink-0 cursor-pointer bg-amber-600 px-5 hover:bg-amber-500 sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New document request
        </Button>
      </header>

      {/* Overview Section */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <div className="min-w-0 rounded-xl border bg-card p-5">
          <h1 className="text-4xl text-green-600">3.75</h1>
          <br />
          <span className="text-sm text-gray-700">
            General Weighted Average
          </span>
        </div>

        <div className="min-w-0 rounded-xl border bg-card p-5">
          <h1 className="text-4xl text-green-600">8</h1>
          <br />
          <span className="text-sm text-gray-700">Enlisted subjects</span>
        </div>

        <div className="min-w-0 rounded-xl border bg-card p-5 sm:col-span-2 xl:col-span-1">
          <h1 className="text-4xl text-green-600">3</h1>
          <br />
          <span className="text-sm text-gray-700">Document requests</span>
        </div>

        <div className="min-w-0 rounded-xl border bg-card p-5 sm:col-span-2 xl:col-span-1">
          <h1 className="text-4xl text-green-600">₱2,450</h1>
          <br />
          <span className="text-sm text-gray-700">Amount due</span>
        </div>
      </section>

      {/* Main Content */}
      <section className="mt-8 grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Documents Table */}
        <div className="min-w-0 rounded-xl border bg-card xl:col-span-2">
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">
              Recent Requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage your document requests.
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-6">REQUEST NO.</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Document</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Copies</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Fee</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground sm:px-6"
                  >
                    No document requests yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside className="min-w-0 overflow-hidden rounded-xl border bg-card">
          {/* Header */}
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">
              Clearance Status
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check your clearance progress.
            </p>
          </div>

          {/* Clearance List */}
          <div className="space-y-4 p-4 sm:p-6">
            {["Registrar", "Cashier", "College Department", "Library"].map(
              (department) => (
                <div
                  key={department}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-lg border p-3 sm:p-4"
                >
                  <span className="min-w-0 break-words text-sm font-medium sm:text-base">
                    {department}
                  </span>

                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    Pending
                  </span>
                </div>
              ),
            )}

            {/* Warning Message */}
            <div className="flex min-w-0 gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30 sm:p-4">
              <div className="min-w-0 space-y-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  On hold
                </h3>

                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-200">
                  TOR and Good Moral requests are blocked until the library
                  signs your clearance.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default memo(Page);
