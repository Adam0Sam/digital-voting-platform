export class JwtDto {
  iss: string;
  aud: string;
  exp: number;
  // idrc abt dependants rn
  dependants: any[];
  first_name: string;
  last_name: string;
  full_name: string;
  grade: string;
  raw_title: string;
  roles: string[];
}
