import  prisma  from "@/lib/prisma";
import { User } from "@/models/User";
import { Student } from "@/models/Student";
import { AdminUser } from "@/models/AdminUser";

export async function authenticate(username: string, password: string): Promise<User> {
  const rec = await prisma.user.findUnique({
    where: { username },
    include: { student: true, adminUser: true },
  });

  if (!rec) throw new Error("Invalid username or password");

  const user = rec.student
    ? Student.fromRecord(rec, rec.student)
    : rec.adminUser
      ? AdminUser.fromRecord(rec, rec.adminUser)
      : null;

  if (!user) throw new Error("Invalid username or password");

  await user.login(password);
  return user;
}
