import { Migration } from '@mikro-orm/migrations';

export class Migration20210917173536 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "sprint" add column "active" bool not null;');
  }

}
