import { INestApplication } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { AuthService } from "./../src/auth/auth.service";
import { User } from "src/user/user.entity";
import { DataSource } from "typeorm";

export const tokenForUser = (
  app: INestApplication,
  user: Partial<User> = {
    id: 'bc9ec78c-7423-4d54-8125-204d503fb203',
    username: 'e2e-test',
  }
): string => {
  return app.get(AuthService).getTokenForUser(user as User);
}

export const loadFixtures = async (
  dataSource: DataSource, sqlFileName: string
) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8'
  );
  const queryRunner = dataSource.driver.createQueryRunner('master');
  for (const c of sql.split(';')) {
    await queryRunner.query(c);
  }
}