import { Migration } from '@mikro-orm/migrations';

export class Migration20211130185625 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" drop constraint if exists "team_leader_id_check";');
    this.addSql('alter table "team" alter column "leader_id" type uuid using ("leader_id"::uuid);');

    this.addSql('alter table "news" add column "path_info" text not null;');
  }

}
