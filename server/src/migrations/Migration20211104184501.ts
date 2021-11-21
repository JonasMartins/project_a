import { Migration } from '@mikro-orm/migrations';

export class Migration20211104184501 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" drop constraint if exists "comment_parent_id_check";');
    this.addSql('alter table "comment" alter column "parent_id" type uuid using ("parent_id"::uuid);');
    this.addSql('alter table "comment" alter column "parent_id" drop not null;');
  }

}
