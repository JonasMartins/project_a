import { Migration } from '@mikro-orm/migrations';

export class Migration20210816234132 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" add column "type" text check ("type" in (\'BUG\', \'TASK\', \'STORY\')) not null;');
  }

}
