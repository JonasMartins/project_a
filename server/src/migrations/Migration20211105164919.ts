import { Migration } from '@mikro-orm/migrations';

export class Migration20211105164919 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "order" int4 not null default 1;');
  }

}
