import prisma from "@/lib/prisma";
import { Enrollment } from "./Enrollment";

type CourseRow = NonNullable<
  Awaited<ReturnType<typeof prisma.course.findUnique>>
>;

export interface CourseProps {
  courseCode: string;
  courseTitle: string;
  units: number;
  semesterOffered: string;
  deptId: string;
}

export class Course {
  readonly courseCode: string; 
  courseTitle: string;
  units: number;
  semesterOffered: string;
  deptId: string;

  constructor(props: CourseProps) {
    this.courseCode = props.courseCode;
    this.courseTitle = props.courseTitle;
    this.units = props.units;
    this.semesterOffered = props.semesterOffered;
    this.deptId = props.deptId;
  }


  async getEnrollees(): Promise<Enrollment[]> {
    const rows = await prisma.enrollment.findMany({
      where: { courseCode: this.courseCode },
      orderBy: { studentNo: "asc" },
    });
    return rows.map(Enrollment.fromRecord);
  }

  static fromRecord(r: CourseRow): Course {
    return new Course(r);
  }

  static async findByCode(courseCode: string): Promise<Course | null> {
    const r = await prisma.course.findUnique({ where: { courseCode } });
    return r ? Course.fromRecord(r) : null;
  }
}
