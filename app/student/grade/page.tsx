export default async function GradePage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Grades & Subjects
      </h1>
    </div>
  );
}