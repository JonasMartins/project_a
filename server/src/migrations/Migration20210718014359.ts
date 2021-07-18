import { Migration } from '@mikro-orm/migrations';

export class Migration20210718014359 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "email" text null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
