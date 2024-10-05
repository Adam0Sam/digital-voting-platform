import { z } from "zod";

export const NIL_GRADE = "NONE";
export const Grades = [
  "IA",
  "IB",
  "IC",
  "ID",
  "IE",
  "IIA",
  "IIB",
  "IIC",
  "IID",
  "IIE",
  "IIIA",
  "IIIB",
  "IIIC",
  "IIID",
  "TB1",
  "IVA",
  "IVB",
  "IVC",
  "IVD",
  "TB2",
  NIL_GRADE,
] as const;

export type Grade = (typeof Grades)[number];

const GradeSchema = z.enum(Grades);

export const isGrade = (value: unknown): value is Grade => {
  return GradeSchema.safeParse(value).success;
};

export const toGrade = (gradeString: string): Grade => {
  const upperGrade = gradeString.toUpperCase();
  const slicedGrade = upperGrade.slice(0, 3);
  const grade = Grades.find((grade) => grade === slicedGrade);
  return grade ?? NIL_GRADE;
};
