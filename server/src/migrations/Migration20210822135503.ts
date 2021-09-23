import { Migration } from '@mikro-orm/migrations';

export class Migration20210822135503 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" add column "priority" text check ("priority" in (\'HIGHEST\', \'HIGH\', \'MEDIUM\', \'LOW\', \'LOWEST\')) not null;');
  }

}
