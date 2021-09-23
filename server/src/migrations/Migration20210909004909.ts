import { Migration } from '@mikro-orm/migrations';

export class Migration20210909004909 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "project" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "description" text not null);');
    this.addSql('alter table "project" add constraint "project_pkey" primary key ("id");');

    this.addSql('alter table "sprint" add column "project_id" uuid not null;');

    this.addSql('alter table "sprint" add constraint "sprint_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
  }

}
