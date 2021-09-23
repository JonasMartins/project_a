import { Migration } from '@mikro-orm/migrations';

export class Migration20210826001325 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "role" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(50) not null, "code" varchar(3) not null, "description" varchar(255) not null, "wage" int4 not null);');
    this.addSql('alter table "role" add constraint "role_pkey" primary key ("id");');
  }

}
