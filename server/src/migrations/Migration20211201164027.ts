import { Migration } from '@mikro-orm/migrations';

export class Migration20211201164027 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_leader_id_check";');
    this.addSql('alter table "team" alter column "leader_id" type uuid using ("leader_id"::uuid);');

    this.addSql('alter table "news" add column "users_seen" text[] null;');
  }

}
