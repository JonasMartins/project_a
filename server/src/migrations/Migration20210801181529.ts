import { Migration } from '@mikro-orm/migrations';

export class Migration20210801181529 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "token_version" int4 not null default 0;');
  }

}
