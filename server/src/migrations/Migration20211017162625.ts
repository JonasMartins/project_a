import { Migration } from '@mikro-orm/migrations';

export class Migration20211017162625 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "active" bool not null default true;');
  }

}
