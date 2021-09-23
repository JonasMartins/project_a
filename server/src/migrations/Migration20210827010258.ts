import { Migration } from '@mikro-orm/migrations';

export class Migration20210827010258 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "team" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(50) not null, "description" varchar(255) not null);');
    this.addSql('alter table "team" add constraint "team_pkey" primary key ("id");');

    this.addSql('create table "team_members" ("team_id" uuid not null, "user_id" uuid not null);');
    this.addSql('alter table "team_members" add constraint "team_members_pkey" primary key ("team_id", "user_id");');

    this.addSql('alter table "team_members" add constraint "team_members_team_id_foreign" foreign key ("team_id") references "team" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "team_members" add constraint "team_members_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
