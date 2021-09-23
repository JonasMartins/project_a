import { Migration } from '@mikro-orm/migrations';

export class Migration20210828222545 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "team" add column "leader_id" text not null;');
  }

}
