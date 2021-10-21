import { Migration } from '@mikro-orm/migrations';

export class Migration20211002235112 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" drop constraint if exists "role_wage_check";');
    this.addSql('alter table "role" alter column "wage" type money using ("wage"::money);');

    this.addSql('alter table "user" add column "picure" varchar(255) null;');
  }

}
