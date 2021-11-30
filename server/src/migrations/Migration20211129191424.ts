import { Migration } from '@mikro-orm/migrations';

export class Migration20211129191424 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_leader_id_check";');
    this.addSql('alter table "team" alter column "leader_id" type uuid using ("leader_id"::uuid);');

    this.addSql('create table "news" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "description" varchar(255) not null, "creator_id" uuid not null);');
    this.addSql('alter table "news" add constraint "news_pkey" primary key ("id");');

    this.addSql('create table "news_related_users" ("news_id" uuid not null, "user_id" uuid not null);');
    this.addSql('alter table "news_related_users" add constraint "news_related_users_pkey" primary key ("news_id", "user_id");');

    this.addSql('alter table "news" add constraint "news_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "news_related_users" add constraint "news_related_users_news_id_foreign" foreign key ("news_id") references "news" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "news_related_users" add constraint "news_related_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
